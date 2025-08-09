import { forceFetch } from "@/app/api/fetch/function";
import { getCachedGuilds } from "@/lib/fetchGuilds";
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

  const { serverId, tagIndex } = body;

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

  const tags: any[] = await forceFetch(serverId, "applications");
  await redis.set(
    `web:applications:${serverId}`,
    JSON.stringify(tags.filter((_: any, i: number) => i !== tagIndex)),
    "EX",
    86400
  );

  return new Response(
    JSON.stringify({ message: "Removed application, don't forget to save" }),
    {
      status: 200,
    }
  );
}
