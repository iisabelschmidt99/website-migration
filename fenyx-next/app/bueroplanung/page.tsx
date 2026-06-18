import { redirect } from "next/navigation";

/** Legacy-URL /bueroplanung → Workspace Analytics. */
export default function BueroplanungPage() {
  redirect("/einrichtung/workspace-analytics");
}
