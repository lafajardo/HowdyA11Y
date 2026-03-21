"use client";

import { useState, useCallback } from "react";
import {
  linearizeHTML,
  type ScreenReaderNode,
} from "@/lib/simulations/screen-reader-parser";

interface ScreenReaderViewProps {
  html: string;
  highlightIssues: boolean;
}

const typeIcons: Record<ScreenReaderNode["type"], string> = {
  heading: "H",
  text: "T",
  image: "IMG",
  link: "A",
  button: "BTN",
  input: "INP",
  landmark: "LM",
  list: "UL",
  separator: "---",
};

const typeColors: Record<ScreenReaderNode["type"], string> = {
  heading: "text-blue-700 bg-blue-50",
  text: "text-stone-600 bg-stone-50",
  image: "text-green-700 bg-green-50",
  link: "text-purple-700 bg-purple-50",
  button: "text-amber-700 bg-amber-50",
  input: "text-cyan-700 bg-cyan-50",
  landmark: "text-indigo-700 bg-indigo-50",
  list: "text-stone-600 bg-stone-50",
  separator: "text-stone-400 bg-stone-50",
};

export function ScreenReaderView({
  html,
  highlightIssues,
}: ScreenReaderViewProps) {
  const [speaking, setSpeaking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const nodes = linearizeHTML(html);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setSpeaking(true);

    let index = 0;
    function speakNext() {
      if (index >= nodes.length) {
        setSpeaking(false);
        setCurrentIndex(-1);
        return;
      }

      setCurrentIndex(index);
      const node = nodes[index];
      const utterance = new SpeechSynthesisUtterance(node.announcement);
      utterance.rate = 0.9;
      utterance.onend = () => {
        index++;
        speakNext();
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setCurrentIndex(-1);
      };
      window.speechSynthesis.speak(utterance);
    }

    speakNext();
  }, [nodes]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setCurrentIndex(-1);
  }, []);

  const totalIssues = nodes.filter((n) => n.issues.length > 0).length;

  return (
    <div className="bg-stone-900 rounded-lg border border-stone-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-800 border-b border-stone-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-400">
            Screen Reader Output
          </span>
          {highlightIssues && totalIssues > 0 && (
            <span className="text-xs px-1.5 py-0.5 bg-red-900 text-red-300 rounded">
              {totalIssues} issue{totalIssues !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!speaking ? (
            <button
              type="button"
              onClick={speak}
              className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors font-medium"
              aria-label="Read page aloud using speech synthesis"
            >
              Read Aloud
            </button>
          ) : (
            <button
              type="button"
              onClick={stopSpeaking}
              className="text-xs px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
              aria-label="Stop reading"
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="p-4 max-h-[350px] overflow-y-auto font-mono text-sm space-y-1"
        role="log"
        aria-label="Screen reader announcements"
      >
        {nodes.map((node, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 p-1.5 rounded ${
              currentIndex === i ? "bg-amber-900/50 ring-1 ring-amber-500" : ""
            } ${
              highlightIssues && node.issues.length > 0
                ? "bg-red-900/30 ring-1 ring-red-500/50"
                : ""
            }`}
          >
            <span
              className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${typeColors[node.type]}`}
            >
              {typeIcons[node.type]}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-stone-200">{node.announcement}</span>
              {highlightIssues &&
                node.issues.map((issue, j) => (
                  <span
                    key={j}
                    className="block text-xs text-red-400 mt-0.5"
                  >
                    Issue: {issue}
                  </span>
                ))}
            </div>
          </div>
        ))}
        {nodes.length === 0 && (
          <p className="text-stone-500 text-center py-4">
            No content to announce.
          </p>
        )}
      </div>
    </div>
  );
}
