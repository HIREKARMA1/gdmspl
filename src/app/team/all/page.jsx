import { redirect } from "next/navigation";

export const metadata = {
  title: "Meet our core team | GDMSPL",
  description: "Meet our full team of architects and design professionals.",
};

/** Legacy path — full roster now lives at /team. */
export default function FullTeamPage() {
  redirect("/team");
}
