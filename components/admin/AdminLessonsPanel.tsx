"use client";

import React, { useEffect, useState } from "react";

type Lesson = {
  id: string;
  course_id: string;
  day: number;
  title: string;
  description: string | null;
  video_id: string | null;
  duration_seconds: number | null;
  is_published: boolean;
};

const COURSES = [
  { id: "kdp-mastery", label: "KDP Mastery · 50-Day" },
];

type Msg = { kind: "ok"; text: string } | { kind: "err"; text: string } | null;

function parseDuration(input: string): number | null {
  const s = input.trim();
  if (!s) return null;
  // Accept "5:12" (m:s), "12:34:56" (h:m:s), "45" (seconds), "5m 12s", "45s", "5m"
  const hms = s.match(/^(\d+):(\d+):(\d+)$/);
  if (hms) return +hms[1] * 3600 + +hms[2] * 60 + +hms[3];
  const ms = s.match(/^(\d+):(\d+)$/);
  if (ms) return +ms[1] * 60 + +ms[2];
  const shorthand = s.match(/^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?$/i);
  if (shorthand && (shorthand[1] || shorthand[2] || shorthand[3])) {
    return (+(shorthand[1] || 0)) * 3600 + (+(shorthand[2] || 0)) * 60 + (+(shorthand[3] || 0));
  }
  const n = Number(s);
  if (Number.isFinite(n) && n > 0) return Math.round(n);
  return null;
}

function formatDuration(secs: number | null): string {
  if (!secs) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AdminLessonsPanel() {
  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  // add/edit form state
  const [day, setDay] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoId, setVideoId] = useState("");
  const [durationStr, setDurationStr] = useState("");
  const [publish, setPublish] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/lessons?course_id=${encodeURIComponent(courseId)}`);
      const data = (await res.json()) as { ok?: boolean; lessons?: Lesson[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setLessons(data.lessons || []);
    } catch (e: unknown) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Failed to load." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const duration_seconds = parseDuration(durationStr);
    const dayNum = Number(day);
    if (!Number.isInteger(dayNum) || dayNum < 1) {
      setMsg({ kind: "err", text: "Day must be a positive integer (1, 2, 3…)." });
      return;
    }
    if (!title.trim()) {
      setMsg({ kind: "err", text: "Title is required." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          day: dayNum,
          title: title.trim(),
          description: description.trim() || undefined,
          video_id: videoId.trim() || undefined,
          duration_seconds: duration_seconds ?? undefined,
          is_published: publish,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMsg({
        kind: "ok",
        text: `Saved Day ${dayNum} · ${title.trim()}. ${publish ? "Published." : "Draft."}`,
      });
      setDay("");
      setTitle("");
      setDescription("");
      setVideoId("");
      setDurationStr("");
      setPublish(true);
      void load();
    } catch (e: unknown) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Save failed." });
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (lesson: Lesson) => {
    setMsg(null);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: lesson.id, is_published: !lesson.is_published }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Toggle failed");
      void load();
    } catch (e: unknown) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Toggle failed." });
    }
  };

  return (
    <div
      style={{
        padding: 28,
        background: "white",
        borderRadius: 20,
        border: "1px solid rgba(26,26,26,0.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#5B7B5B",
          marginBottom: 8,
        }}
      >
        Lessons
      </div>
      <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 18px", lineHeight: 1.55 }}>
        Drop a Cloudflare Stream <b>Video UID</b> (the 32-char hex from the embed URL) plus a
        title + duration. Publishing makes the lesson visible on{" "}
        <code style={{ fontSize: 12 }}>/learn/{COURSES[0].id}</code> to enrolled students.
      </p>

      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 1fr 140px", gap: 12, marginBottom: 12 }}>
          <Field label="Course">
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              style={inputStyle}
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Day">
            <input
              type="number"
              min={1}
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="1"
              style={inputStyle}
              required
            />
          </Field>
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chapter 1 · Why niche matters"
              style={inputStyle}
              required
            />
          </Field>
          <Field label="Duration (m:ss)">
            <input
              type="text"
              value={durationStr}
              onChange={(e) => setDurationStr(e.target.value)}
              placeholder="8:42"
              style={inputStyle}
            />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px", gap: 12, marginBottom: 12 }}>
          <Field label="Description (optional)">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One-line description that appears on the lesson card"
              style={inputStyle}
            />
          </Field>
          <Field label="Cloudflare Video UID">
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="31c9581b41acbd71375f5…"
              style={{ ...inputStyle, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13 }}
            />
          </Field>
          <Field label="Publish?">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 14px",
                border: "1.5px solid #F0E8D8",
                borderRadius: 10,
                background: "#FAF5EB",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
              />
              <span>{publish ? "Yes, live" : "Draft only"}</span>
            </label>
          </Field>
        </div>

        <button
          type="submit"
          disabled={busy}
          style={{
            padding: "12px 24px",
            background: busy ? "#3D5A3D" : "#5B7B5B",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: 999,
            cursor: busy ? "wait" : "pointer",
            boxShadow: "0 10px 24px rgba(91,123,91,0.22)",
          }}
        >
          {busy ? "Saving…" : "Save lesson"}
        </button>

        {msg && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background:
                msg.kind === "ok"
                  ? "rgba(91,123,91,0.10)"
                  : "rgba(198,40,40,0.08)",
              border:
                msg.kind === "ok"
                  ? "1px solid rgba(91,123,91,0.35)"
                  : "1px solid rgba(198,40,40,0.25)",
              color: msg.kind === "ok" ? "#3D5A3D" : "#C62828",
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            {msg.text}
          </div>
        )}
      </form>

      <div
        style={{
          marginTop: 28,
          paddingTop: 22,
          borderTop: "1px dashed rgba(26,26,26,0.12)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#9CA3AF",
            marginBottom: 12,
          }}
        >
          Existing lessons · {lessons.length}
        </div>
        {loading ? (
          <div style={{ padding: 18, color: "#9CA3AF", fontSize: 13 }}>Loading…</div>
        ) : lessons.length === 0 ? (
          <div style={{ padding: 18, color: "#9CA3AF", fontSize: 13 }}>
            No lessons yet. Add Day 1 above and it&rsquo;ll show up here.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAF5EB" }}>
                  {["Day", "Title", "Video UID", "Duration", "Status", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        borderBottom: "1px solid rgba(26,26,26,0.06)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => (
                  <tr key={l.id}>
                    <td style={cellStyle}>{l.day}</td>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>{l.title}</td>
                    <td
                      style={{
                        ...cellStyle,
                        fontFamily: "ui-monospace, Menlo, monospace",
                        fontSize: 11,
                        color: l.video_id ? "#1A1A1A" : "#C62828",
                      }}
                    >
                      {l.video_id ? `${l.video_id.slice(0, 10)}…` : "no video yet"}
                    </td>
                    <td style={{ ...cellStyle, color: "#6B7280", fontFamily: "ui-monospace, Menlo, monospace" }}>
                      {formatDuration(l.duration_seconds)}
                    </td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 10,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          background: l.is_published
                            ? "rgba(91,123,91,0.12)"
                            : "rgba(26,26,26,0.06)",
                          color: l.is_published ? "#3D5A3D" : "#6B7280",
                        }}
                      >
                        {l.is_published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <button
                        type="button"
                        onClick={() => void togglePublish(l)}
                        style={{
                          padding: "6px 12px",
                          background: "transparent",
                          border: "1px solid rgba(26,26,26,0.18)",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#1A1A1A",
                          cursor: "pointer",
                        }}
                      >
                        {l.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#9CA3AF",
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  fontSize: 14,
  border: "1.5px solid #F0E8D8",
  borderRadius: 10,
  outline: "none",
  background: "#FAF5EB",
  color: "#1A1A1A",
};

const cellStyle: React.CSSProperties = {
  padding: "10px 12px",
  color: "#1A1A1A",
  borderTop: "1px solid rgba(26,26,26,0.04)",
  verticalAlign: "middle",
};
