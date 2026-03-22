"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/progress", label: "Trail Map" },
  { href: "/about", label: "Campfire" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("ui-high-contrast");
    if (stored === "true") {
      setHighContrastEnabled(true);
      document.documentElement.dataset.contrast = "high";
      return;
    }

    if (stored === "false") {
      return;
    }

    const prefersHighContrast = window.matchMedia(
      "(prefers-contrast: more)"
    ).matches;

    if (prefersHighContrast) {
      setHighContrastEnabled(true);
      document.documentElement.dataset.contrast = "high";
    }
  }, []);

  const toggleHighContrast = () => {
    const next = !highContrastEnabled;
    setHighContrastEnabled(next);

    if (next) {
      document.documentElement.dataset.contrast = "high";
    } else {
      delete document.documentElement.dataset.contrast;
    }

    window.localStorage.setItem("ui-high-contrast", String(next));
  };

  return (
    <header className="border-b border-stone-700 bg-surface-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-text-inverse"
          >
            {/* Sheriff star icon */}
            <svg
              aria-hidden="true"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="#fbbf24"
              stroke="none"
            >
              <polygon points="12,0 14.5,8.5 24,9.5 17,15 19,24 12,19 5,24 7,15 0,9.5 9.5,8.5" />
            </svg>
            <span className="font-display">Howdy A11y</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {/* Desktop nav */}
            <nav aria-label="Main navigation">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-text-inverse"
                            : "text-stone-300 hover:bg-stone-700 hover:text-text-inverse"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              type="button"
              onClick={toggleHighContrast}
              aria-pressed={highContrastEnabled}
              className="px-3 py-2 rounded-lg text-sm font-medium border border-stone-600 text-stone-200 hover:bg-stone-700 transition-colors"
            >
              High Contrast: {highContrastEnabled ? "On" : "Off"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleHighContrast}
              aria-pressed={highContrastEnabled}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-stone-600 text-stone-200 hover:bg-stone-700"
            >
              Contrast {highContrastEnabled ? "On" : "Off"}
            </button>

            <button
              type="button"
              className="p-2 rounded-lg text-stone-300 hover:bg-stone-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileMenuOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav id="mobile-menu" aria-label="Mobile navigation" className="md:hidden pb-4">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-text-inverse"
                          : "text-stone-300 hover:bg-stone-700 hover:text-text-inverse"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
