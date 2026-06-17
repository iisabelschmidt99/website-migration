import type { Metadata } from "next";
import BueromoebelMietenPageContent from "@/components/BueromoebelMietenPageContent";
import { bueromoebelMietenMeta } from "@/data/bueromoebel-mieten";

export const metadata: Metadata = {
  title: bueromoebelMietenMeta.title,
  description: bueromoebelMietenMeta.description,
};

export default function BueromoebelMietenPage() {
  return <BueromoebelMietenPageContent />;
}
