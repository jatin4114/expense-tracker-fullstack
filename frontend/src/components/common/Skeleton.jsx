import "./Skeleton.css";

// grey pulsing placeholder boxes shown while data is loading -
// nicer than a spinner for list-shaped content since it hints at
// the actual layout thats about to appear
export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <div className="skeleton-box skeleton-badge" />
      <div className="skeleton-box skeleton-title" />
      <div className="skeleton-box skeleton-amount" />
    </div>
  );
}

export function SkeletonList({ rows = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
