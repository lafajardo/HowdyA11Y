"use client";

import type { SimulationConfig } from "@/data/challenges/types";
import { buildSimulationHTML } from "@/lib/simulations/effects";

interface SimulationPreviewProps {
  config: SimulationConfig;
  active: boolean;
}

export function SimulationPreview({ config, active }: SimulationPreviewProps) {
  if (!active) {
    return (
      <div className="w-full h-[350px] bg-surface-muted rounded-lg border border-border flex items-center justify-center text-text-muted text-sm">
        Simulation not started yet
      </div>
    );
  }

  const html = buildSimulationHTML(config);

  return (
    <div className="w-full rounded-lg border-2 border-amber-400 overflow-hidden bg-white">
      <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-800">
        Simulation Active
        {config.effect === "no-mouse" && " — Mouse disabled, use keyboard only (Tab, Enter, Arrow keys)"}
        {config.effect === "blur" && " — Vision blur applied"}
        {config.effect === "protanopia" && " — Protanopia (red-green color blindness) filter applied"}
        {config.effect === "deuteranopia" && " — Deuteranopia (red-green color blindness) filter applied"}
      </div>
      <iframe
        srcDoc={html}
        title="Simulation viewport"
        sandbox="allow-scripts"
        className="w-full block"
        style={{ height: "350px" }}
      />
    </div>
  );
}
