"use client";
import { Metadata } from "next";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-background h-screen text-text">
      <div className="flex flex-col justify-center h-full items-center gap-4">
        <div className="flex flex-col justify-center gap-4 grow">
          <div className="text-center">
            <p className="text-6xl font-bold bg-gradient-to-br from-primary to-accent text-transparent bg-clip-text">
              Threaded
            </p>
            <p className="text-2xl">Ticketing without limits</p>
          </div>
          <div className="flex flex-col gap-4 w-fit justify-center">
            <button
              className="text-center bg-primary px-7 py-3 rounded-2xl text-background cursor-pointer font-extrabold hover:bg-primary/80"
              onClick={() =>
                window.open(
                  "https://discord.com/oauth2/authorize?client_id=1068627569760550994",
                  "_blank"
                )
              }
            >
              Invite Threaded
            </button>
            <div className="flex gap-4">
              <button
                className="text-center bg-secondary px-7 py-3 rounded-2xl text-text cursor-pointer font-extrabold hover:bg-secondary/80"
                onClick={() =>
                  window.open("https://discord.gg/9jFqS5H43Q", "_blank")
                }
              >
                Support
              </button>
              <button
                className="text-center bg-secondary px-7 py-3 rounded-2xl text-text cursor-pointer font-extrabold hover:bg-secondary/80"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-text/50">
          <a href="/terms" className="hover:text-accent">
            <p>Terms</p>
          </a>
          <a href="/status" className="hover:text-accent">
            <p>Status</p>
          </a>
          <a href="/privacy" className="hover:text-accent">
            <p>Privacy</p>
          </a>
        </div>
      </div>
    </div>
  );
}
