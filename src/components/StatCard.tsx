interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="stat-card">

      <div>
        <p>{title}</p>

        <h2>{value}</h2>

        <span>{description}</span>
      </div>

    </div>
  );
}