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
        className="mb-6 space-y-4 md:space-y-0 md:flex md:items-end md:gap-6"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!newTagName || !newTagMessage) return;

          setTags((prev) => [
            {
              _id: new Date().getTime(),
              name: newTagName,
              message: newTagMessage,
            },
            ...prev,
          ]);

          try {
            fetch("/api/update/tags/new", {
              body: JSON.stringify({
                serverId,
                name: newTagName,
                message: newTagMessage,
              }),
              method: "POST",
            });
            document.cookie = `hasUnsavedChanges_${serverId}=true; path=/`;
          } catch (error) {
            deleteTag(0);
          }

          setNewTagName("");
          setNewTagMessage("");
        }}
      >
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tag name
          </label>
          <TextInput
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            max={80}
            placeholder="e.g. Setup Help"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            This is the label users will see.
          </p>
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Linked message
          </label>
          <SelectInput
            onChange={setNewTagMessage}
            options={messages.map((m) => ({ label: m.name, value: m._id }))}
            required
            placeholder="Select a message"
            value={newTagMessage}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Choose which message this tag links to.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md shadow transition"
          >
            ➕ Add Tag
          </button>
        </div>
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
                onClick={() => {
                  deleteTag(i);
                  fetch("/api/update/tags/drop", {
                    body: JSON.stringify({
                      serverId: serverId,
                      tagIndex: i,
                    }),
                    method: "POST",
                  });
                  document.cookie = `hasUnsavedChanges_${serverId}=true; path=/`;
                }}
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
