import { connectDB } from "@/lib/db/mongoose";
import Bookmark from "@/models/Bookmark";
import { requireUser } from "@/lib/auth/requireUser";
import { AuthError } from "@/lib/auth/requireAdmin";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await requireUser();
    const resolvedParams = await params;

    const bookmark = await Bookmark.findOneAndDelete({
      _id: resolvedParams.id,
      userId: user._id,
    });

    if (!bookmark) {
      return Response.json(
        { success: false, message: "Bookmark not found." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Bookmark removed.",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return Response.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
