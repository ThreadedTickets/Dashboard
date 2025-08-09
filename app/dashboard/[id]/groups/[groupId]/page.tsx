import { getSession } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";
import { getCachedGuilds } from "@/lib/fetchGuilds";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { type Metadata } from "next";
import SetCookie from "@/components/setCookie";
import ThreadedNotInServer from "@/components/NotInServer";
import { fetchGuildSettings } from "@/lib/FetchGuildSettings";
import { forceFetch } from "@/app/api/fetch/function";
import Button from "@/components/Button";
import { cookies } from "next/headers";
import GroupEditor from "./Editor";

interface PageProps {
  params: Promise<{ id: string; groupId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const session = await getSession();
  if (!session)
    return {
      title: `Please login`,
    };

  const guildId = (await params).id;
  const guilds = await getCachedGuilds(session.user.id, session.accessToken!);
  const focusedGuild = guilds.find((g) => g.id === guildId);
  return {
    title: `${
      focusedGuild ? focusedGuild.name : "Unknown"
    } | Groups - Editing | Threaded Dashboard`,
  };
}

export default async function GuildDashboardPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    return <div>You are not logged in</div>;
  }

  const { id: guildId, groupId } = await params;
  const guilds = await getCachedGuilds(session.user.id, session.accessToken!);
  const focusedGuild = guilds.find((g) => g.id === guildId);

  if (!focusedGuild) {
    return <div>you cant see this</div>;
  }

  const guildSettings = await fetchGuildSettings(guildId, true);
  if (!("data" in guildSettings) || !guildSettings.data!.active)
    return <ThreadedNotInServer serverId={guildId} />;

  const [groups] = await Promise.all([forceFetch(guildId, "groups")]);

  if (!groups) return <ThreadedNotInServer serverId={guildId} />;

  const group = await forceFetch(guildId, "group", groupId);

  let roles = await fetch(
    `http://localhost:10033/api/fetchGuildRoles?g=${guildId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
    }
  );

  if (!roles.ok) return <ThreadedNotInServer serverId={guildId} />;
  roles = await roles.json();

  return (
    <div className="max-w-8xl mx-auto p-6 grid md:grid-cols-[1fr_5fr] grid-cols-1">
      <SetCookie cookie={guildSettings.cookie} />
      <DashboardSidebar selected="groups" server={focusedGuild} />
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <p className="bg-gradient-to-br bg-clip-text from-primary to-accent text-transparent text-4xl font-bold">
              {focusedGuild.name}
            </p>
            <p className="text-sm opacity-50">ID: {guildId}</p>
          </div>
          <a className="my-auto" href={`/dashboard/${guildId}/groups`}>
            <Button text="Back to all groups (save)" />
          </a>
        </div>
        <hr className="my-2 text-primary/20" />

        <GroupEditor roles={roles as any} value={group} serverId={guildId} />
      </div>
    </div>
  );
}
