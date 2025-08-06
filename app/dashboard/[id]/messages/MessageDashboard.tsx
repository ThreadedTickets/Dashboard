"use client";
import TextInput from "@/components/inputs/TextInput";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function MessageDashboard({
  messages,
  serverId,
}: {
  messages: any[];
  serverId: string;
}) {
  const [serverMessages, setMessages] = useState(messages);
  const [newMessageName, setNewMessageName] = useState("");

  const deleteMessage = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-4">
      <form
        className="flex flex-col gap-4 mb-4"
        onSubmit={async (e) => {
          e.preventDefault();

          /**
           * 1. Request new message creation from backend
           * 2. Wait for the response with its id
           * 3. Redirect the user to the new message editor
           */
        }}
      >
        <h2 className="text-2xl font-bold">
          New Message{" "}
          <span className="opacity-50">{serverMessages.length}/250</span>
        </h2>
        <div className="w-full">
          <div>
            <p className="text-lg font-bold">Name</p>
            <p className="text-sm opacity-50">
              This is the name of your message
            </p>
          </div>
          <TextInput
            value={newMessageName}
            onChange={(e) => setNewMessageName(e.target.value)}
            max={80}
            placeholder="e.g. Main Pannel Message"
            className="w-full"
          />
        </div>

        <div className="w-full md:w-auto">
          <button
            type="submit"
            className="w-full bg-primary cursor-pointer hover:bg-primary/80 text-background font-medium px-5 py-2.5 rounded-md shadow transition disabled:cursor-not-allowed disabled:opacity-50"
            disabled={serverMessages.length >= 250}
          >
            Create Message
          </button>
        </div>
      </form>

      <hr className="w-full text-primary/20" />

      <h2 className="text-2xl font-bold">
        Messages <span className="opacity-50">{serverMessages.length}/250</span>
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {serverMessages.map((t, i) => {
          return (
            <div
              key={i}
              className="bg-primary/10 shadow rounded p-2 flex justify-between"
            >
              <a
                href={`/dashboard/${serverId}/messages/${t._id}`}
                className="hover:text-accent"
              >
                <h3 className="text-lg font-semibold">{t.name}</h3>
              </a>

              <button
                className="my-auto self-end text-red-500 hover:text-red-700 transition"
                onClick={() => {
                  deleteMessage(i);
                  fetch("/api/update/messages/drop", {
                    body: JSON.stringify({
                      serverId: serverId,
                      messageIndex: i,
                    }),
                    method: "POST",
                  });
                  document.cookie = `hasUnsavedChanges_${serverId}=true; path=/`;
                }}
                title="Delete message"
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
