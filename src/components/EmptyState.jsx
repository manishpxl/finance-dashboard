export default function EmptyState({
  title = "No data found",
  description = "Try changing filters or adding a transaction.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">📭</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}