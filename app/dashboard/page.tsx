import { getSession } from "@mikandev/next-discord-auth/server-actions";
import hasManageOrAdmin from "@/lib/checkHasGuildPermission";
import "@/auth";
import GuildSelector from "./GuildSelector";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch guilds: ${res.status}`);
  }

  const allGuilds = await res.json();

  const manageableGuilds = allGuilds.filter(
    (g: { owner: boolean; permissions: number }) =>
      g.owner || hasManageOrAdmin(g.permissions)
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {session.user.name}!</h1>
      <GuildSelector guilds={manageableGuilds} />
    </div>
  );
}
