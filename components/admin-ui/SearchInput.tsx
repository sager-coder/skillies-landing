// SearchInput — specialised <Input> with an inline magnifier icon and a
// built-in debounce timer.
//
// Consumers control the *immediate* value via `value` + `onChange` (so the
// text field stays snappy as the user types), and read the *debounced* value
// from `onDebouncedChange`, which fires `delay` ms after the last keystroke.
// Default delay is 250ms — fast enough to feel live, slow enough to skip a
// flurry of network requests while typing.

"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Input from "./Input";

type SearchInputProps = {
  value: string;
  onChange: (next: string) => void;
  /** Fires `delay` ms after the user stops typing. */
  onDebouncedChange?: (next: string) => void;
  /** Debounce in milliseconds. Default 250. */
  delay?: number;
  placeholder?: string;
  /** Optional inline label above the field. */
  label?: string;
  /** Optional disabled flag. */
  disabled?: boolean;
  wrapperStyle?: CSSProperties;
};

function MagnifierIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <circle
        cx="6"
        cy="6"
        r="4.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 9.5L12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SearchInput({
  value,
  onChange,
  onDebouncedChange,
  delay = 250,
  placeholder = "Search…",
  label,
  disabled,
  wrapperStyle,
}: SearchInputProps) {
  // Track the last value we *emitted* via onDebouncedChange so we don't fire
  // redundantly on every render of the consumer.
  const lastEmitted = useRef<string | null>(null);

  useEffect(() => {
    if (!onDebouncedChange) return;
    const id = setTimeout(() => {
      if (lastEmitted.current !== value) {
        lastEmitted.current = value;
        onDebouncedChange(value);
      }
    }, delay);
    return () => clearTimeout(id);
  }, [value, delay, onDebouncedChange]);

  return (
    <Input
      type="search"
      label={label}
      icon={<MagnifierIcon />}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      wrapperStyle={wrapperStyle}
      autoComplete="off"
      spellCheck={false}
    />
  );
}
