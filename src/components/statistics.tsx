import { Habit, bestStreak, dateKey } from "@/lib/habits";
export function Statistics({
  habits,
  year,
  today,
}: {
  habits: Habit[];
  year: number;
  today: string;
}) {
  const total = habits.reduce(
    (sum, h) => sum + h.days.filter((d) => d.startsWith(String(year))).length,
    0,
  );
  const months = Array.from({ length: 12 }, (_, m) => ({
    label: new Date(year, m, 1).toLocaleDateString("fr-FR", { month: "short" }),
    value: habits.reduce(
      (n, h) =>
        n +
        h.days.filter((d) =>
          d.startsWith(`${year}-${String(m + 1).padStart(2, "0")}`),
        ).length,
      0,
    ),
    future: dateKey(new Date(year, m, 1)) > today,
  }));
  const max = Math.max(1, ...months.map((m) => m.value));
  return (
    <section className="stats-panel">
      <div className="stats-heading">
        <div>
          <h2>La régularité se construit.</h2>
          <p className="muted">Chaque journée compte, même après une pause.</p>
        </div>
        <div>
          <strong>{total}</strong>
          <span className="muted"> validations en {year}</span>
        </div>
      </div>
      <div className="bar-chart" aria-label={`Validations par mois en ${year}`}>
        {months.map((m) => (
          <div className="bar-column" key={m.label}>
            <span>{m.future ? "—" : m.value}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ height: `${(m.value / max) * 100}%` }}
              />
            </div>
            <span>{m.label}</span>
          </div>
        ))}
      </div>
      <div className="stats-table">
        <div className="stats-row stats-label">
          <span>Habitude</span>
          <span>Total</span>
          <span>Meilleure série</span>
        </div>
        {habits.map((h) => (
          <div className="stats-row" key={h.id}>
            <span>
              <i className={`stat-dot color-${h.color}`} />
              {h.name}
            </span>
            <span>
              {h.days.length} jour{h.days.length > 1 ? "s" : ""}
            </span>
            <span>
              {bestStreak(h.days)} jour{bestStreak(h.days) > 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
