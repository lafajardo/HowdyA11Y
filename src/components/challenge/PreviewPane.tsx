"use client";

import { useState } from "react";

interface PreviewPaneProps {
  currentHTML: string;
  initialHTML: string;
}

export function PreviewPane({ currentHTML, initialHTML }: PreviewPaneProps) {
  const [showBefore, setShowBefore] = useState(false);

  const displayHTML = showBefore ? initialHTML : currentHTML;

  return (
    <section aria-labelledby="preview-heading" className="space-y-2">
      <div className="flex items-center justify-between">
        <h2
          id="preview-heading"
          className="text-sm font-semibold text-text-muted uppercase tracking-wide"
        >
          Preview
        </h2>
        <div className="flex items-center gap-1 bg-surface-muted rounded-lg p-0.5" role="tablist">
          <button
            role="tab"
            aria-selected={!showBefore}
            onClick={() => setShowBefore(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              !showBefore
                ? "bg-white text-text shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            Current
          </button>
          <button
            role="tab"
            aria-selected={showBefore}
            onClick={() => setShowBefore(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              showBefore
                ? "bg-white text-text shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            Original (Broken)
          </button>
        </div>
      </div>
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <iframe
          srcDoc={`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;}</style></head><body>${displayHTML}</body></html>`}
          title={showBefore ? "Original inaccessible preview" : "Current preview with your changes"}
          sandbox="allow-scripts"
          className="w-full min-h-[200px] block"
          style={{ height: "300px" }}
        />
      </div>
    </section>
  );
}
