import { getCachedGuilds } from "@/lib/fetchGuilds";
import redis from "@/lib/redis";
import { getSession } from "@mikandev/next-discord-auth/server-actions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import "@/auth";

// Update route. this only works for the server settings and logging and the respective update routes should be used to deal with other bits
export async function POST(req: NextRequest, res: NextResponse) {
  const includeData = req.nextUrl.searchParams.get("d");
  let needsCookie = false;
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

  const { serverId, path, value } = body;

  // Check they have access to manage that server
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

  // Get the stored data on that server
  let newGuildData = await redis.get(`web:guilds:${serverId}`);
  if (newGuildData) needsCookie = true;
  if (!newGuildData) {
    console.debug("No new guild data found");
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
    const d = await redis.get(`guilds:${serverId}`);
    if (!d)
      return new Response(JSON.stringify({ message: "Server not found" }), {
        status: 404,
      });
    if (!includeData) await redis.set(`web:guilds:${serverId}`, d, "EX", 86400);
    newGuildData = d;
  }

  if (!newGuildData)
    return new Response(JSON.stringify({ message: "Server not found" }), {
      status: 404,
    });

  // I now know that this is the data to be edited
  newGuildData = JSON.parse(newGuildData);

  // It doesn't overly matter what people set as their values, it will all get validated later

  if (!includeData) {
    switch (path.split(".")[0]) {
      case "preferredLanguage":
        (newGuildData as any).preferredLanguage = value;
        needsCookie = true;
        break;
      case "settings":
        switch (path.split(".")[1]) {
          case "autoResponders":
            (newGuildData as any).settings.autoResponders.extraAllowedChannels =
              value;
            needsCookie = true;
            break;
          default:
            return new Response(
              JSON.stringify({ message: "Disallowed update path" }),
              {
                status: 400,
              }
            );
            break;
        }
        break;
      default:
        // no path, just getting data
        break;
    }
    await redis.set(
      `web:guilds:${serverId}`,
      JSON.stringify(newGuildData),
      "EX",
      86400
    );
  }
  return new Response(
    JSON.stringify({
      message: "Update recorded. Don't forget to save",
      cookie: `hasUnsavedChanges_${serverId}=${needsCookie}; path=/`,
      ...(includeData ? { data: newGuildData } : {}),
    }),
    {
      status: 200,
      headers: {
        "Set-Cookie": `hasUnsavedChanges_${serverId}=${needsCookie}; path=/`,
      },
    }
  );
}
