import { setup } from "@mikandev/next-discord-auth";

await setup({
  clientId: process.env.AUTH_DISCORD_ID as string,
  clientSecret: process.env.AUTH_DISCORD_SECRET as string,
  redirectUri: process.env.DISCORD_REDIRECT_URI as string,
  scopes: ["identify", "guilds"],
  jwtSecret: process.env.AUTH_SECRET as string,
});
