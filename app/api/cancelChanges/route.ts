import { getCachedGuilds } from "@/lib/fetchGuilds";
import redis from "@/lib/redis";
import { getSession } from "@mikandev/next-discord-auth/server-actions";
import { NextRequest } from "next/server";
import "@/auth";

// Update route. this only works for the server settings and logging and the respective update routes should be used to deal with other bits
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return new Response(JSON.stringify({ message: "Please login" }), {
      status: 401,
    });

  const server = req.nextUrl.searchParams.get("server");

  // Check they have access to manage that server
  if (
    !(await getCachedGuilds(session.user.id, session.accessToken!)).find(
      (g) => g.id === server
    )
  )
    return new Response(
      JSON.stringify({ message: "You can't access this server" }),
      {
        status: 401,
      }
    );

  redis.del(`web:guilds:${server}`);
  redis.del(`web:groups:${server}`);
  redis.del(`web:tags:${server}`);
  redis.del(`web:messages:${server}`);
  redis.del(`web:triggers:${server}`);
  redis.del(`web:applications:${server}`);

  return new Response(
    JSON.stringify({
      message: "ok",
    }),
    {
      status: 200,
    }
  );
}
