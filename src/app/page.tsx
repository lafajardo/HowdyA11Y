import Link from "next/link";
import { principles } from "@/data/principles";

function PrincipleIcon({ icon, color }: { icon: string; color: string }) {
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
  };

  return (
    <svg
      aria-hidden="true"
      width="32"
      height="32"
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

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text tracking-tight font-display">
          Wrangle Accessibility Bugs
          <br />
          <span className="text-primary">on the Digital Frontier</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">
          Saddle up, partner. Accessibility outlaws are plaguing the web &mdash;
          bad contrast, missing labels, keyboard traps. Round &rsquo;em up and
          make the web work for everyone.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/challenges"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-primary text-text-inverse font-semibold text-lg hover:bg-primary-dark transition-colors"
          >
            Saddle Up
            <svg
              aria-hidden="true"
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/principles"
            className="inline-flex items-center px-8 py-4 rounded-lg border-2 border-border text-text font-semibold text-lg hover:bg-surface-muted transition-colors"
          >
            Learn the Code
          </Link>
        </div>
      </section>

      {/* Why this matters */}
      <section aria-labelledby="why-heading" className="py-12">
        <h2
          id="why-heading"
          className="text-2xl sm:text-3xl font-bold text-text text-center mb-4 font-display"
        >
          Why This Frontier Needs You
        </h2>
        <p className="text-text-muted text-center max-w-3xl mx-auto mb-12">
          Over 1 billion folks worldwide live with some form of disability.
          The web is lawless territory &mdash; most sites are riddled with accessibility
          outlaws. It is time someone brought order to this frontier.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border-2 border-border rounded-xl bg-surface-muted">
            <div className="text-4xl font-bold text-primary font-display mb-2">16%</div>
            <p className="text-text-muted">
              of the world&rsquo;s population lives with significant disability
            </p>
          </div>
          <div className="text-center p-6 border-2 border-border rounded-xl bg-surface-muted">
            <div className="text-4xl font-bold text-primary font-display mb-2">96.3%</div>
            <p className="text-text-muted">
              of home pages are home to detectable WCAG outlaws
            </p>
          </div>
          <div className="text-center p-6 border-2 border-border rounded-xl bg-surface-muted">
            <div className="text-4xl font-bold text-primary font-display mb-2">17</div>
            <p className="text-text-muted">
              bounties to collect across all 4 laws of the frontier
            </p>
          </div>
        </div>
      </section>

      {/* Principles overview */}
      <section aria-labelledby="principles-heading" className="py-12 pb-24">
        <h2
          id="principles-heading"
          className="text-2xl sm:text-3xl font-bold text-text text-center mb-12 font-display"
        >
          The Four Laws of the Frontier
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((p) => (
            <Link
              key={p.id}
              href={`/challenges?principle=${p.id}`}
              className="group block p-6 rounded-xl border-2 border-border hover:border-primary transition-colors bg-surface-muted"
            >
              <div className="mb-4">
                <PrincipleIcon icon={p.icon} color={p.color} />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                {p.number}. {p.name}
              </h3>
              <p className="text-sm text-text-muted mb-3">{p.description}</p>
              <p className="text-sm font-medium" style={{ color: p.color }}>
                {p.challengeCount} bounties
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
