import { signIn, signOut } from "@mikandev/next-discord-auth/server-actions";
import "@/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit">Signin with Discord</button>
    </form>
  );
}
