"use client";
import TextInput from "@/components/inputs/TextInput";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function TriggerDashboard({
  triggers,
  serverId,
}: {
  triggers: any[];
  serverId: string;
}) {
  const [serverTriggers, setTriggers] = useState(triggers);

  const deleteTrigger = (index: number) => {
    setTriggers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-4">
      <form
        className="flex flex-col gap-4 mb-4"
        onSubmit={async (e) => {
          e.preventDefault();

          /**
           * 1. Request new trigger creation from backend
           * 2. Wait for the response with its id
           * 3. Redirect the user to the new trigger editor
           */
        }}
      >
        <h2 className="text-2xl font-bold">New Trigger</h2>

        <div className="w-full md:w-auto">
          <button
            type="submit"
            className="w-full bg-primary cursor-pointer hover:bg-primary/80 text-background font-medium px-5 py-2.5 rounded-md shadow transition disabled:cursor-not-allowed disabled:opacity-50"
            disabled={serverTriggers.length >= 50}
          >
            Create Trigger
          </button>
        </div>
      </form>

      <hr className="w-full text-primary/20" />

      <h2 className="text-2xl font-bold">
        Triggers <span className="opacity-50">{serverTriggers.length}/50</span>
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {serverTriggers.map((t, i) => {
          return (
            <div
              key={i}
              className="bg-primary/10 shadow rounded p-2 flex justify-between"
            >
              <a
                href={`/dashboard/${serverId}/triggers/${t._id}`}
                className="hover:text-accent"
              >
                <h3 className="text-lg font-semibold">{t.name}</h3>
              </a>

              <button
                className="my-auto self-end text-red-500 hover:text-red-700 transition"
                onClick={() => {
                  deleteTrigger(i);
                  fetch("/api/update/triggers/drop", {
                    body: JSON.stringify({
                      serverId: serverId,
                      triggerIndex: i,
                    }),
                    method: "POST",
                  });
                  document.cookie = `hasUnsavedChanges_${serverId}=true; path=/`;
                }}
                title="Delete trigger"
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
