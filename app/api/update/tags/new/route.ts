import { forceFetch } from "@/app/api/fetch/function";
import { getCachedGuilds } from "@/lib/fetchGuilds";
import { generateId } from "@/lib/generateId";
import redis from "@/lib/redis";
import { getSession } from "@mikandev/next-discord-auth/server-actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return new Response(JSON.stringify({ message: "Please login" }), {
      status: 401,
    });

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ message: "Invalid JSON body" }), {
      status: 400,
    });
  }

  const { serverId, name, message } = body;

  if (
    !(await getCachedGuilds(session.user.id, session.accessToken!)).find(
      (g) => g.id === serverId
    )
  )
    return new Response(
      JSON.stringify({ message: "You can't access this server" }),
      {
        status: 401,
      }
    );

  const messages = await forceFetch(serverId, "messages");
  if (!messages.find((m: any) => m._id === message))
    return new Response(JSON.stringify({ message: "Unknown message" }), {
      status: 400,
    });

  const newTag = {
    _id: generateId("GT"),
    name: name.slice(0, 80) || "Tag",
    message,
    server: serverId,
    new: true,
  };

  const tags = await forceFetch(serverId, "tags");
  await redis.set(
    `web:tags:${serverId}`,
    JSON.stringify([newTag, ...tags]),
    "EX",
    86400
  );

  return new Response(
    JSON.stringify({ message: "Added tag, don't forget to save" }),
    {
      status: 200,
    }
  );
}
