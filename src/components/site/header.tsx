import { getCurrentUser } from "@/lib/auth";
import { HeaderClient } from "./header-client";

export async function Header() {
  const user = await getCurrentUser();
  return (
    <HeaderClient
      user={
        user
          ? {
              username: user.username,
              avatar_url: user.avatar_url,
              role: user.role,
              points: user.points,
            }
          : null
      }
    />
  );
}
