import type { SimulationConfig } from "@/data/challenges/types";
import { COLOR_BLIND_SVG_FILTERS } from "./colorblind-filters";

export function getSimulationCSS(config: SimulationConfig): string {
  switch (config.effect) {
    case "blur":
      return `body { filter: blur(${(config.intensity ?? 0.5) * 5}px); }`;

    case "protanopia":
      return `body { filter: url(#protanopia-filter); }`;

    case "deuteranopia":
      return `body { filter: url(#deuteranopia-filter); }`;

    case "low-contrast":
      return `body { filter: contrast(0.3) brightness(1.2); }`;

    case "no-mouse":
      return `* { cursor: none !important; }`;

    case "screen-reader-view":
      return "";

    default:
      return "";
  }
}

export function getSimulationScript(config: SimulationConfig): string {
  if (config.effect === "no-mouse") {
    return `
      document.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); }, true);
      document.addEventListener('mouseup', function(e) { e.preventDefault(); e.stopPropagation(); }, true);
      document.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); }, true);
      document.addEventListener('pointerdown', function(e) {
        if (e.pointerType === 'mouse') { e.preventDefault(); e.stopPropagation(); }
      }, true);
      document.addEventListener('pointerup', function(e) {
        if (e.pointerType === 'mouse') { e.preventDefault(); e.stopPropagation(); }
      }, true);
    `;
  }
  return "";
}

export function getSimulationSVGFilters(config: SimulationConfig): string {
  if (config.effect === "protanopia" || config.effect === "deuteranopia") {
    return COLOR_BLIND_SVG_FILTERS;
  }
  return "";
}

export function buildSimulationHTML(config: SimulationConfig): string {
  const css = getSimulationCSS(config);
  const script = getSimulationScript(config);
  const svgFilters = getSimulationSVGFilters(config);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { margin: 0; }
    ${css}
  </style>
</head>
<body>
  ${svgFilters}
  ${config.targetHTML}
  ${script ? `<script>${script}<\/script>` : ""}
</body>
</html>`;
}
