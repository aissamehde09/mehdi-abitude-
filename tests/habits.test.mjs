import test from "node:test";
import assert from "node:assert/strict";
import {
  bestStreak,
  streak,
  shiftDate,
  yearGrid,
  parseBackup,
  validDate,
} from "../src/lib/habits.ts";
const habit = {
  id: "test",
  name: "Lire",
  description: "",
  color: "violet",
  createdAt: "2026-01-01",
  days: ["2026-01-01"],
};
test("calendrier complet et années bissextiles", () => {
  assert.equal(yearGrid(2024).filter(Boolean).length, 366);
  assert.equal(yearGrid(2026).filter(Boolean).length, 365);
  assert.equal(yearGrid(2026).length % 7, 0);
  assert.equal(yearGrid(2026)[3], "2026-01-01");
});
test("changement de mois et année", () => {
  assert.equal(shiftDate("2026-01-01", -1), "2025-12-31");
  assert.equal(shiftDate("2024-02-28", 1), "2024-02-29");
});
test("validation stricte des dates", () => {
  assert.equal(validDate("2026-02-30"), false);
  assert.equal(validDate("2024-02-29"), true);
  assert.equal(validDate("nonsense"), false);
});
test("série actuelle tolère une journée en cours non validée", () => {
  assert.equal(streak(["2026-01-01", "2026-01-02"], "2026-01-03"), 2);
  assert.equal(streak(["2026-01-01"], "2026-01-03"), 0);
  assert.equal(
    streak(["2026-01-01", "2026-01-02", "2026-01-03"], "2026-01-03"),
    3,
  );
});
test("meilleure série gère les trous et doublons", () => {
  assert.equal(
    bestStreak(["2025-12-31", "2026-01-01", "2026-01-01", "2026-01-03"]),
    2,
  );
  assert.equal(bestStreak([]), 0);
});
test("import normalisé et borné", () => {
  const result = parseBackup(
    { version: 1, habits: [{ ...habit, days: ["2026-01-01", "2026-01-01"] }] },
    "2026-10-01",
  );
  assert.equal(result[0].days.length, 1);
  assert.throws(() => parseBackup({ version: 2, habits: [] }));
  assert.throws(() =>
    parseBackup({ version: 1, habits: Array(101).fill(habit) }),
  );
});
test("import rejette dates futures, identifiants dupliqués, couleurs et texte invalides", () => {
  for (const patch of [
    { days: ["2099-01-01"] },
    { days: ["2026-02-30"] },
    { color: "invalid" },
    { name: " " },
    { name: "a".repeat(61) },
  ])
    assert.throws(() =>
      parseBackup(
        { version: 1, habits: [{ ...habit, ...patch }] },
        "2026-10-01",
      ),
    );
  assert.throws(() => parseBackup({ version: 1, habits: [habit, habit] }));
});

test("anciennes sauvegardes : icône conservée et historique intact", () => {
  const previous = {
    ...habit,
    color: "mint",
    days: ["2026-01-01", "2026-01-02"],
  };
  const [loaded] = parseBackup(
    { version: 1, habits: [previous] },
    "2026-10-01",
  );
  assert.equal(loaded.icon, "activity");
  assert.deepEqual(loaded.days, previous.days);
  assert.equal(loaded.id, previous.id);
});
test("icônes et emojis survivent à un export/import et restent indépendants de la couleur", () => {
  for (const iconData of [
    { icon: "book" },
    { icon: "emoji", emoji: "🏀" },
    { icon: "emoji", emoji: "🏃🏽‍♂️" },
    { icon: "emoji", emoji: "🇲🇦" },
  ]) {
    const original = { ...habit, ...iconData, color: "orange" };
    const backup = JSON.parse(
      JSON.stringify({ version: 1, habits: [original] }),
    );
    const [loaded] = parseBackup(backup, "2026-10-01");
    assert.equal(loaded.icon, iconData.icon);
    assert.equal(loaded.emoji, iconData.emoji);
    assert.equal(loaded.color, "orange");
  }
});
test("import rejette icônes inconnues, texte, HTML et emojis multiples", () => {
  for (const patch of [
    { icon: "unknown" },
    { icon: null },
    { icon: "emoji" },
    { icon: "emoji", emoji: "hello" },
    { icon: "emoji", emoji: "<svg onload=alert(1)>" },
    { icon: "emoji", emoji: "🏀📖" },
  ]) {
    assert.throws(() =>
      parseBackup(
        { version: 1, habits: [{ ...habit, ...patch }] },
        "2026-10-01",
      ),
    );
  }
});
