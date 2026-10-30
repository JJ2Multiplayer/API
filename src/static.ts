import data from "./data/config.json";

export const config = data;

export function gameModeName(gameMode: number, customMode = 0): string {
  if (customMode === 0) {
    return (data.gameModes as Record<string, string>)[String(gameMode)] ?? "Unknown";
  }
  return (data.customModes as Record<string, string>)[String(customMode)] ?? "Custom";
}

export function characterName(id: number): string {
  return data.characters[id] ?? "Undefined";
}

export function gunName(id: number): string {
  return data.guns[id] ?? "";
}

export function teamName(id: number): string {
  return data.teams[id]?.name ?? "Unknown";
}

export function teamColor(id: number): string {
  return data.teams[id]?.color ?? "#808080";
}

export function clanRoleName(role: string | number | null): string {
  if (role === null) return "Unknown";
  return (data.clanRoles as Record<string, string>)[String(role)] ?? String(role);
}

export function formatDuration(ms: number): string {
  const total = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function toDate(unixSeconds: number | null): Date | null {
  return unixSeconds ? new Date(unixSeconds * 1000) : null;
}

export function parseResult(result: string): number[] {
  return result
    .split("-")
    .map((v) => parseInt(v.trim(), 10))
    .filter((v) => !Number.isNaN(v));
}
