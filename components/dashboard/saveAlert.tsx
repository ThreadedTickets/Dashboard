"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SaveAlert({ server }: { server: string }) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const cookies = document.cookie.split("; ").reduce((acc, c) => {
        const [key, value] = c.split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const key = `hasUnsavedChanges_${server}`;
      setShow(cookies[key] === "true");
    }, 1000); // check every 1 second

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  if (!show) return null;

  return (
    <div className="bg-accent/30 fixed z-50 top-4 right-4 rounded p-4 flex flex-col gap-2">
      <p className="text-lg font-semibold">Remember to save your changes!</p>
      <div className="flex gap-2">
        <button
          className="text-center grow bg-primary px-7 py-3 rounded-2xl text-background cursor-pointer font-extrabold hover:bg-primary/80"
          onClick={async () => {
            // Example save logic
            await fetch(`/api/save?server=${server}`);
            document.cookie = `hasUnsavedChanges_${server}=false; path=/`;
            setShow(false);
          }}
        >
          Save
        </button>
        <button
          className="text-center bg-secondary px-7 py-3 rounded-2xl text-text cursor-pointer font-extrabold hover:bg-secondary/80"
          onClick={async () => {
            document.cookie = `hasUnsavedChanges_${server}=false; path=/`;
            setShow(false);
            await fetch(`/api/cancelChanges?server=${server}`);

            router.refresh();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
