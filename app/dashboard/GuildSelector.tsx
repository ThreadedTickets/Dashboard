"use client";

import { useRouter } from "next/navigation";
import hasManageOrAdmin from "@/lib/checkHasGuildPermission";

type Guild = {
  id: string;
  name: string;
  owner: boolean;
  permissions: number;
  icon: string | null;
};

export default function GuildSelector({ guilds }: { guilds: Guild[] }) {
  const router = useRouter();

  if (!guilds.length) {
    return (
      <p className="text-red-500 text-center mt-4">
        No manageable servers found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {guilds.map((guild) => {
        const hasIcon = guild.icon !== null;
        const iconUrl = hasIcon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null;

        return (
          <div
            key={guild.id}
            onClick={() => router.push(`/dashboard/${guild.id}`)}
            className="cursor-pointer relative group border border-background hover:border-accent rounded-xl overflow-hidden bg-background shadow hover:shadow-lg transition"
            style={{
              backgroundImage: hasIcon ? `url(${iconUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition" />

            <div className="relative z-10 p-4 text-text">
              <h2 className="text-xl font-bold truncate">{guild.name}</h2>
              <p className="text-sm opacity-80">
                Owner: {guild.owner ? "Yes" : "No"}
              </p>
              <p className="text-sm opacity-80">
                Admin: {hasManageOrAdmin(guild.permissions) ? "Yes" : "No"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
