import { getSession } from "@mikandev/next-discord-auth/server-actions";
import hasManageOrAdmin from "@/lib/checkHasGuildPermission";
import "@/auth";
import GuildSelector from "./GuildSelector";
import { Metadata } from "next";
import SignOut from "@/components/logout";

export const metadata: Metadata = {
  title: "Select a server | Threaded Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    return <div>401</div>;
  }

  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "reload",
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
      <div className="flex justify-between my-auto">
        <div>
          <h1 className="text-3xl font-bold">
            Hello,{" "}
            <span className="bg-gradient-to-br bg-clip-text from-primary to-accent text-transparent">
              {session.user.name}
            </span>
            !
          </h1>
          <p className="mb-4 text-xl font-semibold">
            Select a server to manage
          </p>
        </div>
        <SignOut />
      </div>
      <GuildSelector guilds={manageableGuilds} />
    </div>
  );
}
