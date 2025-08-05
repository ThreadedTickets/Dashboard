// lib/fetchGuilds.ts
import hasManageOrAdmin from "./checkHasGuildPermission";
import redis from "./redis";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  permissions: number;
  owner: boolean;
};

const GUILD_CACHE_TTL = 5 * 60; // 5 minutes

export async function getCachedGuilds(
  userId: string,
  accessToken: string
): Promise<Guild[]> {
  const cacheKey = `web:users:${userId}`;

  // Check Redis first
  const cached = await redis.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback to fetch
    }
  }

  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch guilds from Discord: ${res.status}: ${res.statusText}`
    );
  }

  const guilds = ((await res.json()) as Guild[]).filter(
    (g) => g.owner || hasManageOrAdmin(g.permissions)
  );

  await redis.set(cacheKey, JSON.stringify(guilds), "EX", GUILD_CACHE_TTL);

  return guilds;
}
