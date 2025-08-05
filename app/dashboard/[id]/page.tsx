import { getSession } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";
import { getCachedGuilds } from "@/lib/fetchGuilds";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { type Metadata } from "next";
import LanguageSelect from "./LanguageSelect";
import SaveAlert from "@/components/dashboard/saveAlert";
import { cookies } from "next/headers";
import SetCookie from "@/components/setCookie";

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

  if (!req.ok) return <div>threaded isnt in this server</div>;
  const guildSettings = await req.json();

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
        <div>
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
        </div>
      </div>
    </div>
  );
}
