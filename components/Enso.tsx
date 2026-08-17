// A faint enso — the Zen brush circle, drawn in a single breath. Rendered as an
// inline SVG so it can be styled by theme and animated with stroke-dashoffset.
// The path is a not-quite-closed circle with a tapering brush feel.

export default function Enso({ size = 96 }: { size?: number }) {
  return (
    <svg
      className="enso"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="enso-stroke"
        d="M62 22
           C 40 12, 16 26, 14 50
           C 12 74, 34 90, 56 86
           C 78 82, 90 60, 82 40
           C 76 25, 60 18, 50 20"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
