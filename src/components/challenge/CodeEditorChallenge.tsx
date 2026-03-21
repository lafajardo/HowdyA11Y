"use client";

import dynamic from "next/dynamic";

const CodeEditor = dynamic(
  () => import("@/components/editor/CodeEditor").then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-surface-muted rounded-lg animate-pulse flex items-center justify-center text-text-muted text-sm">
        Loading editor...
      </div>
    ),
  }
);

interface CodeEditorChallengeProps {
  initialCode: string;
  currentCode: string;
  onChange: (code: string) => void;
}

export function CodeEditorChallenge({
  initialCode,
  currentCode,
  onChange,
}: CodeEditorChallengeProps) {
  return (
    <div>
      <CodeEditor
        initialDoc={initialCode}
        onChange={onChange}
        ariaLabel="Edit the HTML code to fix the accessibility issue"
      />
    </div>
  );
}
