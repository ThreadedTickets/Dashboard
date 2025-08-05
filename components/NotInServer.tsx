"use client";

import { useRouter } from "next/navigation";

export default function ThreadedNotInServer({
  serverId,
}: {
  serverId: string;
}) {
  const router = useRouter();
  return (
    <div className="bg-background h-screen text-text">
      <div className="flex flex-col justify-center h-full items-center gap-4">
        <div className="flex flex-col justify-center gap-4 grow">
          <div className="text-center">
            <p className="text-6xl font-bold bg-gradient-to-br from-primary to-accent text-transparent bg-clip-text">
              Threaded
            </p>
            <p className="text-2xl">Ticketing without limits</p>
            <p className="text-md">
              It doesn&apos;t look like Threaded is in this server
            </p>
          </div>
          <button
            className="text-center bg-primary px-7 py-3 rounded-2xl text-background cursor-pointer font-extrabold hover:bg-primary/80"
            onClick={() =>
              window.open(
                `https://discord.com/oauth2/authorize?client_id=1068627569760550994&guild_id=${serverId}&scope=applications.commands+bot&permissions=395942808656`,
                "_self"
              )
            }
          >
            Invite Threaded
          </button>
          <button
            className="text-center bg-secondary px-7 py-3 rounded-2xl text-text cursor-pointer font-extrabold hover:bg-secondary/80"
            onClick={() => router.push("/dashboard")}
          >
            Back to all servers
          </button>
        </div>
      </div>
    </div>
  );
}
