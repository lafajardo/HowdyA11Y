"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useAIFetch } from "@/lib/ai/use-ai-fetch";
import { createFocusTrap } from "@/lib/ai/focus-trap";
import { useChallengeContext } from "@/context/ChallengeContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function MentorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { fetchAI, isLoading, error } = useAIFetch();
  const { challengeContext } = useChallengeContext();

  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const cleanup = createFocusTrap(panelRef.current);
    inputRef.current?.focus();
    return cleanup;
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");

    const result = await fetchAI<{ reply: string }>("/api/ai/chat", {
      messages: updated,
      challengeContext: challengeContext ?? undefined,
    });

    if (result) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
    }
  }, [input, messages, isLoading, fetchAI, challengeContext]);

  return (
    <>
      {/* Toggle button */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close accessibility mentor chat" : "Open accessibility mentor chat"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-text-inverse rounded-full shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
      >
        {isOpen ? (
          <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby="mentor-chat-heading"
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-amber-50 border-2 border-amber-300 rounded-xl shadow-2xl flex flex-col"
          style={{ maxHeight: "min(500px, 70vh)" }}
        >
          {/* Header */}
          <div className="p-4 border-b border-amber-200">
            <div className="flex items-center justify-between">
              <h2
                id="mentor-chat-heading"
                className="text-lg font-display text-amber-900"
              >
                Ask the Trail Guide
              </h2>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Close chat"
              className="p-1 rounded hover:bg-amber-200 transition-colors"
            >
              <svg aria-hidden="true" className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </div>
            {challengeContext && (
              <p className="text-xs text-amber-700 mt-1 truncate">
                Helping with: <span className="font-semibold">{challengeContext.title}</span>
              </p>
            )}
          </div>

          {/* Messages */}
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.length === 0 && (
              <p className="text-sm text-amber-700 italic">
                {challengeContext
                  ? `Howdy, partner! I can see you're working on "${challengeContext.title}." Ask me anything about this challenge or WCAG in general.`
                  : "Howdy, partner! Ask me anything about web accessibility and WCAG standards."}
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-text-inverse"
                      : "bg-white border border-amber-200 text-amber-900"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose-chat">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg text-sm bg-white border border-amber-200 text-amber-600 italic">
                  Trail Guide is pondering...
                </div>
              </div>
            )}
            {error && (
              <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-amber-200 flex gap-2"
          >
            <label htmlFor="mentor-chat-input" className="sr-only">
              Type your WCAG question
            </label>
            <input
              ref={inputRef}
              id="mentor-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about WCAG..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 text-sm font-medium bg-primary text-text-inverse rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
