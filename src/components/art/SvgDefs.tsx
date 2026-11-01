/**
 * Document-wide SVG definitions, referenced by id from the generated artwork, so each
 * avatar / cover doesn't carry its own copy of the same filter.
 */
export function SvgDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }} focusable="false">
      <defs>
        <filter id="groove-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.58 -0.13" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
