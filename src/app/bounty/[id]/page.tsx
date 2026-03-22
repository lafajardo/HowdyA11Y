import { bounties } from "@/data/bounties";
import { BountyPageClient } from "./client";
import type { Metadata } from "next";

interface BountyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return bounties.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: BountyPageProps): Promise<Metadata> {
  const { id } = await params;
  const bounty = bounties.find((b) => b.id === id);
  if (!bounty) return { title: "Bounty Not Found" };

  return {
    title: `${bounty.name} - Howdy, A11y`,
    description: bounty.tagline,
  };
}

export default async function BountyPage({ params }: BountyPageProps) {
  const { id } = await params;
  return <BountyPageClient bountyId={id} />;
}
