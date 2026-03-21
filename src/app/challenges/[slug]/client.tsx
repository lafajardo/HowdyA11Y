"use client";

import { notFound } from "next/navigation";
import { getChallengeBySlug } from "@/data/challenges";
import { ChallengeShell } from "@/components/challenge/ChallengeShell";

interface ChallengePageClientProps {
  slug: string;
}

export function ChallengePageClient({ slug }: ChallengePageClientProps) {
  const challenge = getChallengeBySlug(slug);

  if (!challenge) {
    notFound();
  }

  return <ChallengeShell challenge={challenge} />;
}
