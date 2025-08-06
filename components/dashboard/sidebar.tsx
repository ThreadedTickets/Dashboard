"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { id: "", label: "Overview" },
  { id: "triggers", label: "Triggers" },
  { id: "messages", label: "Messages" },
  { id: "groups", label: "Groups" },
  { id: "applications", label: "Applications" },
  { id: "tags", label: "Tags" },
  { id: "responders", label: "Auto Responders" },
];

export default function DashboardSidebar({
  selected,
  server,
}: {
  selected: string;
  server: { id: string; name: string };
}) {
  const [open, setOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  return (
    <aside className="md:w-64 w-full text-text md:relative z-10">
      {showLoading && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
            <p className="text-text text-sm">Loading...</p>
          </div>
        </div>
      )}

      {/* Mobile toggle */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-accent">
        <span className="text-lg font-bold">Threaded</span>
        <button
          onClick={() => setOpen(!open)}
          className="text-accent"
          aria-label="Toggle Sidebar"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar content */}
      <div
        className={`flex flex-col gap-2 p-4 md:block ${
          open ? "block" : "hidden md:block"
        }`}
      >
        <Link
          href={`/dashboard`}
          onClick={() => setShowLoading(true)}
          className={`block px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-accent/30`}
        >
          All Servers
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/${server.id}/${item.id}`}
            onClick={() => setShowLoading(true)}
            className={`block px-4 py-2 rounded text-sm font-medium transition-colors ${
              selected === item.id
                ? "bg-primary text-background"
                : "hover:bg-accent/30"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
