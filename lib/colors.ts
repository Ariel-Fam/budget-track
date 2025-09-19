// Deterministic color selection based on a string key
const palette = [
  "#6366F1", // indigo-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#3B82F6", // blue-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#14B8A6", // teal-500
  "#22C55E", // green-500
  "#F97316", // orange-500
  "#A855F7", // purple-500
  "#06B6D4", // cyan-500
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function colorForKey(key: string, offset = 0): string {
  const idx = (hashString(key) + offset) % palette.length;
  return palette[idx];
}

export function colorsForKeys(keys: string[]): string[] {
  return keys.map((k, i) => colorForKey(k, i));
}


