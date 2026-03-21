"use client";

import { useRef, useEffect, useCallback } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { ViewUpdate } from "@codemirror/view";

interface CodeEditorProps {
  initialDoc: string;
  onChange: (doc: string) => void;
  ariaLabel?: string;
}

export function CodeEditor({ initialDoc, onChange, ariaLabel }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        basicSetup,
        html(),
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.contentAttributes.of({
          "aria-label": ariaLabel || "Code editor for accessibility challenge",
        }),
        EditorView.theme({
          "&": {
            fontSize: "14px",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
          },
          ".cm-content": {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: "0.5rem 0",
          },
          ".cm-gutters": {
            backgroundColor: "#f8fafc",
            borderRight: "1px solid #e2e8f0",
          },
          "&.cm-focused": {
            outline: "3px solid #1a56db",
            outlineOffset: "2px",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetCode = useCallback((code: string) => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: code,
        },
      });
    }
  }, []);

  return (
    <div>
      <div ref={containerRef} className="overflow-hidden rounded-lg" />
      <button
        type="button"
        onClick={() => resetCode(initialDoc)}
        className="mt-2 text-xs px-3 py-1.5 rounded border border-border text-text-muted hover:bg-surface-muted transition-colors"
      >
        Reset Code
      </button>
    </div>
  );
}
