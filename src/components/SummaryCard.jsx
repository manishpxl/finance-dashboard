export default function SummaryCard({ title, value, tone = "default" }) {
  return (
    <div className={`summary-card ${tone}`}>
      <p className="summary-card__label">{title}</p>
      <h3 className="summary-card__value">{value}</h3>
    </div>
  );
}