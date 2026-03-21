import type { ValidationResult } from "@/lib/validation/engine";

interface ValidationFeedbackProps {
  result: ValidationResult | null;
  maxScore: number;
}

export function ValidationFeedback({ result, maxScore }: ValidationFeedbackProps) {
  if (!result) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-lg border-2 p-4 ${
        result.allPassed
          ? "border-green-300 bg-green-50"
          : "border-red-300 bg-red-50"
      }`}
    >
      {result.allPassed ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-bold text-green-800">
              Outlaw Captured!
            </span>
          </div>
          <p className="text-sm text-green-700 mb-2">
            You earned <strong>{result.score}</strong> out of {maxScore} gold.
          </p>
          <ul className="space-y-1">
            {result.results.map((r) => (
              <li key={r.ruleId} className="flex items-start gap-2 text-sm text-green-700">
                <svg aria-hidden="true" className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{r.message}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-bold text-red-800">
              The outlaw got away! Try again, partner.
            </span>
          </div>
          <ul className="space-y-1">
            {result.results.map((r) => (
              <li key={r.ruleId} className="flex items-start gap-2 text-sm">
                {r.passed ? (
                  <svg aria-hidden="true" className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={r.passed ? "text-green-700" : "text-red-700"}>
                  {r.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
