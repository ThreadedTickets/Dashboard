import { getCachedGuilds } from "@/lib/fetchGuilds";
import redis from "@/lib/redis";
import { getSession } from "@mikandev/next-discord-auth/server-actions";
import { NextRequest } from "next/server";
import "@/auth";

export async function GET(req: NextRequest) {
  const guildId = req.nextUrl.searchParams.get("g");
  const ignoreCache = req.nextUrl.searchParams.get("ic") === "1";
  const session = await getSession();

  if (!session) {
    return new Response(JSON.stringify({ message: "Please login" }), {
      status: 401,
    });
  }

  const guilds = await getCachedGuilds(session.user.id, session.accessToken!);
  const canAccess = guilds.some((g) => g.id === guildId);
  if (!canAccess) {
    return new Response(
      JSON.stringify({ message: "You can't access this server" }),
      { status: 401 }
    );
  }

  const cacheKey = `web:roles:${guildId}`;

  if (!ignoreCache) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/roles`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return new Response(JSON.stringify({ message: "Failed to fetch roles" }), {
      status: response.status,
    });
  }

  const rawRoles = await response.json();

  const simplifiedRoles = rawRoles.map(
    (element: { id: string; name: string; type: string }) => ({
      id: element.id,
      name: element.name,
      type: element.type,
    })
  );

  const json = JSON.stringify(simplifiedRoles);

  await redis.set(cacheKey, json, "EX", 300); // Cache for 5 minutes

  return new Response(json, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
