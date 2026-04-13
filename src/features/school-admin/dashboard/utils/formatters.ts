export function getAvatarColor(
  initials: string,
  colorMap: Record<string, string>
): string {
  return colorMap[initials] ?? "bg-gray-400";
}

export function formatRate(rate: number): string {
  return `${rate}%`;
}

export function formatWeeklyDelta(delta: number): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta} vs LW`;
}

export function joinClassNames(classes: string[]): string {
  return classes.join(", ");
}

