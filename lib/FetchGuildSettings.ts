import { getCachedGuilds } from "@/lib/fetchGuilds";
import redis from "@/lib/redis";
import { getSession } from "@mikandev/next-discord-auth/server-actions";
import axios from "axios";
import "@/auth";

// Update route. this only works for the server settings and logging and the respective update routes should be used to deal with other bits
export async function fetchGuildSettings(
  serverId: string,
  includeData?: boolean
) {
  let needsCookie = false;
  const session = await getSession();
  if (!session)
    return {
      message: "Please login",
      status: 401,
    };

  // Check they have access to manage that server
  if (
    !(await getCachedGuilds(session.user.id, session.accessToken!)).find(
      (g) => g.id === serverId
    )
  )
    return {
      message: "You can't access this server",
      status: 401,
    };

  // Get the stored data on that server
  let newGuildData = await redis.get(`web:guilds:${serverId}`);
  if (newGuildData) needsCookie = true;
  if (!newGuildData) {
    try {
      await axios.post(
        `${process.env.API_URL}/forceCache`,
        {
          _id: serverId,
          type: "server",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_TOKEN}`,
          },
        }
      );
    } catch (error) {
      return {
        message: "Server not found",
        status: 404,
      };
    }
    const d = await redis.get(`guilds:${serverId}`);
    if (!d)
      return {
        message: "Server not found",
        status: 404,
      };
    if (!includeData) await redis.set(`web:guilds:${serverId}`, d, "EX", 86400);
    newGuildData = d;
  }

  if (!newGuildData)
    return {
      message: "Server not found",
      status: 404,
    };

  // Cookie checking
  const [tags, groups, messages, applications, responders, triggers] =
    await Promise.all([
      redis.get(`web:tags:${serverId}`),
      redis.get(`web:groups:${serverId}`),
      redis.get(`web:messages:${serverId}`),
      redis.get(`web:applications:${serverId}`),
      redis.get(`web:responders:${serverId}`),
      redis.get(`web:triggers:${serverId}`),
    ]);

  if (tags || groups || messages || applications || responders || triggers)
    needsCookie = true;

  return {
    message: "Update recorded. Don't forget to save",
    cookie: `hasUnsavedChanges_${serverId}=${needsCookie}; path=/`,
    ...(includeData ? { data: JSON.parse(newGuildData) } : {}),
    status: 200,
  };
}
