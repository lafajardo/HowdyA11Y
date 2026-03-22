"use client";

import { useEffect, useRef } from "react";

interface DisclaimerModalProps {
  disclaimer: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function DisclaimerModal({
  disclaimer,
  onAccept,
  onDecline,
}: DisclaimerModalProps) {
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    acceptRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDecline();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onDecline]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="bg-surface rounded-xl border-2 border-amber-400 max-w-lg w-full p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-amber-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 id="disclaimer-title" className="text-lg font-bold text-text font-display">
            Before You Ride
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-text leading-relaxed">{disclaimer}</p>
          <p className="text-sm text-text-muted leading-relaxed">
            You can exit the simulation at any time by pressing <kbd className="px-1.5 py-0.5 bg-surface-muted border border-border rounded text-xs font-mono">Escape</kbd> or
            clicking the exit button.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            ref={acceptRef}
            type="button"
            onClick={onAccept}
            className="px-6 py-3 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            I Understand  -  Start Simulation
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="px-6 py-3 border border-border text-text font-medium rounded-lg hover:bg-surface-muted transition-colors text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
