"use client";
import { Check, MoreHorizontal, Flame } from "lucide-react";
import { DEFAULT_ICONS, Habit, shiftDate, streak } from "@/lib/habits";
import { Heatmap } from "./heatmap";
import { HabitIcon } from "./habit-icon";
export function HabitCard({
  habit,
  today,
  year,
  view,
  weekStart,
  onToggle,
  onEdit,
}: {
  habit: Habit;
  today: string;
  year: number;
  view: "year" | "week";
  weekStart: string;
  onToggle: (date: string) => void;
  onEdit: () => void;
}) {
  const completed = habit.days.includes(today);
  const series = streak(habit.days, today);
  return (
    <article className={`habit-card color-${habit.color}`}>
      <div className="habit-top">
        <button
          type="button"
          className="habit-icon"
          onClick={onEdit}
          aria-label={`Personnaliser l’icône de ${habit.name}`}
          title="Personnaliser l’icône"
        >
          <HabitIcon
            name={habit.icon ?? DEFAULT_ICONS[habit.color]}
            emoji={habit.emoji}
          />
        </button>
        <div className="habit-copy">
          <h3>{habit.name}</h3>
          <p>{habit.description || "Un petit geste qui compte."}</p>
        </div>
        <button
          className="icon-button edit-button"
          onClick={onEdit}
          aria-label={`Modifier ${habit.name}`}
        >
          <MoreHorizontal size={20} />
        </button>
        <button
          className={`check-button ${completed ? "checked" : ""}`}
          onClick={() => onToggle(today)}
          aria-pressed={completed}
          aria-label={`${completed ? "Annuler" : "Valider"} ${habit.name} aujourd’hui`}
          title={completed ? "Validé aujourd’hui" : "Valider aujourd’hui"}
        >
          <Check size={19} />
        </button>
      </div>
      {view === "year" ? (
        <Heatmap
          year={year}
          today={today}
          days={habit.days}
          onToggle={onToggle}
        />
      ) : (
        <div className="week-grid">
          {Array.from({ length: 7 }, (_, i) => {
            const date = shiftDate(weekStart, i);
            const d = new Date(date + "T12:00:00");
            return (
              <button
                key={date}
                onClick={() => onToggle(date)}
                disabled={date > today}
                className={`week-day ${habit.days.includes(date) ? "done" : ""} ${date === today ? "current" : ""}`}
                aria-pressed={habit.days.includes(date)}
                aria-label={`${habit.name}, ${date}`}
              >
                <span>
                  {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                </span>
                <b>{d.getDate()}</b>
                <span className="week-check">
                  {habit.days.includes(date) ? <Check size={16} /> : <span />}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <div className="habit-bottom">
        <span className="streak">
          <Flame size={13} />
          {series} jour{series > 1 ? "s" : ""} de suite
        </span>
        <div className="legend">
          <span>À faire</span>
          <i />
          <i className="filled" />
          <span>Fait</span>
        </div>
      </div>
    </article>
  );
}
