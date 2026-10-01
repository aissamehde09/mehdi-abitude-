export const COLORS = ["violet", "mint", "blue", "orange", "pink"] as const;
export type Color = (typeof COLORS)[number];
export const HABIT_ICONS = [
  "book",
  "activity",
  "water",
  "target",
  "heart",
  "moon",
  "study",
  "work",
  "code",
  "fitness",
  "bike",
  "coffee",
  "music",
  "leaf",
  "emoji",
] as const;
export type HabitIconName = (typeof HABIT_ICONS)[number];
export const DEFAULT_ICONS: Record<Color, HabitIconName> = {
  violet: "book",
  mint: "activity",
  blue: "water",
  orange: "target",
  pink: "heart",
};
export function validHabitEmoji(value: unknown): boolean {
  return (
    typeof value === "string" &&
    value.length <= 24 &&
    /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u.test(value) &&
    Array.from(
      new Intl.Segmenter("fr", { granularity: "grapheme" }).segment(value),
    ).length === 1
  );
}
export type Habit = {
  id: string;
  name: string;
  description: string;
  color: Color;
  icon: HabitIconName;
  emoji?: string;
  createdAt: string;
  days: string[];
};
export type Backup = { version: 1; habits: Habit[] };
export const STORAGE_KEY = "rituel:v1";
export function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function shiftDate(key: string, amount: number): string {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}
export function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T12:00:00`).getTime()) &&
    dateKey(new Date(`${value}T12:00:00`)) === value
  );
}
export function starterHabits(): Habit[] {
  return [
    [
      "Lire 20 minutes",
      "Un peu de lecture pour un esprit plus ouvert.",
      "violet",
    ],
    [
      "Bouger chaque jour",
      "30 minutes d’activité pour plus d’énergie.",
      "mint",
    ],
    [
      "Boire de l’eau",
      "Rester bien hydraté tout au long de la journée.",
      "blue",
    ],
    [
      "Avancer sur mon projet",
      "Chaque jour, un peu plus près de mes objectifs.",
      "orange",
    ],
    [
      "Prendre un moment pour soi",
      "Respirer, se recentrer et prendre soin de soi.",
      "pink",
    ],
  ].map(([name, description, color]) => ({
    id: crypto.randomUUID(),
    name,
    description,
    color: color as Color,
    icon: DEFAULT_ICONS[color as Color],
    createdAt: dateKey(),
    days: [],
  }));
}
export function parseBackup(input: unknown, today = dateKey()): Habit[] {
  if (!input || typeof input !== "object")
    throw new Error("Format de sauvegarde invalide.");
  const data = input as Backup;
  if (
    data.version !== 1 ||
    !Array.isArray(data.habits) ||
    data.habits.length > 100
  )
    throw new Error("Sauvegarde incompatible (100 habitudes maximum).");
  const ids = new Set<string>();
  return data.habits.map((h) => {
    if (
      !h ||
      typeof h.id !== "string" ||
      h.id.length > 80 ||
      !h.id ||
      ids.has(h.id) ||
      typeof h.name !== "string" ||
      !h.name.trim() ||
      h.name.length > 60 ||
      typeof h.description !== "string" ||
      h.description.length > 160 ||
      !COLORS.includes(h.color) ||
      (h.icon !== undefined && !HABIT_ICONS.includes(h.icon)) ||
      (h.emoji !== undefined && !validHabitEmoji(h.emoji)) ||
      (h.icon === "emoji" && !validHabitEmoji(h.emoji)) ||
      !validDate(h.createdAt) ||
      h.createdAt > today ||
      !Array.isArray(h.days) ||
      h.days.length > 40000 ||
      h.days.some((d) => !validDate(d) || d > today || d < "2000-01-01")
    )
      throw new Error("La sauvegarde contient des données invalides.");
    ids.add(h.id);
    return {
      id: h.id,
      name: h.name.trim(),
      description: h.description.trim(),
      color: h.color,
      // Older local data and exports retain their original color-based icon.
      icon: h.icon ?? DEFAULT_ICONS[h.color],
      ...(h.icon === "emoji" ? { emoji: h.emoji } : {}),
      createdAt: h.createdAt,
      days: [...new Set(h.days)].sort(),
    };
  });
}
export function streak(days: string[], today = dateKey()): number {
  const values = new Set(days);
  let cursor = values.has(today) ? today : shiftDate(today, -1);
  let count = 0;
  while (values.has(cursor)) {
    count++;
    cursor = shiftDate(cursor, -1);
  }
  return count;
}
export function bestStreak(days: string[]): number {
  let best = 0,
    run = 0,
    last = "";
  for (const day of [...new Set(days)].sort()) {
    run = last && shiftDate(last, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    last = day;
  }
  return best;
}
export function yearGrid(year: number): (string | null)[] {
  const start = new Date(year, 0, 1, 12);
  const offset = (start.getDay() + 6) % 7;
  const days: (string | null)[] = Array(offset).fill(null);
  for (
    let date = new Date(start);
    date.getFullYear() === year;
    date.setDate(date.getDate() + 1)
  )
    days.push(dateKey(date));
  while (days.length % 7) days.push(null);
  return days;
}
