import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/models/User";
import { AuthError } from "./requireAdmin";

/**
 * Ensures the incoming request is from an authenticated user.
 * Returns the full MongoDB user document so callers have access to `_id`.
 *
 * @throws {AuthError} 401 – if no session exists
 * @throws {AuthError} 404 – if the session email has no matching DB user
 */
export async function requireUser() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new AuthError("Unauthorized", 401);
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email }).lean();

  if (!user) {
    throw new AuthError("User not found", 404);
  }

  return user;
}
