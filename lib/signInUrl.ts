export function signInUrl(currentUrl: string) {
  const discordOAuthUrl = new URL("https://discord.com/oauth2/authorize");
  discordOAuthUrl.searchParams.set("client_id", process.env.AUTH_DISCORD_ID!);
  discordOAuthUrl.searchParams.set(
    "redirect_uri",
    process.env.DISCORD_REDIRECT_URI!
  );
  discordOAuthUrl.searchParams.set("response_type", "code");
  discordOAuthUrl.searchParams.set("scope", "identify guilds"); // adjust scope

  // Optional: preserve where the user was going
  discordOAuthUrl.searchParams.set("state", currentUrl);

  return discordOAuthUrl.toString();
}
