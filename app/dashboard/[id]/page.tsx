import { getSession } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";
import { getCachedGuilds } from "@/lib/fetchGuilds";
import DashboardSidebar from "@/components/dashboard/sidebar";
// app/dashboard/[id]/page.tsx
import { type Metadata } from "next";
import LanguageSelect from "./LanguageSelect";

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

  return (
    <div className="max-w-4xl mx-auto p-6 flex">
      <DashboardSidebar selected="" server={focusedGuild} />
      <div className="p-4">
        <div>
          <p className="bg-gradient-to-br bg-clip-text from-primary to-accent text-transparent text-4xl font-bold">
            {focusedGuild.name}
          </p>
          <p className="text-sm opacity-50">ID: {guildId}</p>
        </div>
        <div>
          <LanguageSelect serverId={guildId} />
        </div>
      </div>
    </div>
  );
}
