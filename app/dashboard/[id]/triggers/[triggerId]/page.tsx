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

interface PageProps {
  params: Promise<{ id: string; triggerId: string }>;
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
    } | Triggers - Editing | Threaded Dashboard`,
  };
}

export default async function GuildDashboardPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    return <div>You are not logged in</div>;
  }

  const { id: guildId, triggerId } = await params;
  const guilds = await getCachedGuilds(session.user.id, session.accessToken!);
  const focusedGuild = guilds.find((g) => g.id === guildId);

  if (!focusedGuild) {
    return <div>you cant see this</div>;
  }

  const guildSettings = await fetchGuildSettings(guildId, true);
  if (!("data" in guildSettings) || !guildSettings.data!.active)
    return <ThreadedNotInServer serverId={guildId} />;

  const [triggers] = await Promise.all([forceFetch(guildId, "triggers")]);

  if (!triggers) return <ThreadedNotInServer serverId={guildId} />;

  const trigger = triggers.find((m: any) => m._id === triggerId);
  if (!trigger) return <ThreadedNotInServer serverId={guildId} />;

  return (
    <div className="max-w-8xl mx-auto p-6 grid md:grid-cols-[1fr_5fr] grid-cols-1">
      <SetCookie cookie={guildSettings.cookie} />
      <DashboardSidebar selected="triggers" server={focusedGuild} />
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <p className="bg-gradient-to-br bg-clip-text from-primary to-accent text-transparent text-4xl font-bold">
              {focusedGuild.name}
            </p>
            <p className="text-sm opacity-50">ID: {guildId}</p>
          </div>
          <a className="my-auto" href={`/dashboard/${guildId}/triggers`}>
            <Button text="Back to all triggers (save)" />
          </a>
        </div>
      </div>
    </div>
  );
}
