import { allChallenges, getChallengeBySlug } from "@/data/challenges";
import { ChallengePageClient } from "./client";
import type { Metadata } from "next";

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allChallenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: ChallengePageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = getChallengeBySlug(slug);
  if (!challenge) return { title: "Challenge Not Found" };

  return {
    title: `${challenge.title} - a11y Quest`,
    description: challenge.description,
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;
  return <ChallengePageClient slug={slug} />;
}
