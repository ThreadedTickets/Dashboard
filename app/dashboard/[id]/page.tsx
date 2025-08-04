import { getSession } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";
import { getCachedGuilds } from "@/lib/fetchGuilds";

export default async function GuildDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    return <div>you are logged out</div>;
  }

  const guildId = (await params).id;
  const guilds = await getCachedGuilds(session.user.id, session.accessToken!);
  const focusedGuild = guilds.find((g) => g.id === guildId);

  if (!focusedGuild) return <div>you cant access this</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Guild: {focusedGuild.name}</h1>
      <p>ID: {guildId}</p>
      {/* Add more guild config/editor UI here */}
    </div>
  );
}
