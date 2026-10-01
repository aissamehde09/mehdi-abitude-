import {
  Activity,
  Bike,
  BookOpen,
  BriefcaseBusiness,
  CodeXml,
  Coffee,
  Droplet,
  Dumbbell,
  GraduationCap,
  Heart,
  Leaf,
  Moon,
  Music,
  Smile,
  Target,
} from "lucide-react";
import { HabitIconName } from "@/lib/habits";

export const ICON_OPTIONS = [
  { value: "book", label: "Lecture", icon: BookOpen },
  { value: "activity", label: "Activité", icon: Activity },
  { value: "water", label: "Eau", icon: Droplet },
  { value: "target", label: "Objectif", icon: Target },
  { value: "heart", label: "Bien-être", icon: Heart },
  { value: "moon", label: "Lune", icon: Moon },
  { value: "study", label: "Études", icon: GraduationCap },
  { value: "work", label: "Travail", icon: BriefcaseBusiness },
  { value: "code", label: "Code", icon: CodeXml },
  { value: "fitness", label: "Musculation", icon: Dumbbell },
  { value: "bike", label: "Vélo", icon: Bike },
  { value: "coffee", label: "Café", icon: Coffee },
  { value: "music", label: "Musique", icon: Music },
  { value: "leaf", label: "Nature", icon: Leaf },
  { value: "emoji", label: "Emoji personnalisé", icon: Smile },
] as const;

export function HabitIcon({
  name,
  emoji,
  size = 23,
}: {
  name: HabitIconName;
  emoji?: string;
  size?: number;
}) {
  if (name === "emoji" && emoji)
    return (
      <span className="habit-emoji" aria-hidden="true">
        {emoji}
      </span>
    );
  const Icon =
    ICON_OPTIONS.find((option) => option.value === name)?.icon ?? BookOpen;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
