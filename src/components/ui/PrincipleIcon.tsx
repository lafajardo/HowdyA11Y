interface PrincipleIconProps {
  icon: string;
  color: string;
  size?: number;
}

export function PrincipleIcon({ icon, color, size = 32 }: PrincipleIconProps) {
  const iconPaths: Record<string, React.ReactNode> = {
    lantern: (
      <>
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M10 6v1" />
        <path d="M14 6v1" />
        <path d="M7 7h10l1 11H6L7 7z" />
        <path d="M12 10v4" />
        <circle cx="12" cy="12" r="2" fill={color} fillOpacity="0.3" />
        <path d="M8 18h8v2H8z" />
        <path d="M10 20v2" />
        <path d="M14 20v2" />
      </>
    ),
    horseshoe: (
      <>
        <path d="M6 14V8a6 6 0 0 1 12 0v6" />
        <circle cx="6" cy="16" r="2" />
        <circle cx="18" cy="16" r="2" />
        <path d="M8 8a4 4 0 0 1 8 0v4" />
      </>
    ),
    scroll: (
      <>
        <path d="M8 2h8a2 2 0 0 1 2 2v1" />
        <path d="M18 5c1.1 0 2 .9 2 2s-.9 2-2 2H6c-1.1 0-2 .9-2 2s.9 2 2 2h12" />
        <path d="M6 9v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" />
        <path d="M10 13h4" />
        <path d="M10 17h4" />
      </>
    ),
    star: (
      <>
        <polygon points="12,2 14.5,9 22,9.5 16.5,14 18,22 12,18 6,22 7.5,14 2,9.5 9.5,9" />
      </>
    ),
    boots: (
      <>
        <path d="M7 2v10c0 1-1 2-2 3s-2 3-2 5c0 1.5 1.5 2 4 2h2c2 0 3-.5 3-2v-4" />
        <path d="M17 2v10c0 1 1 2 2 3s2 3 2 5c0 1.5-1.5 2-4 2h-2c-2 0-3-.5-3-2v-4" />
        <path d="M7 6h10" />
        <path d="M7 10h10" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[icon]}
    </svg>
  );
}
