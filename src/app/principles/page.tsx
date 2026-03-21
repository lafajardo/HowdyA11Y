import Link from "next/link";
import { principles } from "@/data/principles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Code of the Frontier - a11y Roundup",
  description: "Learn the four laws of the web frontier: Perceivable, Operable, Understandable, and Robust.",
};

export default function PrinciplesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4 font-display">
        The Code of the Frontier
      </h1>
      <p className="text-lg text-text-muted mb-12 max-w-3xl">
        Every good cowpoke lives by a code. On the web frontier, WCAG lays
        down the law with four principles. These are the rules that keep
        the digital territory safe and accessible for all who ride through.
      </p>

      <div className="space-y-8">
        {principles.map((p) => (
          <section
            key={p.id}
            aria-labelledby={`principle-${p.id}`}
            className="p-8 rounded-xl border-2 border-border bg-surface-muted"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div
                className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white font-display"
                style={{ backgroundColor: p.color }}
                aria-hidden="true"
              >
                {p.number}
              </div>
              <div className="flex-1">
                <h2
                  id={`principle-${p.id}`}
                  className="text-2xl font-bold text-text mb-2 font-display"
                >
                  Law {p.number}: {p.name}
                </h2>
                <p className="text-text-muted mb-4">{p.longDescription}</p>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/challenges?principle=${p.id}`}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-text-inverse font-medium text-sm hover:bg-primary-dark transition-colors"
                  >
                    Ride Out on {p.name} Bounties ({p.challengeCount})
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
