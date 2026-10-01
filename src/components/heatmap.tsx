"use client";
import { useMemo } from "react";
import { yearGrid } from "@/lib/habits";
const months = [
  "Jan",
  "Fév",
  "Mars",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sept",
  "Oct",
  "Nov",
  "Déc",
];
export function Heatmap({
  year,
  days,
  today,
  onToggle,
}: {
  year: number;
  days: string[];
  today: string;
  onToggle: (date: string) => void;
}) {
  const grid = useMemo(() => yearGrid(year), [year]);
  const done = new Set(days);
  return (
    <div className="calendar-scroll">
      <div className="calendar-inner">
        <div className="months">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <div className="calendar-body">
          <div className="week-labels">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div
            className="heatmap"
            style={{
              gridTemplateColumns: `repeat(${grid.length / 7}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((date, i) =>
              date ? (
                <button
                  key={date}
                  type="button"
                  tabIndex={date === (year === Number(today.slice(0, 4)) ? today : `${year}-12-31`) ? 0 : -1}
                  onKeyDown={(e) => {
                    const moves: Record<string, number> = {
                      ArrowDown: 1,
                      ArrowUp: -1,
                      ArrowLeft: -7,
                      ArrowRight: 7,
                    };
                    if (e.key in moves) {
                      e.preventDefault();
                      const buttons =
                        e.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>(
                          "button",
                        );
                      const index = Array.from(buttons).indexOf(
                        e.currentTarget,
                      );
                      let next = index + moves[e.key];
                      while (
                        next >= 0 &&
                        next < buttons.length &&
                        buttons[next].disabled
                      )
                        next += Math.sign(moves[e.key]);
                      buttons[next]?.focus();
                    }
                  }}
                  disabled={date > today}
                  aria-label={`${date} : ${done.has(date) ? "fait, annuler" : "à valider"}`}
                  aria-pressed={done.has(date)}
                  title={`${new Date(date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · ${done.has(date) ? "Fait" : date > today ? "À venir" : "Non validé"}`}
                  className={`day ${done.has(date) ? "done" : ""} ${date === today ? "today" : ""}`}
                  onClick={() => onToggle(date)}
                />
              ) : (
                <span key={i} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
