import { auth } from "@/auth";

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new AuthError("Unauthorized", 401);
  }

  if ((session.user as any).role !== "admin") {
    throw new AuthError("Forbidden", 403);
  }

  return session;
}