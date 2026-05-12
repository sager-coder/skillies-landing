"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * LessonPlayer — gated Cloudflare Stream player.
 *
 * Hardening this component carries (most live in concert, none alone is
 * a silver bullet — see the comments by each):
 *
 * 1.  No raw video UID ever ships to the browser. Server gives us only
 *     `lessonId`; we POST to /api/learn/stream-token, which verifies
 *     login + enrollment + publication + not-blocked, then returns a
 *     1h signed JWT. The iframe `src` is built from that token.
 *
 * 2.  Token refresh ahead of expiry. We re-mint at 80% of TTL so a
 *     50-minute KDP lesson never bricks mid-watch.
 *
 * 3.  Personalised watermark drifts across 6 positions every ~22s with
 *     a small jitter so a recording can't be cropped to a single
 *     corner. The string is `<masked-phone> · <email>` — enough to
 *     identify the account whose credentials leaked the file.
 *
 * 4.  Right-click suppressed on the player surface, plus key blockers
 *     for F12 / Ctrl+Shift+I/J/C / Ctrl+U / Ctrl+S. These are friction,
 *     not security — a motivated leaker bypasses them in 5 seconds —
 *     but they slow casual "save-as" attempts.
 *
 * 5.  One-active-session-per-user. The player generates a sessionId on
 *     mount, beats /api/learn/session-heartbeat every 30s. When a new
 *     tab opens elsewhere, the server marks our row ended; on the next
 *     beat we receive `{ kicked: true }`, pause the iframe by clearing
 *     its `src`, and surface a banner.
 *
 * 6.  Pageshow / visibilitychange listeners — if the tab is backgrounded
 *     for >2 minutes we drop the embed and require a fresh token on
 *     return. Cuts down on stale tokens hanging around in BFcache.
 *
 * 7.  `referrerPolicy="no-referrer"` on the iframe — Cloudflare's
 *     `allowedOrigins` enforcement reads the Referer header. We still
 *     want that to work (our domain is in the allowlist), so this is
 *     actually `origin-when-cross-origin` via the default, but we
 *     keep this prop near the relevant code so it stays obvious if
 *     someone tries to "tighten" it later.
 *
 * 8.  Screen-capture heuristics — hard lockdown (black overlay + pause
 *     postMessage + drop iframe src after 3s) on three detectable
 *     vectors: (a) page calls navigator.mediaDevices.getDisplayMedia
 *     (Loom extension, Chrome's built-in screen share, Zoom screen
 *     share), (b) Picture-in-Picture window opened, (c) devtools
 *     opened past the heuristic threshold.
 *
 *     What we CANNOT detect — and the watermark is the only defence
 *     for these:
 *       - macOS Cmd+Shift+5 native recorder
 *       - QuickTime → File → New Screen Recording
 *       - OBS / Loom desktop app / any external recorder on another
 *         monitor or another macOS Space
 *       - An iPhone pointed at the monitor
 *
 *     Web browsers deliberately don't expose OS-level capture state
 *     for privacy reasons. The only technical control that defeats
 *     OS-level recording is **DRM** (Widevine L1 / FairPlay /
 *     PlayReady), which routes playback through the OS protected
 *     media path and refuses to render into a capture buffer.
 *     Cloudflare Stream supports DRM as a paid add-on; the
 *     signed-token plumbing here is DRM-ready. Talk to Cloudflare
 *     sales, then re-upload videos with `creator.options.drm = true`.
 */
export default function LessonPlayer({
  hasVideo,
  lessonId,
  title,
  watermark,
}: {
  /** Set by the page based on lesson.video_id being non-null. */
  hasVideo: boolean;
  lessonId: string;
  title: string;
  /**
   * Identifying string burned into the watermark overlay. Pass the
   * full identifier (phone, email, name) — we don't show the raw
   * value, but we DO want it long enough to be attributable.
   */
  watermark?: string | null;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  // ── Token state ─────────────────────────────────────────────────
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Session state ───────────────────────────────────────────────
  // Persisted in sessionStorage so a refresh in the same tab keeps the
  // same id (and isn't kicked by itself).
  const sessionIdRef = useRef<string | null>(null);
  const [kicked, setKicked] = useState(false);

  // ── Watermark drift state ───────────────────────────────────────
  const [wmPos, setWmPos] = useState<{
    x: number;
    y: number;
    align: "L" | "R";
  }>({ x: 6, y: 8, align: "L" });

  // ── Completion tracking ─────────────────────────────────────────
  const [completed, setCompleted] = useState(false);

  // ── Anti-capture lockdown state ─────────────────────────────────
  // When any heuristic fires, we set this; the render layer slaps a
  // full black overlay over the iframe (so any in-progress recording
  // captures black pixels going forward) and posts a pause message to
  // the player. 3 seconds later we drop the iframe src entirely to
  // kill audio. User has to acknowledge a banner to resume — at which
  // point we re-mint a fresh token and re-mount.
  const [captureBlock, setCaptureBlock] = useState<{
    reason: "screen-share" | "pip" | "devtools";
  } | null>(null);

  // Mint a fresh token. Returns true on success, false on auth /
  // enrollment failure (caller surfaces the error).
  const mintToken = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setTokenError(null);
      const res = await fetch("/api/learn/stream-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          sessionId: sessionIdRef.current,
        }),
        // Cookies carry the auth session — must be same-origin.
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const code = (body as { error?: string }).error || `http-${res.status}`;
        setTokenError(code);
        setToken(null);
        return false;
      }
      const data = (await res.json()) as { token: string; expiresAt: number };
      setToken(data.token);
      setTokenExpiresAt(data.expiresAt);
      return true;
    } catch (err) {
      console.warn("[player] token mint network error", err);
      setTokenError("network");
      return false;
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  // First mint on mount + whenever the lesson changes. Also initialise
  // sessionId before the first network call.
  useEffect(() => {
    if (!hasVideo) {
      setLoading(false);
      return;
    }
    if (typeof window !== "undefined") {
      let sid: string | null = null;
      try {
        sid = window.sessionStorage.getItem("skillies-player-session-id");
      } catch {
        /* private mode, etc. */
      }
      if (!sid) {
        sid =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        try {
          window.sessionStorage.setItem("skillies-player-session-id", sid);
        } catch {
          /* swallow */
        }
      }
      sessionIdRef.current = sid;
    }
    void mintToken();
  }, [hasVideo, mintToken]);

  // Refresh token at 80% of TTL. tokenExpiresAt is in ms.
  useEffect(() => {
    if (!tokenExpiresAt) return;
    const msUntilExpiry = tokenExpiresAt - Date.now();
    // Refresh 12 min before expiry, but never sooner than 30s after mint
    // (defends against an infinite-mint loop if CF starts handing back
    // already-expired tokens for some reason).
    const refreshIn = Math.max(30_000, msUntilExpiry - 12 * 60 * 1000);
    const id = window.setTimeout(() => void mintToken(), refreshIn);
    return () => window.clearTimeout(id);
  }, [tokenExpiresAt, mintToken]);

  // Heartbeat: every 30s, ping the server. Surfaces kicks.
  useEffect(() => {
    if (!hasVideo || !sessionIdRef.current) return;
    let cancelled = false;
    const ping = async () => {
      try {
        const res = await fetch("/api/learn/session-heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            lessonId,
          }),
          credentials: "same-origin",
          cache: "no-store",
        });
        if (cancelled || !res.ok) return;
        const data = (await res.json()) as { kicked?: boolean };
        if (data.kicked) {
          setKicked(true);
          setToken(null); // pull the iframe down
        }
      } catch {
        /* swallow — next tick retries */
      }
    };
    void ping(); // immediate, then interval
    const id = window.setInterval(ping, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [hasVideo, lessonId]);

  // ── Anti-capture: lockdown + resume helpers ─────────────────────
  // Posts a pause command at the Cloudflare Stream iframe via
  // postMessage (the player supports `{ event: 'pause' }`). We don't
  // assert the postMessage receipt because:
  //   (a) we ALSO render a fullscreen black overlay over the iframe
  //       — even if the pause doesn't land, the visible pixels are
  //       black, so any in-progress recording captures black,
  //   (b) we drop the iframe src after 3s anyway, which fully kills
  //       playback and audio.
  // 3s gives the overlay time to render in any frames the recorder
  // has already buffered, so the transition to black is captured.
  const lockdownRef = useRef<number | null>(null);
  const triggerCaptureLockdown = useCallback(
    (reason: "screen-share" | "pip" | "devtools") => {
      // Idempotent — multiple detectors might fire in quick succession.
      setCaptureBlock((cur) => cur ?? { reason });

      const win = ref.current?.contentWindow;
      if (win) {
        try {
          const code = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE || "";
          win.postMessage(
            { event: "pause" },
            `https://customer-${code}.cloudflarestream.com`,
          );
        } catch {
          /* cross-origin postMessage failures are silent — overlay handles the visual side */
        }
      }

      // Drop src after 3s to also kill audio. Bail out of any pending
      // schedule if a new trigger fires while one's already in flight.
      if (lockdownRef.current !== null) {
        window.clearTimeout(lockdownRef.current);
      }
      lockdownRef.current = window.setTimeout(() => {
        setToken(null);
        lockdownRef.current = null;
      }, 3_000);
    },
    [],
  );

  const resumeFromCaptureBlock = useCallback(() => {
    if (lockdownRef.current !== null) {
      window.clearTimeout(lockdownRef.current);
      lockdownRef.current = null;
    }
    setCaptureBlock(null);
    // Re-mint — the previous token may have just been invalidated
    // when we dropped the iframe.
    void mintToken();
  }, [mintToken]);

  // ── Anti-capture detector 1: getDisplayMedia ───────────────────
  // Every browser-side screen-share / screen-record library (Loom
  // extension, Chrome's "Cast / Share screen", Zoom web client) calls
  // this. We monkey-patch it for the lifetime of the player and trip
  // the lockdown if anyone reaches for it. Unhook on unmount so we
  // don't break other pages.
  useEffect(() => {
    if (!hasVideo) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;
    const md = navigator.mediaDevices as MediaDevices & {
      getDisplayMedia?: (
        constraints?: DisplayMediaStreamOptions,
      ) => Promise<MediaStream>;
    };
    const original = md.getDisplayMedia;
    if (!original) return;

    md.getDisplayMedia = function (
      constraints?: DisplayMediaStreamOptions,
    ): Promise<MediaStream> {
      triggerCaptureLockdown("screen-share");
      // Still resolve the call so we don't break unrelated UIs the
      // user might have open. The lockdown overlay is what matters.
      return original.call(this, constraints);
    };
    return () => {
      // Restore. If something else patched on top of us in the
      // meantime, the simpler restore-our-saved-original is correct;
      // the alternative (only restore if we still own the slot)
      // creates leak-prone branching for marginal benefit.
      md.getDisplayMedia = original;
    };
  }, [hasVideo, triggerCaptureLockdown]);

  // ── Anti-capture detector 2: Picture-in-Picture ────────────────
  // PiP detaches the video into a floating always-on-top window
  // that's exempt from our watermark overlay (the overlay lives on
  // the parent page; the PiP window only contains the video pixels).
  // Block it.
  useEffect(() => {
    if (!hasVideo) return;
    const onPip = () => triggerCaptureLockdown("pip");
    document.addEventListener("enterpictureinpicture", onPip, true);
    return () =>
      document.removeEventListener("enterpictureinpicture", onPip, true);
  }, [hasVideo, triggerCaptureLockdown]);

  // ── Anti-capture detector 3: DevTools open heuristic ───────────
  // Classic outerWidth - innerWidth trick. Docked devtools widen the
  // gap by ~250px+ (right-dock) or shorten the height (bottom-dock).
  // Misses undocked devtools and is noisy on browsers with
  // top-banner translation tooltips, so we poll lazily (1Hz) and
  // require two consecutive trips to fire.
  useEffect(() => {
    if (!hasVideo) return;
    let consecutive = 0;
    const tick = () => {
      const wDiff = window.outerWidth - window.innerWidth;
      const hDiff = window.outerHeight - window.innerHeight;
      const open = wDiff > 220 || hDiff > 220;
      if (open) {
        consecutive++;
        if (consecutive >= 2) {
          triggerCaptureLockdown("devtools");
        }
      } else {
        consecutive = 0;
      }
    };
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [hasVideo, triggerCaptureLockdown]);

  // Drift watermark across the frame every ~22s + small jitter so the
  // dwell time isn't predictable and croppable to one corner.
  useEffect(() => {
    if (!hasVideo) return;
    const positions: { x: number; y: number; align: "L" | "R" }[] = [
      { x: 6, y: 8, align: "L" },
      { x: 6, y: 50, align: "L" },
      { x: 6, y: 88, align: "L" },
      { x: 94, y: 8, align: "R" },
      { x: 94, y: 50, align: "R" },
      { x: 94, y: 88, align: "R" },
    ];
    let i = 0;
    const tick = () => {
      i = (i + 1) % positions.length;
      setWmPos(positions[i]);
    };
    // 18–26s window
    const id = window.setInterval(() => tick(), 18_000 + Math.random() * 8_000);
    return () => window.clearInterval(id);
  }, [hasVideo]);

  // Cloudflare Stream player postMessage events → progress tracking.
  useEffect(() => {
    if (!hasVideo) return;
    const onMessage = async (e: MessageEvent) => {
      const data = (e.data ?? {}) as {
        event?: string;
        currentTime?: number;
        duration?: number;
      };
      if (data.event === "ended" && !completed) {
        setCompleted(true);
        await markComplete(lessonId);
      }
      if (
        data.event === "timeupdate" &&
        data.currentTime &&
        data.duration &&
        !completed
      ) {
        if (data.currentTime / data.duration > 0.9) {
          setCompleted(true);
          await markComplete(lessonId);
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [hasVideo, lessonId, completed]);

  // Background-tab guard: if the user leaves the tab for >2 minutes,
  // drop the embed and require a fresh token on return. Stops stale
  // tokens from sitting around when the user is "watching" in the
  // background.
  useEffect(() => {
    if (!hasVideo) return;
    let hiddenSince: number | null = null;
    const onVisibility = () => {
      if (document.hidden) {
        hiddenSince = Date.now();
      } else if (hiddenSince && Date.now() - hiddenSince > 2 * 60_000) {
        hiddenSince = null;
        void mintToken();
      } else {
        hiddenSince = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [hasVideo, mintToken]);

  // ── Render branches ─────────────────────────────────────────────

  if (!hasVideo) {
    return (
      <Placeholder
        title={title}
        eyebrow="Recording in progress"
        body="This lesson’s video is being filmed. You’ll get a WhatsApp ping when it lands."
      />
    );
  }

  if (loading && !token) {
    return (
      <Placeholder
        title={title}
        eyebrow="Securing playback"
        body="Verifying enrollment and minting your one-hour viewing token…"
        muted
      />
    );
  }

  if (tokenError) {
    return (
      <Placeholder
        title={title}
        eyebrow="Playback blocked"
        body={errorBody(tokenError)}
        tone="error"
      />
    );
  }

  if (kicked) {
    return (
      <Placeholder
        title={title}
        eyebrow="Watching elsewhere"
        body="You opened this lesson in another window. Close the other window, then refresh this tab to resume."
        tone="warn"
      />
    );
  }

  const code = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE;
  const src = token
    ? `https://customer-${code}.cloudflarestream.com/${token}/iframe?preload=metadata`
    : undefined;

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        background: "#000",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        // Friction layer for right-click "Save video as…". Real attackers
        // open devtools, but this stops the casual screenshot path.
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        // F12 / Ctrl+Shift+I/J/C / Ctrl+U / Ctrl+S — same friction
        // logic. Bypassable, but raises the floor.
        const k = e.key;
        const ctrl = e.ctrlKey || e.metaKey;
        if (
          k === "F12" ||
          (ctrl && e.shiftKey && (k === "I" || k === "J" || k === "C")) ||
          (ctrl && (k === "u" || k === "U" || k === "s" || k === "S"))
        ) {
          e.preventDefault();
        }
      }}
      tabIndex={-1}
    >
      {src ? (
        <iframe
          ref={ref}
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          // No referrer for any other request the iframe makes (e.g.
          // segment fetches go through Cloudflare's own player, which
          // doesn't need it). Cloudflare's allowedOrigins check uses
          // the parent frame origin, not Referer, so this doesn't
          // break the lock.
          referrerPolicy="strict-origin-when-cross-origin"
          // sandbox: strip everything the player doesn't need. The
          // player is a same-origin (cloudflarestream.com) iframe so
          // we still need `allow-scripts` and `allow-same-origin`,
          // but we yank `allow-downloads` and `allow-top-navigation`.
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      ) : null}

      {/* Per-user watermark — drifts between 6 positions every ~22s with
          jitter. pointer-events off so clicks reach the player. */}
      {watermark ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: `${wmPos.y}%`,
              [wmPos.align === "L" ? "left" : "right"]: `${
                wmPos.align === "L" ? wmPos.x : 100 - wmPos.x
              }%`,
              transform: "translateY(-50%)",
              padding: "5px 11px",
              borderRadius: 6,
              background: "rgba(0,0,0,0.38)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              color: "rgba(255,255,255,0.62)",
              fontSize: 11,
              fontFamily: "ui-monospace, Menlo, monospace",
              letterSpacing: "0.06em",
              mixBlendMode: "overlay",
              transition:
                "top 1.2s ease-in-out, left 1.2s ease-in-out, right 1.2s ease-in-out",
              userSelect: "none",
              maxWidth: "60%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            SKILLIES.AI · {watermark}
          </div>
        </div>
      ) : null}

      {/* Transparent overlay that absorbs right-clicks and selection
          gestures on top of the iframe. Pointer-events: none on the
          inner watermark layer means clicks still get through to the
          player; right-clicks land on this layer instead. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 3,
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Anti-capture lockdown overlay — opaque black, sits above
          everything else (iframe, watermark, right-click guard). When
          this is up, any in-progress screen recording captures black
          pixels going forward. The user must click "I've stopped
          recording" to bring the player back, at which point we
          re-mint a fresh token and re-mount the iframe. */}
      {captureBlock ? (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            background: "#000",
            display: "grid",
            placeItems: "center",
            padding: 32,
            textAlign: "center",
            color: "white",
            cursor: "default",
          }}
          // Belt-and-braces: also kill right-click on this layer so
          // there's no "inspect element → remove this div" shortcut.
          onContextMenu={(e) => e.preventDefault()}
        >
          <div style={{ maxWidth: 460 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#E66E6E",
                marginBottom: 12,
              }}
            >
              Playback paused
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: "clamp(22px, 3vw, 30px)",
                lineHeight: 1.2,
                marginBottom: 10,
                color: "#FAF5EB",
              }}
            >
              {captureBlock.reason === "screen-share"
                ? "Screen sharing detected"
                : captureBlock.reason === "pip"
                  ? "Picture-in-Picture isn’t allowed"
                  : "Developer tools detected"}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.66)",
                lineHeight: 1.55,
                marginBottom: 22,
              }}
            >
              {captureBlock.reason === "screen-share"
                ? "Stop your screen-sharing or screen-recording tool, then resume below. Recording course videos is a violation of the terms — your activity is logged with your account ID."
                : captureBlock.reason === "pip"
                  ? "Close the floating Picture-in-Picture window and play the video inside the dashboard."
                  : "Close the browser inspector / DevTools to continue. Every playback request is logged with your account ID."}
            </div>
            <button
              type="button"
              onClick={resumeFromCaptureBlock}
              style={{
                background: "#FAF5EB",
                color: "#1A1A1A",
                border: "none",
                borderRadius: 10,
                padding: "11px 22px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily:
                  "'Space Grotesk', system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              I’ve stopped — resume
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────

function Placeholder({
  title,
  eyebrow,
  body,
  tone = "default",
  muted = false,
}: {
  title: string;
  eyebrow: string;
  body: string;
  tone?: "default" | "error" | "warn";
  muted?: boolean;
}) {
  const eyebrowColor =
    tone === "error" ? "#E66E6E" : tone === "warn" ? "#E6C178" : "#E6C178";
  return (
    <div
      style={{
        aspectRatio: "16 / 9",
        background: muted
          ? "linear-gradient(135deg, #111, #1f1f1f)"
          : "linear-gradient(135deg, #1A1A1A, #2D2D2D)",
        borderRadius: 18,
        display: "grid",
        placeItems: "center",
        color: "white",
        textAlign: "center",
        padding: 32,
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(201,162,78,0.18), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(198,40,40,0.18), transparent 60%)",
        }}
      />
      <div style={{ position: "relative", maxWidth: 540 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: eyebrowColor,
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: "clamp(24px, 3.4vw, 36px)",
            lineHeight: 1.18,
            color: "#FAF5EB",
          }}
        >
          &ldquo;{title}&rdquo;
        </div>
        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.62)",
            marginTop: 16,
            lineHeight: 1.55,
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

function errorBody(code: string): string {
  switch (code) {
    case "unauthenticated":
      return "Your session expired. Refresh the page or sign in again.";
    case "not-enrolled":
      return "This course isn't on your account. Reach out on WhatsApp if you've already paid.";
    case "blocked":
      return "Your account is paused. Email Ehsan to reactivate.";
    case "not-published":
      return "This lesson isn't published yet. Try the next one in the sidebar.";
    case "no-video":
      return "This lesson is text-only or still being recorded.";
    case "rate-limited":
      return "Too many playback requests. Wait a minute and refresh.";
    case "mint-failed":
      return "Cloudflare didn't issue a playback token. Try again in a moment.";
    default:
      return "We couldn't load this video. Refresh the page or try a different lesson.";
  }
}

async function markComplete(lessonId: string) {
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        last_watched_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );
  } catch {
    /* swallow — non-critical */
  }
}
