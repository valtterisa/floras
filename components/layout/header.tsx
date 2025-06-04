import { createClient } from "@/lib/supabase/server";
import Navbar from "./navbar";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Only pass serializable user info (not the whole user object)
  const safeUser = user
    ? {
        name: user.user_metadata?.name || user.email || "User",
        email: user.email,
        avatar: user.user_metadata?.avatar_url || undefined,
      }
    : null;
  return <Navbar user={safeUser} />;
}
