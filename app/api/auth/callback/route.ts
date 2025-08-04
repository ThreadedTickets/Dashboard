import { handleRedirect } from "@mikandev/next-discord-auth/redirect";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

import "@/auth";

export const GET = async (request: NextRequest) => {
  await handleRedirect(request);
  redirect("/");
};
