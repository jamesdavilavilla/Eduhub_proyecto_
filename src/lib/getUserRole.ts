import { auth } from "@clerk/nextjs/server";

export async function getUserRole(): Promise<string | null> {
  const { sessionClaims } = await auth();
  return (sessionClaims?.metadata as { role?: string })?.role ?? null;
}
