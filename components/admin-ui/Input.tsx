// Input — the canonical text-field primitive for admin forms.
//
// Renders an optional label above the field, an optional inline icon on the
// left edge of the input, and an optional error message below. The focus ring
// is the brand red. Height is ~38px (matches Button `md`) so they line up in
// horizontal toolbars.
//
// Forward standard <input> props (placeholder, value, onChange, type, name…).

"use client";

import { forwardRef, useId } from "react";
import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "style"> & {
  label?: ReactNode;
  /** Inline icon rendered on the left edge of the input (e.g. a magnifier). */
  icon?: ReactNode;
  /** Renders the field in error state with the given message below. */
  error?: string | null;
  /** Extra inline styles applied to the <input>. */
  inputStyle?: CSSProperties;
  /** Extra inline styles applied to the wrapping <label>. */
  wrapperStyle?: CSSProperties;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon, error, inputStyle, wrapperStyle, id, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;
  const hasError = !!error;

  return (
    <label
      htmlFor={inputId}
      style={{
        display: "block",
        fontFamily:
          "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
        ...wrapperStyle,
      }}
    >
      {label ? (
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: "#0A0A0A",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon ? (
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              display: "inline-flex",
              alignItems: "center",
              color: "#A3A3A3",
              pointerEvents: "none",
            }}
          >
            {icon}
          </span>
        ) : null}
        <input
          {...rest}
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          style={{
            width: "100%",
            height: 38,
            padding: icon ? "0 12px 0 32px" : "0 12px",
            background: disabled ? "#FAFAFA" : "#FFFFFF",
            border: hasError
              ? "1px solid #DC2626"
              : "1px solid rgba(17,24,39,0.08)",
            borderRadius: 10,
            color: disabled ? "#A3A3A3" : "#0A0A0A",
            fontFamily:
              "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1,
            outline: "none",
            transition:
              "border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease",
            ...inputStyle,
          }}
          onFocus={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = hasError ? "#DC2626" : "#C62828";
              e.currentTarget.style.boxShadow = hasError
                ? "0 0 0 3px rgba(220,38,38,0.15)"
                : "0 0 0 3px rgba(198,40,40,0.15)";
            }
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = hasError
              ? "#DC2626"
              : "rgba(17,24,39,0.08)";
            e.currentTarget.style.boxShadow = "none";
            rest.onBlur?.(e);
          }}
        />
      </div>
      {hasError ? (
        <div
          role="alert"
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "#DC2626",
            lineHeight: 1.4,
          }}
        >
          {error}
        </div>
      ) : null}
    </label>
  );
});

export default Input;
