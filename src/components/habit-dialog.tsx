"use client";
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  COLORS,
  DEFAULT_ICONS,
  Habit,
  Color,
  HabitIconName,
  dateKey,
  validHabitEmoji,
} from "@/lib/habits";
import { HabitIcon, ICON_OPTIONS } from "./habit-icon";
const labels = {
  violet: "Violet",
  mint: "Menthe",
  blue: "Bleu",
  orange: "Orange",
  pink: "Rose",
};
export function HabitDialog({
  habit,
  onClose,
  onSave,
  onDelete,
}: {
  habit: Habit | null;
  onClose: () => void;
  onSave: (habit: Habit) => boolean;
  onDelete: (id: string) => boolean;
}) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [color, setColor] = useState<Color>(habit?.color || "violet");
  const [icon, setIcon] = useState<HabitIconName>(
    habit?.icon ?? DEFAULT_ICONS[habit?.color ?? "violet"],
  );
  const [emoji, setEmoji] = useState(habit?.emoji ?? "");
  const emojiInvalid = icon === "emoji" && !validHabitEmoji(emoji);
  const [confirm, setConfirm] = useState(false);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="habit-editor">
        <DialogHeader>
          <DialogTitle>
            {confirm
              ? "Supprimer cette habitude ?"
              : habit
                ? "Modifier mon habitude"
                : "Une nouvelle habitude"}
          </DialogTitle>
          <DialogDescription>
            {confirm
              ? "Son historique sera aussi supprimé. Cette action est définitive."
              : "Commence petit. La régularité fait la différence."}
          </DialogDescription>
        </DialogHeader>
        {confirm ? (
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (habit && onDelete(habit.id)) onClose();
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || emojiInvalid) return;
              if (
                onSave({
                  id: habit?.id || crypto.randomUUID(),
                  name: name.trim(),
                  description: description.trim(),
                  color,
                  icon,
                  ...(icon === "emoji" ? { emoji } : {}),
                  days: habit?.days || [],
                  createdAt: habit?.createdAt || dateKey(),
                })
              )
                onClose();
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="habit-name">Nom de l’habitude</FieldLabel>
                <Input
                  id="habit-name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  required
                  placeholder="Ex. Marcher 20 minutes"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="habit-description">
                  Une petite intention{" "}
                  <span className="muted">(facultatif)</span>
                </FieldLabel>
                <Input
                  id="habit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={160}
                  placeholder="Pourquoi cette habitude compte pour toi"
                />
              </Field>
              <fieldset className={`color-${color}`}>
                <legend className="field-legend">Icône</legend>
                <div className="icon-options">
                  {ICON_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="icon-option"
                      title={option.label}
                    >
                      <input
                        type="radio"
                        name="habit-icon"
                        value={option.value}
                        checked={icon === option.value}
                        onChange={() => setIcon(option.value)}
                        aria-label={option.label}
                      />
                      <span>
                        <HabitIcon
                          name={option.value}
                          emoji={emoji}
                          size={20}
                        />
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <Field data-invalid={emojiInvalid && emoji.length > 0}>
                <FieldLabel htmlFor="habit-emoji">
                  Ou ton propre emoji
                </FieldLabel>
                <div className={`emoji-editor color-${color}`}>
                  <Input
                    id="habit-emoji"
                    value={emoji}
                    onChange={(e) => {
                      setEmoji(e.target.value.trim());
                      setIcon("emoji");
                    }}
                    maxLength={24}
                    placeholder="Ex. 🏀, 📖, 🕌"
                    aria-invalid={emojiInvalid && emoji.length > 0}
                    aria-describedby="emoji-help"
                  />
                  <span className="habit-icon" aria-label="Aperçu de l’icône">
                    <HabitIcon
                      name={icon}
                      emoji={validHabitEmoji(emoji) ? emoji : undefined}
                    />
                  </span>
                </div>
                <p id="emoji-help" className="emoji-help">
                  {emojiInvalid && emoji.length > 0
                    ? "Choisis un seul emoji pour ton icône."
                    : "Colle un emoji ou utilise le clavier emoji de ton appareil."}
                </p>
              </Field>
              <fieldset>
                <legend className="field-legend">Couleur</legend>
                <div className="color-options">
                  {COLORS.map((c) => (
                    <label
                      key={c}
                      className={`color-option color-${c}`}
                      title={labels[c]}
                    >
                      <input
                        type="radio"
                        name="color"
                        value={c}
                        checked={color === c}
                        onChange={() => setColor(c)}
                        aria-label={labels[c]}
                      />
                      <span>{color === c && <Check size={19} />}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </FieldGroup>
            <DialogFooter className="mt-7">
              {habit && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirm(true)}
                >
                  <Trash2 data-icon="inline-start" />
                  Supprimer
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={!name.trim() || emojiInvalid}>
                {habit ? "Enregistrer" : "Créer mon habitude"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
