import type { Metadata } from "next";
import BueroaufloesungPageContent from "@/components/BueroaufloesungPageContent";
import { bueroaufloesungMeta } from "@/data/bueroaufloesung";

export const metadata: Metadata = {
  title: bueroaufloesungMeta.title,
  description: bueroaufloesungMeta.description,
};

export default function BueroaufloesungPage() {
  return <BueroaufloesungPageContent />;
}
