import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/ai/anthropic-client";
import { CONTEXTUAL_HINT_PROMPT } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI features unavailable" },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const {
      description,
      instructions,
      validationRules,
      currentCode,
      controlValues,
      validationResult,
      hintsUsed,
      wcagRef,
    } = body;

    if (!description || !instructions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userMessage = [
      `Challenge: ${description}`,
      `Instructions: ${instructions}`,
      wcagRef ? `WCAG Reference: ${wcagRef.criterion} - ${wcagRef.title} (Level ${wcagRef.level})` : "",
      validationRules ? `Validation Rules: ${JSON.stringify(validationRules)}` : "",
      currentCode ? `Current Code:\n${currentCode.slice(0, 4000)}` : "",
      controlValues ? `Current Control Values: ${JSON.stringify(controlValues)}` : "",
      validationResult ? `Validation Result: ${JSON.stringify(validationResult)}` : "",
      `Hints already used: ${hintsUsed ?? 0}`,
      "",
      "Please give me a helpful nudge without revealing the answer.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const hint = await callClaude(CONTEXTUAL_HINT_PROMPT, [
      { role: "user", content: userMessage },
    ]);

    return NextResponse.json({ hint });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate hint" },
      { status: 500 }
    );
  }
}
