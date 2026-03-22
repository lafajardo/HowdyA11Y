import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/ai/gemini-client";
import { VALIDATION_EXPLAIN_PROMPT } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { auth0 } from "@/lib/auth0";

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to use explanations" },
      { status: 401 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "AI features unavailable" },
      { status: 503 }
    );
  }

  const rateLimitKey = session.user.sub ?? "unknown";
  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const {
      challengeDescription,
      instructions,
      failingRules,
      currentCode,
      controlValues,
      wcagRef,
    } = body;

    if (!challengeDescription || !failingRules) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userMessage = [
      `Challenge: ${challengeDescription}`,
      `Instructions: ${instructions}`,
      wcagRef ? `WCAG Reference: ${wcagRef.criterion} - ${wcagRef.title} (Level ${wcagRef.level})` : "",
      `Failing Rules:\n${JSON.stringify(failingRules, null, 2)}`,
      currentCode ? `Current Code:\n${currentCode.slice(0, 4000)}` : "",
      controlValues ? `Current Control Values: ${JSON.stringify(controlValues)}` : "",
      "",
      "Please explain what went wrong and give hints on how to fix it.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const explanation = await callGemini(VALIDATION_EXPLAIN_PROMPT, [
      { role: "user", content: userMessage },
    ]);

    return NextResponse.json({ explanation });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
