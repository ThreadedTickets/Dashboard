"use client";
import SelectInput from "@/components/inputs/SelectInput";
import TextInput from "@/components/inputs/TextInput";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function TagDashboard({
  tags,
  messages,
  serverId,
}: {
  tags: any[];
  messages: any[];
  serverId: string;
}) {
  const [serverTags, setTags] = useState(tags);
  const [newTagName, setNewTagName] = useState<string>("");
  const [newTagMessage, setNewTagMessage] = useState<string>("");

  const deleteTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-4">
      <form
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault();

          if (!newTagName || !newTagMessage) return;
          setTags((prev) => [
            {
              _id: "NEED TO GET THE BACKEND SETUP FOR THIS FIRST",
              name: newTagName,
              message: newTagMessage,
            },
            ...prev,
          ]);
          setNewTagName("");
          setNewTagMessage("");
        }}
      >
        <TextInput
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          max={80}
          placeholder="Setup help"
        />

        <SelectInput
          onChange={setNewTagMessage}
          options={messages.map((m) => ({ label: m.name, value: m._id }))}
          required
          placeholder="Select a message"
          value={newTagMessage}
        />
      </form>

      <h2 className="text-2xl font-bold">
        Tags <span className="opacity-50">{serverTags.length}/25</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {serverTags.map((t, i) => {
          const linkedMessage = messages.find((m) => m._id === t.message);

          return (
            <div
              key={i}
              className="bg-primary/10 shadow rounded p-2 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <a
                  href={`/dashboard/${serverId}/messages/${linkedMessage._id}`}
                >
                  <p className="text-sm text-text hover:text-accent">
                    {linkedMessage?.name ?? "Unknown message"}
                  </p>
                </a>
              </div>

              <button
                className="mt-4 self-end text-red-500 hover:text-red-700 transition"
                onClick={() => deleteTag(i)}
                title="Delete tag"
              >
                <FaTrash />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
