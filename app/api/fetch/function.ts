import { getCachedGuilds } from "@/lib/fetchGuilds";
import redis from "@/lib/redis";
import { getSession } from "@mikandev/next-discord-auth/server-actions";
import axios from "axios";
import "@/auth";

export async function forceFetch(
  serverId: string,
  type:
    | "tags"
    | "messages"
    | "interactive"
    | "responders"
    | "responder"
    | "tag"
    | "message"
    | "trigger"
    | "triggers"
    | "group"
    | "groups"
    | "applications"
    | "application",
  _id?: string
) {
  const session = await getSession();
  if (!session) return { message: "Please login", status: 401 };

  // Check they have access to manage that server
  if (
    !(await getCachedGuilds(session.user.id, session.accessToken!)).find(
      (g) => g.id === serverId
    )
  )
    return { message: "You can't access this server", status: 401 };

  const useId = _id ? _id : serverId;
  // Get the stored data on that server
  let newGuildData = await redis.get(`web:${type}:${useId}`);
  if (!newGuildData) {
    await axios.post(
      `${process.env.API_URL}/forceCache`,
      {
        _id: useId,
        type,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );
    const d = await redis.get(`${type}:${useId}`);
    if (!d) return { message: `${type} not found`, status: 404 };
    await redis.set(`web:${type}:${useId}`, d, "EX", 86400);
    newGuildData = d;
  }

  if (!newGuildData) return { message: `${type} not found`, status: 404 };
  return JSON.parse(newGuildData);
}
