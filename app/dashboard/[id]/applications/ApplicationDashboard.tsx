"use client";
import TextInput from "@/components/inputs/TextInput";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function ApplicationDashboard({
  applications,
  serverId,
}: {
  applications: any[];
  serverId: string;
}) {
  const [serverApplications, setApplications] = useState(applications);

  const deleteApplication = (index: number) => {
    setApplications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-4">
      <form
        className="flex flex-col gap-4 mb-4"
        onSubmit={async (e) => {
          e.preventDefault();

          /**
           * 1. Request new application creation from backend
           * 2. Wait for the response with its id
           * 3. Redirect the user to the new application editor
           */
        }}
      >
        <h2 className="text-2xl font-bold">New Application</h2>

        <div className="w-full md:w-auto">
          <button
            type="submit"
            className="w-full bg-primary cursor-pointer hover:bg-primary/80 text-background font-medium px-5 py-2.5 rounded-md shadow transition disabled:cursor-not-allowed disabled:opacity-10"
            disabled={serverApplications.length >= 10}
          >
            Create Application
          </button>
        </div>
      </form>

      <hr className="w-full text-primary/20" />

      <h2 className="text-2xl font-bold">
        Applications{" "}
        <span className="opacity-50">{serverApplications.length}/10</span>
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {serverApplications.map((t, i) => {
          return (
            <div
              key={i}
              className="bg-primary/10 shadow rounded p-2 flex justify-between"
            >
              <a
                href={`/dashboard/${serverId}/applications/${t._id}`}
                className="hover:text-accent"
              >
                <h3 className="text-lg font-semibold">{t.name}</h3>
              </a>

              <button
                className="my-auto self-end text-red-100 hover:text-red-700 transition"
                onClick={() => {
                  deleteApplication(i);
                  fetch("/api/update/applications/drop", {
                    body: JSON.stringify({
                      serverId: serverId,
                      applicationIndex: i,
                    }),
                    method: "POST",
                  });
                  document.cookie = `hasUnsavedChanges_${serverId}=true; path=/`;
                }}
                title="Delete application"
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
