import { connectDB } from "@/lib/db/mongoose";
import { AuthError, requireAdmin } from "@/lib/auth/requireAdmin";
import { getDashboardStats } from "@/services/dashboard.service";

import {
  successResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const stats = await getDashboardStats();

    return successResponse(
      stats,
      "Dashboard stats fetched successfully."
    );
  } catch (error) {
    console.error(error);

    if (error instanceof AuthError) {
      return errorResponse(error.message, error.status);
    }

    return errorResponse("Internal Server Error");
  }
}