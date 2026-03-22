import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/ai/anthropic-client";
import { MENTOR_CHAT_PROMPT, buildMentorPrompt } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { auth0 } from "@/lib/auth0";

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to use the Trail Guide" },
      { status: 401 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
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
    const { messages, challengeContext } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const systemPrompt = challengeContext
      ? buildMentorPrompt(challengeContext)
      : MENTOR_CHAT_PROMPT;

    const reply = await callClaude(systemPrompt, messages);

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
