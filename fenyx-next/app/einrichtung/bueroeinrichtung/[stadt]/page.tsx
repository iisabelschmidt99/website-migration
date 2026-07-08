import { permanentRedirect } from "next/navigation";

type PageProps = { params: Promise<{ stadt: string }> };

export default async function BueroeinrichtungStandortRedirect({ params }: PageProps) {
  const { stadt } = await params;
  permanentRedirect(`/bueroeinrichtung-standort/${stadt}`);
}
