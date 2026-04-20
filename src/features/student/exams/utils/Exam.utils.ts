export function getVenueBadgeClass(venue: string): string {
  if (venue === "Lab 1") return "badge badge-orange";
  if (venue === "Hall B") return "badge badge-blue";
  return "badge badge-default";
}

export function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    "A+": "#4f46e5", A: "#4f46e5", "B+": "#4f46e5", B: "#4f46e5",
    C: "#f59e0b", D: "#ef4444", F: "#ef4444",
  };
  return map[grade] ?? "#6b7280";
}

export function getTagColor(tag: string): string {
  const map: Record<string, string> = {
    ACTIVE: "#dbeafe", CORE: "#ede9fe", PRACTICAL: "#dcfce7",
    THEORY: "#fef3c7", LANGUAGE: "#ccfbf1",
  };
  return map[tag] ?? "#f3f4f6";
}

export function getTagTextColor(tag: string): string {
  const map: Record<string, string> = {
    ACTIVE: "#1d4ed8", CORE: "#6d28d9", PRACTICAL: "#15803d",
    THEORY: "#d97706", LANGUAGE: "#0f766e",
  };
  return map[tag] ?? "#374151";
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getDaysToGo(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getMidtermColor(value: number): string {
  if (value >= 90) return "#4f46e5";
  if (value >= 75) return "#4f46e5";
  return "#f59e0b";
}