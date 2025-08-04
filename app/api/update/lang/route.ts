import { NextRequest } from "next/server";

// api/update/lang?id=
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const lang = req.nextUrl.searchParams.get("lang");

  if (!id || !lang) {
    return new Response(JSON.stringify({ message: "Missing ID or lang" }), {
      status: 400,
    });
  }

  const API_URL = process.env.API_URL;
  const API_TOKEN = process.env.API_TOKEN;

  if (!API_URL || !API_TOKEN) {
    return new Response(JSON.stringify({ message: "Missing env variables" }), {
      status: 500,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ message: "Invalid JSON body" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(`${API_URL}/create/message/save?id=${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    return new Response(JSON.stringify(json), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch API", error }),
      { status: 500 }
    );
  }
}
