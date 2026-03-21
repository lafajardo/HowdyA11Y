import type { ConformanceLevel } from "@/data/challenges/types";

const levelColors: Record<ConformanceLevel, string> = {
  A: "bg-amber-100 text-amber-800 border-amber-200",
  AA: "bg-stone-200 text-stone-800 border-stone-300",
  AAA: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

interface WCAGBadgeProps {
  criterion: string;
  level: ConformanceLevel;
  title?: string;
  url?: string;
}

export function WCAGBadge({ criterion, level, title, url }: WCAGBadgeProps) {
  const content = (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${levelColors[level]}`}
    >
      <span>WCAG {criterion}</span>
      <span className="opacity-60">|</span>
      <span>Level {level}</span>
    </span>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-80 transition-opacity"
        title={title ? `WCAG ${criterion}: ${title}` : undefined}
      >
        {content}
        <span className="sr-only"> (opens W3C specification in new tab)</span>
      </a>
    );
  }

  return content;
}
