"use client";

import { useState } from "react";
import hasManageOrAdmin from "@/lib/checkHasGuildPermission";

type Guild = {
  id: string;
  name: string;
  owner: boolean;
  permissions: number;
};

export default function GuildSelector({ guilds }: { guilds: Guild[] }) {
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);

  if (guilds.length === 0) {
    return <p className="text-red-500">No manageable servers found.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guilds.map((guild) => {
          const isSelected = guild.id === selectedGuildId;
          return (
            <li
              key={guild.id}
              className={`cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition ${
                isSelected ? "border-blue-500 bg-blue-50 shadow-lg" : ""
              }`}
              onClick={() => setSelectedGuildId(guild.id)}
            >
              <h2 className="text-xl font-semibold">{guild.name}</h2>
              <p className="text-sm text-gray-600">
                Owner: {guild.owner ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-600">
                Admin: {hasManageOrAdmin(guild.permissions) ? "Yes" : "No"}
              </p>
            </li>
          );
        })}
      </ul>

      {selectedGuildId && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-bold mb-2">Selected Server</h3>
          <p>Guild ID: {selectedGuildId}</p>
          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              // Replace with real navigation
              alert(`Managing guild ${selectedGuildId}`);
            }}
          >
            Manage Server
          </button>
        </div>
      )}
    </>
  );
}
