/**
 * A simple rotating-ring spinner (see .spinner in index.css) — sized via an
 * explicit pixel size. Colors come from CSS context: the base .spinner rule
 * is a white ring (for use inside a brand-colored button), while
 * .loading-center .spinner overrides it to a brand-colored ring (for a
 * standalone loading state, e.g. DataTable's) — wrap this in a
 * .loading-center div for that variant rather than hardcoding colors here.
 */
export function Spinner({ size = 24 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size }} role="status" aria-label="Loading" />;
}
