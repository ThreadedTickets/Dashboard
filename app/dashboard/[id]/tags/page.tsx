import { getSession } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";
import { getCachedGuilds } from "@/lib/fetchGuilds";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { type Metadata } from "next";
import SaveAlert from "@/components/dashboard/saveAlert";
import SetCookie from "@/components/setCookie";
import ThreadedNotInServer from "@/components/NotInServer";
import { fetchGuildSettings } from "@/lib/FetchGuildSettings";
import { forceFetch } from "@/app/api/fetch/function";
import TagDashboard from "./TagDashboard";

interface PageProps {
  params: Promise<{ id: string }>;
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
    } | Threaded Dashboard`,
  };
}

export default async function GuildDashboardPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    return <div>You are not logged in</div>;
  }

  const guildId = (await params).id;
  const guilds = await getCachedGuilds(session.user.id, session.accessToken!);
  const focusedGuild = guilds.find((g) => g.id === guildId);

  if (!focusedGuild) {
    return <div>you cant see this</div>;
  }

  const guildSettings = await fetchGuildSettings(guildId, true);
  if (!("data" in guildSettings) || !guildSettings.data!.active)
    return <ThreadedNotInServer serverId={guildId} />;

  const [tags, messages] = await Promise.all([
    forceFetch(guildId, "tags"),
    forceFetch(guildId, "messages"),
  ]);

  if (!tags || !messages) return <ThreadedNotInServer serverId={guildId} />;

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-[1fr_5fr] grid-cols-1">
      <SetCookie cookie={guildSettings.cookie} />
      <SaveAlert server={focusedGuild.id} />
      <DashboardSidebar selected="tags" server={focusedGuild} />
      <div className="p-4">
        <div>
          <p className="bg-gradient-to-br bg-clip-text from-primary to-accent text-transparent text-4xl font-bold">
            {focusedGuild.name}
          </p>
          <p className="text-sm opacity-50">ID: {guildId}</p>
        </div>
        <hr className="my-2 text-primary/20" />
        <TagDashboard tags={tags} messages={messages} serverId={guildId} />
      </div>
    </div>
  );
}
