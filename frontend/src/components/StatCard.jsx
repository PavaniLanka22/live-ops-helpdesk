const StatCard = ({
  label,
  value,
  detail,
  icon,
  tone = "blue",
}) => {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-label">
          {label}
        </span>

        <div className={`stat-icon ${tone}`}>
          {icon}
        </div>
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-detail">
        {detail}
      </div>
    </div>
  );
};

export default StatCard;