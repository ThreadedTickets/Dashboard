import { signOut } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="text-center bg-secondary px-7 py-3 rounded-2xl text-text cursor-pointer font-extrabold hover:bg-secondary/80"
      >
        Logout
      </button>
    </form>
  );
}
