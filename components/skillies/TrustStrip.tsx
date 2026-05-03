/**
 * TrustStrip · single line above or below the hero CTA stack.
 * No logos, no count numbers — keeps the founder-led restraint.
 */
export type TrustStripProps = {
  text: string;
  align?: "left" | "center" | "right";
};

export default function TrustStrip({ text, align = "left" }: TrustStripProps) {
  return (
    <p
      className="sk-font-meta"
      style={{
        color: "var(--sk-ink60)",
        textAlign: align,
      }}
    >
      {text}
    </p>
  );
}
