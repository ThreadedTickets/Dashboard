import { getSession } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";

export default async function GuildDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const guildId = params.id;

  // You can now use guildId server-side
  const guildRes = await fetch(`https://discord.com/api/guilds/${guildId}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-cache",
  });

  if (!guildRes.ok) {
    throw new Error(
      `Failed to fetch guild info: ${guildRes.status}: ${guildRes.statusText}`
    );
  }

  const guild = await guildRes.json();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Guild: {guild.name}</h1>
      <p>ID: {guild.id}</p>
      {/* Add more guild config/editor UI here */}
    </div>
  );
}
