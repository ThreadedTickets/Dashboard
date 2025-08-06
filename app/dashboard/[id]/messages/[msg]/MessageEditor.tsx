"use client";

import { useState } from "react";
import clsx from "clsx";
import { EditorV1 } from "./EditorV1";
import TextInput from "@/components/inputs/TextInput";

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
  const [messageName, setMessageName] = useState("");

  // track last selected editor (not preview)
  const [lastEditor, setLastEditor] = useState<"editorv1" | "editorv2">(
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

  const isDirty =
    message.content.trim() !== "" ||
    message.embeds.length > 0 ||
    message.components.length > 0;

  const handleTabChange = (next: typeof view) => {
    // Determine if switching between editors
    const isSwitchingBetweenEditors =
      (lastEditor === "editorv1" && next === "editorv2") ||
      (lastEditor === "editorv2" && next === "editorv1");

    if (isSwitchingBetweenEditors && isDirty) {
      const confirmed = confirm(
        "Switching editors will clear the current message. Are you sure?"
      );
      if (!confirmed) return;

      // Clear message and reset flags
      setMessage({
        flags: next === "editorv2" ? 1 << 31 : 0,
        content: "",
        embeds: [],
        components: [],
      });
    }

    // If going to an editor, update lastEditor
    if (next === "editorv1" || next === "editorv2") {
      setLastEditor(next);
    }

    setView(next);
  };

  return (
    <div>
      <div className="p-2 px-4">
        <p className="text-lg font-bold">Message Name</p>
        <TextInput
          onChange={(v) => setMessageName(v.target.value)}
          value={messageName}
        />
      </div>

      <nav className="flex w-full justify-around border-b border-primary/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
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
        {view === "editorv1" && (
          <EditorV1 message={message} setMessage={setMessage} />
        )}
        {view === "editorv2" && <p>Editor V2 UI here</p>}
        {view === "preview" && <p>Preview UI here</p>}
      </div>
    </div>
  );
}
