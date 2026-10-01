"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChartNoAxesColumnIncreasing,
  CalendarDays,
  Flame,
  Settings2,
  Download,
  Upload,
  HardDrive,
  Sprout,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  Habit,
  Backup,
  STORAGE_KEY,
  bestStreak,
  dateKey,
  parseBackup,
  shiftDate,
  starterHabits,
} from "@/lib/habits";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HabitCard } from "./habit-card";
import { HabitDialog } from "./habit-dialog";
import { Statistics } from "./statistics";

export function Tracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [today, setToday] = useState(dateKey());
  const [year, setYear] = useState(new Date().getFullYear());
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<"year" | "week">("year");
  const [tab, setTab] = useState("habits");
  const [editing, setEditing] = useState<Habit | null | undefined>(undefined);
  const [settings, setSettings] = useState(false);
  const [pendingImport, setPendingImport] = useState<Habit[] | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const initial = raw ? parseBackup(JSON.parse(raw)) : starterHabits();
        if (!raw)
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ version: 1, habits: initial }),
          );
        setHabits(initial);
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
      setLoaded(true);
    };
    load();
    const listener = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        load();
        setEditing(undefined);
      }
    };
    const timer = setInterval(() => setToday(dateKey()), 30000);
    window.addEventListener("storage", listener);
    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", listener);
    };
  }, []);
  function persist(next: Habit[]): boolean {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, habits: next } satisfies Backup),
      );
      setHabits(next);
      setStorageError(false);
      return true;
    } catch {
      toast.error(
        "Sauvegarde impossible. Vérifie l’espace disponible et les autorisations du navigateur.",
      );
      return false;
    }
  }
  function toggle(id: string, day: string) {
    if (day > today || storageError) return;
    persist(
      habits.map((h) =>
        h.id === id
          ? {
              ...h,
              days: h.days.includes(day)
                ? h.days.filter((d) => d !== day)
                : [...h.days, day].sort(),
            }
          : h,
      ),
    );
  }
  function save(habit: Habit) {
    if (!habits.some((h) => h.id === habit.id) && habits.length >= 100) {
      toast.error("Tu as atteint la limite de 100 habitudes.");
      return false;
    }
    const ok = persist(
      habits.some((h) => h.id === habit.id)
        ? habits.map((h) => (h.id === habit.id ? habit : h))
        : [...habits, habit],
    );
    if (ok) toast.success("Habitude enregistrée.");
    return ok;
  }
  function exportBackup() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ version: 1, habits }, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `rituel-${today}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Sauvegarde exportée.");
  }
  async function importBackup(file?: File) {
    if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error("Le fichier dépasse 5 Mo.");
      setPendingImport(parseBackup(JSON.parse(await file.text())));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fichier invalide.");
    }
    if (fileInput.current) fileInput.current.value = "";
  }
  const doneToday = habits.filter((h) => h.days.includes(today)).length;
  const best = Math.max(0, ...habits.map((h) => bestStreak(h.days)));
  const monday = shiftDate(
    today,
    -((new Date(today + "T12:00:00").getDay() + 6) % 7) + weekOffset * 7,
  );
  const weekLabel = `${new Date(monday + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${new Date(shiftDate(monday, 6) + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
  return (
    <>
      <header className="topbar">
        <div className="nav-inner">
          <Link href="/" className="brand" aria-label="Rituel, accueil">
            <span className="brand-mark">
              <i />
              <i />
              <i />
              <i />
            </span>
            Rituel<span className="brand-dot">.</span>
          </Link>
          <nav aria-label="Navigation principale">
            <button
              className={tab === "habits" ? "active" : ""}
              onClick={() => setTab("habits")}
            >
              Mes habitudes
            </button>
            <button
              className={tab === "stats" ? "active" : ""}
              onClick={() => setTab("stats")}
            >
              Statistiques
            </button>
          </nav>
          <button
            className="settings-button"
            aria-label="Sauvegardes et paramètres"
            onClick={() => setSettings(true)}
          >
            <Settings2 size={19} />
          </button>
        </div>
      </header>
      <main className="main-container">
        <section className="hero">
          <div>
            <h1>
              Un petit geste. <span>Chaque jour.</span>
            </h1>
            <p>Construis les habitudes qui te font avancer.</p>
          </div>
          <Button
            className="new-habit"
            onClick={() => setEditing(null)}
            disabled={!loaded || storageError}
          >
            <Plus data-icon="inline-start" />
            Nouvelle habitude
          </Button>
        </section>
        <section className="summary-strip" aria-label="Résumé">
          <div>
            <ChartNoAxesColumnIncreasing />
            <p>
              <span>Habitudes actives</span>
              <strong>{loaded ? habits.length : "—"}</strong>
            </p>
          </div>
          <div>
            <CalendarDays />
            <p>
              <span>Aujourd’hui</span>
              <strong>
                {loaded ? `${doneToday} / ${habits.length}` : "—"}
                {doneToday > 0 && doneToday === habits.length && (
                  <Check size={17} />
                )}
              </strong>
            </p>
          </div>
          <div>
            <Flame />
            <p>
              <span>Meilleure série</span>
              <strong>
                {best} <small>jour{best > 1 ? "s" : ""}</small>
              </strong>
            </p>
          </div>
        </section>
        {storageError && (
          <div role="alert" className="error-banner">
            Impossible de lire la sauvegarde locale. Tes données n’ont pas été
            remplacées. Tu peux restaurer un export dans les paramètres.
            <Button variant="outline" onClick={() => setSettings(true)}>
              Paramètres
            </Button>
          </div>
        )}
        <div className="section-toolbar">
          <h2>
            {tab === "habits" ? "Mes habitudes" : "Mes statistiques"}
            <span>
              {habits.length} habitude{habits.length > 1 ? "s" : ""}
            </span>
          </h2>
          <div className="view-controls">
            {tab === "habits" && (
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(value) => {
                  if (value) setView(value as "year" | "week");
                }}
                aria-label="Période affichée"
              >
                <ToggleGroupItem value="week">Semaine</ToggleGroupItem>
                <ToggleGroupItem value="year">Année</ToggleGroupItem>
              </ToggleGroup>
            )}
            <div className="period-picker">
              <button
                aria-label="Période précédente"
                disabled={
                  tab === "habits" && view === "week"
                    ? monday <= "2000-01-08"
                    : year <= 2000
                }
                onClick={() =>
                  tab === "habits" && view === "week"
                    ? setWeekOffset(weekOffset - 1)
                    : setYear(year - 1)
                }
              >
                <ChevronLeft size={17} />
              </button>
              <span>
                {tab === "habits" && view === "week" ? weekLabel : year}
              </span>
              <button
                aria-label="Période suivante"
                disabled={
                  tab === "habits" && view === "week"
                    ? weekOffset >= 0
                    : year >= Number(today.slice(0, 4))
                }
                onClick={() =>
                  tab === "habits" && view === "week"
                    ? setWeekOffset(weekOffset + 1)
                    : setYear(year + 1)
                }
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
        {!loaded ? (
          <div className="loading-state" role="status">
            Préparation de tes habitudes…
          </div>
        ) : habits.length === 0 ? (
          <section className="empty-state">
            <Sprout size={36} />
            <h2>Tout commence par un petit geste.</h2>
            <p>Choisis une habitude que tu aimerais cultiver.</p>
            <Button onClick={() => setEditing(null)} disabled={storageError}>
              <Plus data-icon="inline-start" />
              Créer ma première habitude
            </Button>
          </section>
        ) : tab === "stats" ? (
          <Statistics habits={habits} year={year} today={today} />
        ) : (
          <section className="habits-grid" aria-label="Liste des habitudes">
            {habits.map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                today={today}
                year={year}
                view={view}
                weekStart={monday}
                onToggle={(day) => toggle(h.id, day)}
                onEdit={() => {
                  if (!storageError) setEditing(h);
                }}
              />
            ))}
          </section>
        )}
        <footer>
          <span className="footer-line" />
          Chaque case est un pas en avant.
          <span className="footer-line" />
        </footer>
        <div className="local-note">
          <HardDrive size={12} />
          Sauvegardé sur cet appareil
        </div>
      </main>
      {editing !== undefined && (
        <HabitDialog
          habit={editing}
          onClose={() => setEditing(undefined)}
          onSave={save}
          onDelete={(id) => {
            const ok = persist(habits.filter((h) => h.id !== id));
            if (ok) toast.success("Habitude supprimée.");
            return ok;
          }}
        />
      )}
      <Dialog
        open={settings}
        onOpenChange={(open) => {
          setSettings(open);
          if (!open) setPendingImport(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mes données, à portée de main.</DialogTitle>
            <DialogDescription>
              Tes habitudes restent dans ce navigateur. Exporte une copie pour
              les conserver ou les retrouver sur un autre appareil.
            </DialogDescription>
          </DialogHeader>
          <div className="backup-actions">
            <Button
              variant="outline"
              onClick={exportBackup}
              disabled={storageError || !loaded}
            >
              <Download data-icon="inline-start" />
              Exporter mes habitudes
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInput.current?.click()}
            >
              <Upload data-icon="inline-start" />
              Importer une sauvegarde
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              aria-label="Fichier de sauvegarde"
              onChange={(e) => void importBackup(e.target.files?.[0])}
            />
          </div>
          {pendingImport && (
            <div className="import-confirm">
              <p>
                Remplacer les {habits.length} habitudes actuelles par les{" "}
                {pendingImport.length} habitudes de cette sauvegarde ?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPendingImport(null)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    if (persist(pendingImport)) {
                      setPendingImport(null);
                      setSettings(false);
                      toast.success("Sauvegarde restaurée.");
                    }
                  }}
                >
                  Remplacer et importer
                </Button>
              </div>
            </div>
          )}
          <p className="backup-note">
            <HardDrive size={15} />
            Effacer les données du navigateur efface aussi ton historique. Pense
            à l’exporter régulièrement.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
