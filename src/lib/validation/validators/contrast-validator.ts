function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace("#", "");
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rS, gS, bS] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rS + 0.7152 * gS + 0.0722 * bS;
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function validateContrastRatio(
  foreground: string,
  background: string,
  minimumRatio: number
): { passed: boolean; message: string; ratio: number } {
  const ratio = contrastRatio(foreground, background);
  const roundedRatio = Math.round(ratio * 100) / 100;

  if (ratio >= minimumRatio) {
    return {
      passed: true,
      message: `Contrast ratio is ${roundedRatio}:1 (minimum ${minimumRatio}:1). Passes!`,
      ratio: roundedRatio,
    };
  }

  return {
    passed: false,
    message: `Contrast ratio is ${roundedRatio}:1 but needs to be at least ${minimumRatio}:1.`,
    ratio: roundedRatio,
  };
}
