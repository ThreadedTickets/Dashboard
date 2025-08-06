"use client";

import { useState } from "react";
import clsx from "clsx";
import { EditorV1 } from "./EditorV1";

export default function MessageEditor({
  serverId,
  messageId,
}: {
  serverId: string;
  messageId: string;
}) {
  const [view, setView] = useState<"editorv1" | "editorv2" | "preview">(
    "editorv1"
  );
  const [message, setMessage] = useState<{
    flags: number;
    content: string;
    embeds: any[];
    components: any[];
  }>({
    flags: 0,
    content: "Welcome to the Threaded message editor!",
    embeds: [],
    components: [],
  });

  const tabs: { id: typeof view; label: string }[] = [
    { id: "editorv1", label: "Editor V1" },
    { id: "editorv2", label: "Editor V2" },
    { id: "preview", label: "Preview" },
  ];

  return (
    <div>
      <nav className="flex w-full justify-around border-b border-primary/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={clsx(
              "flex-1 py-3 text-center transition-colors duration-200 cursor-pointer",
              view === tab.id
                ? "border-b-4 border-accent font-semibold text-accent"
                : "text-text hover:text-accent/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-4">
        {/* Render actual editor based on selected view */}
        {view === "editorv1" && (
          <EditorV1 message={message} setMessage={setMessage} />
        )}
        {view === "editorv2" && <p>Editor V2 UI here</p>}
        {view === "preview" && <p>Preview UI here</p>}
      </div>
    </div>
  );
}
