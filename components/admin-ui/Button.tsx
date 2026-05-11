// Button — the canonical action element for the admin dashboard.
//
// Variants:
//   primary   — red filled (brand `#C62828`). Use for the *one* main action per surface.
//   secondary — white with hairline border. Use for the common "Cancel" / neutral action.
//   ghost     — transparent, hover tint. Use inline inside a row or toolbar.
//   danger    — red outline (text + border red, transparent bg). Use for destructive intents.
//
// Sizes: `sm` (28px) for table rows / toolbars; `md` (38px) for forms and the
// primary surface action. The `loading` flag shows a spinner and disables the
// button without un-mounting it.

"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style"
> & {
  variant?: Variant;
  size?: Size;
  /** Show a spinner and prevent clicks. Implies `disabled`. */
  loading?: boolean;
  /** Optional ReactNode rendered to the left of the children. */
  icon?: ReactNode;
  /** Merged onto the rendered element. */
  style?: CSSProperties;
  /** Mixed with the internal Tailwind classes (cursor, transition). */
  className?: string;
};

function variantStyles(variant: Variant, disabled: boolean): CSSProperties {
  if (disabled) {
    // Single muted look across variants when disabled.
    return {
      background: variant === "primary" ? "#EFEFEF" : "#FFFFFF",
      color: "#A3A3A3",
      border:
        variant === "secondary" || variant === "danger"
          ? "1px solid rgba(17,24,39,0.08)"
          : "1px solid transparent",
      boxShadow: "none",
    };
  }

  switch (variant) {
    case "primary":
      return {
        background: "#C62828",
        color: "#FFFFFF",
        border: "1px solid #C62828",
        boxShadow: "0 1px 2px rgba(198,40,40,0.20)",
      };
    case "secondary":
      return {
        background: "#FFFFFF",
        color: "#0A0A0A",
        border: "1px solid rgba(17,24,39,0.08)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      };
    case "ghost":
      return {
        background: "transparent",
        color: "#0A0A0A",
        border: "1px solid transparent",
        boxShadow: "none",
      };
    case "danger":
      return {
        background: "transparent",
        color: "#DC2626",
        border: "1px solid rgba(220,38,38,0.30)",
        boxShadow: "none",
      };
  }
}

function sizeStyles(size: Size): CSSProperties {
  if (size === "sm") {
    return {
      height: 28,
      padding: "0 10px",
      fontSize: 12.5,
      gap: 6,
      borderRadius: 8,
    };
  }
  return {
    height: 38,
    padding: "0 14px",
    fontSize: 13.5,
    gap: 8,
    borderRadius: 10,
  };
}

function Spinner({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        borderTopColor: "transparent",
        animation: "admin-ui-spin 0.7s linear infinite",
      }}
    />
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  children,
  style,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantS = variantStyles(variant, !!isDisabled);
  const sizeS = sizeStyles(size);

  const spinnerColor =
    variant === "primary" ? "#FFFFFF" : variant === "danger" ? "#DC2626" : "#0A0A0A";

  return (
    <>
      {/* Keyframes injected inline so the component is self-contained. */}
      <style>{`@keyframes admin-ui-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        {...rest}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={[
          "transition-colors duration-150",
          isDisabled ? "cursor-not-allowed" : "cursor-pointer",
          className || "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: "-0.005em",
          whiteSpace: "nowrap",
          userSelect: "none",
          outline: "none",
          ...sizeS,
          ...variantS,
          ...style,
        }}
        onMouseEnter={(e) => {
          if (isDisabled) return;
          const el = e.currentTarget;
          if (variant === "primary") {
            el.style.background = "#B22020";
            el.style.borderColor = "#B22020";
          } else if (variant === "secondary") {
            el.style.background = "#FAFAFA";
          } else if (variant === "ghost") {
            el.style.background = "rgba(17,24,39,0.04)";
          } else if (variant === "danger") {
            el.style.background = "rgba(220,38,38,0.06)";
          }
          rest.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (isDisabled) return;
          const el = e.currentTarget;
          const reset = variantStyles(variant, false);
          el.style.background = (reset.background as string) || "";
          el.style.borderColor =
            ((reset.border as string) || "").split(" ").slice(-1)[0] || "";
          rest.onMouseLeave?.(e);
        }}
      >
        {loading ? <Spinner color={spinnerColor} /> : icon ? <span style={{ display: "inline-flex" }}>{icon}</span> : null}
        {children}
      </button>
    </>
  );
}
