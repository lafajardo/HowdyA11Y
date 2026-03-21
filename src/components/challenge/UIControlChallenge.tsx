"use client";

import type { UIControl } from "@/data/challenges/types";
import { contrastRatio } from "@/lib/validation/validators/contrast-validator";

interface UIControlChallengeProps {
  controls: UIControl[];
  values: Record<string, unknown>;
  onChange: (id: string, value: unknown) => void;
}

export function UIControlChallenge({
  controls,
  values,
  onChange,
}: UIControlChallengeProps) {
  // Check if this is a contrast challenge
  const hasContrastPair =
    controls.some((c) => c.id === "textColor") &&
    controls.some((c) => c.id === "bgColor");

  return (
    <div className="space-y-5">
      {controls.map((control) => (
        <div key={control.id}>
          <label
            htmlFor={`control-${control.id}`}
            className="block text-sm font-semibold text-text mb-1"
          >
            {control.label}
          </label>
          <p className="text-xs text-text-muted mb-2">{control.description}</p>
          {renderControl(control, values[control.id], (val) =>
            onChange(control.id, val)
          )}
        </div>
      ))}

      {/* Live contrast ratio display */}
      {hasContrastPair && (
        <ContrastDisplay
          foreground={values.textColor as string}
          background={values.bgColor as string}
        />
      )}
    </div>
  );
}

function renderControl(
  control: UIControl,
  value: unknown,
  onChange: (value: unknown) => void
) {
  switch (control.type) {
    case "color-picker":
      return (
        <div className="flex items-center gap-3">
          <input
            id={`control-${control.id}`}
            type="color"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded border border-border cursor-pointer"
          />
          <input
            type="text"
            value={value as string}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
            }}
            className="w-28 px-3 py-2 text-sm font-mono border border-border rounded-lg"
            aria-label={`${control.label} hex value`}
          />
        </div>
      );

    case "slider":
      return (
        <div className="flex items-center gap-3">
          <input
            id={`control-${control.id}`}
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-mono text-text w-16 text-right">
            {value as number}
            {control.id.includes("Size") || control.id.includes("Spacing")
              ? "px"
              : control.id.includes("Zoom")
                ? "%"
                : ""}
          </span>
        </div>
      );

    case "toggle":
      return (
        <button
          id={`control-${control.id}`}
          type="button"
          role="switch"
          aria-checked={value as boolean}
          onClick={() => onChange(!(value as boolean))}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            value ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      );

    case "dropdown":
      return (
        <select
          id={`control-${control.id}`}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white"
        >
          {control.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "text-input":
      return (
        <input
          id={`control-${control.id}`}
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg"
        />
      );

    default:
      return null;
  }
}

function ContrastDisplay({
  foreground,
  background,
}: {
  foreground: string;
  background: string;
}) {
  let ratio = 0;
  try {
    ratio = contrastRatio(foreground, background);
  } catch {
    // Invalid color values
  }
  const roundedRatio = Math.round(ratio * 100) / 100;
  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7;

  return (
    <div
      className="p-4 rounded-lg border border-border bg-surface-muted"
      aria-live="polite"
    >
      <div className="text-sm font-semibold text-text mb-2">
        Contrast Ratio
      </div>
      <div className="text-3xl font-bold text-text mb-3">
        {roundedRatio}:1
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
              passesAA
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
            aria-hidden="true"
          >
            {passesAA ? "\u2713" : "\u2717"}
          </span>
          <span>
            WCAG AA (4.5:1):{" "}
            <strong className={passesAA ? "text-green-700" : "text-red-700"}>
              {passesAA ? "Pass" : "Fail"}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
              passesAAA
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
            aria-hidden="true"
          >
            {passesAAA ? "\u2713" : "\u2717"}
          </span>
          <span>
            WCAG AAA (7:1):{" "}
            <strong className={passesAAA ? "text-green-700" : "text-red-700"}>
              {passesAAA ? "Pass" : "Fail"}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
