"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ExperiencePhase, ExperienceTask } from "@/data/challenges/types";
import { DisclaimerModal } from "./DisclaimerModal";
import { SimulationPreview } from "./SimulationPreview";
import { ScreenReaderView } from "./ScreenReaderView";

interface ExperienceChallengeProps {
  phases: ExperiencePhase[];
  disclaimer: string;
  onComplete: (completedTasks: string[]) => void;
}

export function ExperienceChallenge({
  phases,
  disclaimer,
  onComplete,
}: ExperienceChallengeProps) {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [simulationActive, setSimulationActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
  const [taskErrors, setTaskErrors] = useState<Record<string, string>>({});
  const [taskAttempts, setTaskAttempts] = useState<Record<string, number>>({});
  const [showReveal, setShowReveal] = useState(false);
  const [isUnblurred, setIsUnblurred] = useState(false);
  const exitRef = useRef<HTMLButtonElement>(null);

  const currentPhase = phases[currentPhaseIndex];
  const isLastPhase = currentPhaseIndex === phases.length - 1;
  const allPhaseTasksDone = currentPhase.tasks.every((t) =>
    completedTasks.has(t.id)
  );
  const allTasksDone = phases.every((phase) =>
    phase.tasks.every((t) => completedTasks.has(t.id))
  );

  // Escape key to exit simulation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && simulationActive) {
        setSimulationActive(false);
        exitRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [simulationActive]);

  // Notify parent of completed tasks (for validation feedback)
  useEffect(() => {
    onComplete(Array.from(completedTasks));
  }, [completedTasks, onComplete]);

  const handleAcceptDisclaimer = useCallback(() => {
    setShowDisclaimer(false);
    setSimulationActive(true);
  }, []);

  const handleDeclineDisclaimer = useCallback(() => {
    setShowDisclaimer(false);
  }, []);

  const handleExitSimulation = useCallback(() => {
    setSimulationActive(false);
  }, []);

  const handleResumeSimulation = useCallback(() => {
    setSimulationActive(true);
  }, []);

  const handleCheckTask = useCallback(
    (task: ExperienceTask) => {
      const userInput = (taskInputs[task.id] || "").trim().toLowerCase();

      if (task.type === "text-match") {
        const expected = (task.params.answer as string).trim().toLowerCase();
        if (userInput === expected) {
          setCompletedTasks((prev) => new Set([...prev, task.id]));
          setTaskErrors((prev) => {
            const next = { ...prev };
            delete next[task.id];
            return next;
          });
        } else {
          setTaskAttempts((prev) => ({
            ...prev,
            [task.id]: (prev[task.id] || 0) + 1,
          }));
          setTaskErrors((prev) => ({
            ...prev,
            [task.id]: "That does not match. Try again, partner.",
          }));
        }
      } else if (task.type === "confirmation") {
        setCompletedTasks((prev) => new Set([...prev, task.id]));
      } else if (task.type === "quiz") {
        const expected = (task.params.correctAnswer as string)
          .trim()
          .toLowerCase();
        if (userInput === expected) {
          setCompletedTasks((prev) => new Set([...prev, task.id]));
          setTaskErrors((prev) => {
            const next = { ...prev };
            delete next[task.id];
            return next;
          });
        } else {
          setTaskAttempts((prev) => ({
            ...prev,
            [task.id]: (prev[task.id] || 0) + 1,
          }));
          setTaskErrors((prev) => ({
            ...prev,
            [task.id]: "Not quite right. Give it another shot.",
          }));
        }
      }
    },
    [taskInputs]
  );

  const [revealedTasks, setRevealedTasks] = useState<Set<string>>(new Set());

  const handleShowAnswer = useCallback((task: ExperienceTask) => {
    setRevealedTasks((prev) => new Set([...prev, task.id]));
  }, []);

  const handleNextPhase = useCallback(() => {
    setShowReveal(false);
    setIsUnblurred(false);
    setCurrentPhaseIndex((prev) => Math.min(prev + 1, phases.length - 1));
  }, [phases.length]);

  // Show disclaimer first
  if (showDisclaimer) {
    return (
      <DisclaimerModal
        disclaimer={disclaimer}
        onAccept={handleAcceptDisclaimer}
        onDecline={handleDeclineDisclaimer}
      />
    );
  }

  const isScreenReaderMode =
    currentPhase.simulation.effect === "screen-reader-view";

  return (
    <div className="space-y-4">
      {/* Sticky exit bar */}
      <div className="sticky top-16 z-40 bg-amber-50 border-2 border-amber-300 rounded-lg px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-amber-800">
            Empathy Trail Simulation  -  Phase {currentPhaseIndex + 1} of{" "}
            {phases.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {simulationActive && currentPhase.simulation.effect === "blur" && (
            <button
              type="button"
              onClick={() => setIsUnblurred((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                isUnblurred
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
              }`}
            >
              {isUnblurred ? "Re-blur Page" : "Unblur Page"}
            </button>
          )}
          {!simulationActive ? (
            <button
              type="button"
              onClick={handleResumeSimulation}
              className="px-3 py-1.5 text-xs font-medium bg-primary text-text-inverse rounded hover:bg-primary-dark transition-colors"
            >
              Resume Simulation
            </button>
          ) : (
            <button
              ref={exitRef}
              type="button"
              onClick={handleExitSimulation}
              className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor: pointer"
            >
              Exit Simulation (Esc)
            </button>
          )}
        </div>
      </div>

      {/* Phase header */}
      <div>
        <h2 className="text-lg font-bold text-text font-display">
          {currentPhase.title}
        </h2>
        <p className="text-sm text-text-muted mt-1">
          {currentPhase.description}
        </p>
      </div>

      {/* Simulation + Tasks layout */}
      <div
        className={`grid gap-6 ${
          isScreenReaderMode
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 lg:grid-cols-3"
        }`}
      >
        {/* Simulation viewport */}
        <div className={isScreenReaderMode ? "" : "lg:col-span-2"}>
          {isScreenReaderMode ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                Visual Page
              </h3>
              <SimulationPreview
                config={{
                  ...currentPhase.simulation,
                  effect: "blur",
                  intensity: 0,
                }}
                active={simulationActive}
              />
            </div>
          ) : (
            <SimulationPreview
              config={
                isUnblurred && currentPhase.simulation.effect === "blur"
                  ? { ...currentPhase.simulation, intensity: 0 }
                  : currentPhase.simulation
              }
              active={simulationActive}
            />
          )}
        </div>

        {/* Screen reader view (only for screen-reader mode) */}
        {isScreenReaderMode && (
          <div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
              Screen Reader Output
            </h3>
            <ScreenReaderView
              html={currentPhase.simulation.targetHTML}
              highlightIssues={true}
            />
          </div>
        )}

        {/* Task panel */}
        {!isScreenReaderMode && (
          <div className="lg:col-span-1">
            <TaskPanel
              tasks={currentPhase.tasks}
              completedTasks={completedTasks}
              taskInputs={taskInputs}
              taskErrors={taskErrors}
              onInputChange={(taskId, value) =>
                setTaskInputs((prev) => ({ ...prev, [taskId]: value }))
              }
              onCheckTask={handleCheckTask}
              taskAttempts={taskAttempts}
              revealedTasks={revealedTasks}
              onShowAnswer={handleShowAnswer}
              simulationActive={simulationActive}
            />
          </div>
        )}
      </div>

      {/* Task panel for screen-reader mode (full width below) */}
      {isScreenReaderMode && (
        <TaskPanel
          tasks={currentPhase.tasks}
          completedTasks={completedTasks}
          taskInputs={taskInputs}
          taskErrors={taskErrors}
          onInputChange={(taskId, value) =>
            setTaskInputs((prev) => ({ ...prev, [taskId]: value }))
          }
          onCheckTask={handleCheckTask}
          taskAttempts={taskAttempts}
          revealedTasks={revealedTasks}
          onShowAnswer={handleShowAnswer}
          simulationActive={simulationActive}
        />
      )}

      {/* Reveal text after phase completion */}
      {allPhaseTasksDone && currentPhase.revealAfterComplete && (
        <div
          className={`p-4 rounded-lg border-2 border-green-300 bg-green-50 ${
            showReveal ? "" : ""
          }`}
        >
          {!showReveal ? (
            <button
              type="button"
              onClick={() => setShowReveal(true)}
              className="text-sm font-semibold text-green-800 hover:text-green-900"
            >
              Reveal what you learned...
            </button>
          ) : (
            <div>
              <h3 className="text-sm font-bold text-green-800 mb-2">
                What You Learned
              </h3>
              <p className="text-sm text-green-700 leading-relaxed">
                {currentPhase.revealAfterComplete}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Phase navigation */}
      {allPhaseTasksDone && !isLastPhase && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNextPhase}
            className="px-5 py-2.5 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            Next Phase: {phases[currentPhaseIndex + 1].title}
          </button>
        </div>
      )}

      {/* All done message */}
      {allTasksDone && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-lg border-2 border-amber-300 bg-amber-50 text-center"
        >
          <p className="text-sm font-bold text-amber-800">
            All phases complete! Hit &quot;Draw!&quot; below to claim your
            bounty.
          </p>
        </div>
      )}
    </div>
  );
}

// Task panel sub-component
interface TaskPanelProps {
  tasks: ExperienceTask[];
  completedTasks: Set<string>;
  taskInputs: Record<string, string>;
  taskErrors: Record<string, string>;
  onInputChange: (taskId: string, value: string) => void;
  onCheckTask: (task: ExperienceTask) => void;
  taskAttempts: Record<string, number>;
  revealedTasks: Set<string>;
  onShowAnswer: (task: ExperienceTask) => void;
  simulationActive: boolean;
}

function TaskPanel({
  tasks,
  completedTasks,
  taskInputs,
  taskErrors,
  onInputChange,
  onCheckTask,
  taskAttempts,
  revealedTasks,
  onShowAnswer,
  simulationActive,
}: TaskPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
        Tasks
      </h3>
      <ul className="space-y-3" aria-label="Challenge tasks">
        {tasks.map((task) => {
          const isDone = completedTasks.has(task.id);
          return (
            <li
              key={task.id}
              className={`p-3 rounded-lg border ${
                isDone
                  ? "border-green-300 bg-green-50"
                  : "border-border bg-surface-muted"
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                    isDone
                      ? "bg-green-200 text-green-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {isDone ? "\u2713" : "\u2022"}
                </span>
                <span
                  className={`text-sm ${
                    isDone ? "text-green-700 line-through" : "text-text"
                  }`}
                >
                  {task.instruction}
                </span>
              </div>

              {!isDone && simulationActive && (
                <div className="ml-7 space-y-2">
                  {task.type === "text-match" && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={taskInputs[task.id] || ""}
                        onChange={(e) =>
                          onInputChange(task.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onCheckTask(task);
                        }}
                        className="flex-1 px-3 py-1.5 text-sm border border-border rounded bg-white"
                        placeholder="Type your answer..."
                        aria-label={`Answer for: ${task.instruction}`}
                      />
                      <button
                        type="button"
                        onClick={() => onCheckTask(task)}
                        className="px-3 py-1.5 text-xs font-medium bg-primary text-text-inverse rounded hover:bg-primary-dark transition-colors cursor-pointer"
                      >
                        Check
                      </button>
                    </div>
                  )}

                  {task.type === "confirmation" && (
                    <button
                      type="button"
                      onClick={() => onCheckTask(task)}
                      className="px-4 py-1.5 text-xs font-medium bg-primary text-text-inverse rounded hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                      Yes, I can see the difference
                    </button>
                  )}

                  {task.type === "quiz" && (
                    <div className="space-y-1.5">
                      {(task.params.options as string[])?.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`quiz-${task.id}`}
                            value={option}
                            checked={taskInputs[task.id] === option}
                            onChange={() => onInputChange(task.id, option)}
                            className="w-4 h-4"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                      <button
                        type="button"
                        onClick={() => onCheckTask(task)}
                        className="mt-1 px-3 py-1.5 text-xs font-medium bg-primary text-text-inverse rounded hover:bg-primary-dark transition-colors cursor-pointer"
                        disabled={!taskInputs[task.id]}
                      >
                        Check Answer
                      </button>
                    </div>
                  )}

                  {taskErrors[task.id] && (
                    <p className="text-xs text-red-600" role="alert">
                      {taskErrors[task.id]}
                    </p>
                  )}

                  {(taskAttempts[task.id] || 0) >= 2 && !completedTasks.has(task.id) && (
                    revealedTasks.has(task.id) ? (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                        Answer: <span className="font-semibold">{task.type === "quiz" ? (task.params.correctAnswer as string) : (task.params.answer as string)}</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onShowAnswer(task)}
                        className="text-xs text-primary hover:text-primary-dark underline transition-colors cursor-pointer"
                      >
                        Show Answer
                      </button>
                    )
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
