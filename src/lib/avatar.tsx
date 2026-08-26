// Deterministic bot avatar — colored circle with initials based on name hash.
const PALETTE = [
  "#C8882A","#d4a843","#9E3B3B","#21598C","#2F735D",
  "#6B7280","#b7791f","#2b6cb0","#276749","#9b2c2c"
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function BotAvatar({ name, size = 40, className = "" }: { name: string; size?: number; className?: string }) {
  const h = hash(name);
  const bg = PALETTE[h % PALETTE.length];
  const initials = name
    .split(/[-\s]/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 text-white font-bold ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(size * 0.22, 6),
        background: bg,
        fontSize: size * 0.38,
        fontFamily: "'Space Mono', ui-monospace, monospace",
        letterSpacing: "0.02em",
      }}
      title={name}
    >
      {initials}
    </div>
  );
}

/** Simple placeholder image — colored square for when we have no avatar */
export function BotAvatarImg({ name, size = 40, className = "" }: { name: string; size?: number; className?: string }) {
  const h = hash(name);
  const hue = h % 360;
  return (
    <div
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(size * 0.22, 6),
        background: `linear-gradient(135deg, hsl(${hue},40%,25%) 0%, hsl(${hue},30%,14%) 100%)`,
      }}
      title={name}
    />
  );
}