import { getSession } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";
import { getCachedGuilds } from "@/lib/fetchGuilds";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { type Metadata } from "next";
import LanguageSelect from "./LanguageSelect";
import SaveAlert from "@/components/dashboard/saveAlert";
import { cookies } from "next/headers";
import SetCookie from "@/components/setCookie";
import ThreadedNotInServer from "@/components/NotInServer";
import ExtraAllowedChannels from "./ExtraAllowedChannels";

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

  const req = await fetch("http://localhost:10033/api/update?d=1", {
    body: JSON.stringify({ serverId: guildId }),
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    method: "POST",
  });

  if (!req.ok) return <ThreadedNotInServer serverId={guildId} />;
  const guildSettings = await req.json();
  if (!guildSettings.data.active)
    return <ThreadedNotInServer serverId={guildId} />;

  let channels: any = await fetch(
    `http://localhost:10033/api/fetchGuildChannels?g=${guildId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
    }
  );

  if (!channels.ok) return <ThreadedNotInServer serverId={guildId} />;
  channels = await channels.json();

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row">
      <SetCookie cookie={guildSettings.cookie} />
      <SaveAlert server={focusedGuild.id} />
      <DashboardSidebar selected="" server={focusedGuild} />
      <div className="p-4">
        <div>
          <p className="bg-gradient-to-br bg-clip-text from-primary to-accent text-transparent text-4xl font-bold">
            {focusedGuild.name}
          </p>
          <p className="text-sm opacity-50">ID: {guildId}</p>
        </div>
        <hr className="my-2 text-primary/20" />
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <p className="text-lg font-bold">Language</p>
              <p className="text-sm opacity-50">
                This will only effect the bot, not the website
              </p>
            </div>
            <LanguageSelect
              serverId={guildId}
              defaultValue={guildSettings.data.preferredLanguage}
            />
          </div>
          <div className="flex flex-col gap-2 max-w-xl">
            <div>
              <p className="text-lg font-bold">Extra AR Channels</p>
              <p className="text-sm opacity-50">
                Extra channels that auto-responders can respond in
              </p>
            </div>
            <ExtraAllowedChannels
              serverId={guildId}
              defaultValue={
                guildSettings.data.settings.autoResponders.extraAllowedChannels
              }
              channels={(
                channels as { id: string; name: string; type: number }[]
              ).filter((c) => [0, 5, 15].includes(c.type))}
            />
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
