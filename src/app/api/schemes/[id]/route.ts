import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin, AuthError } from "@/lib/auth/requireAdmin";
import { updateScheme, deleteScheme } from "@/services/scheme.service";
import { logActivity } from "@/services/activity.service";
import { SchemeValidationSchema } from "@/validations/scheme";
import Scheme from "@/models/Scheme";
import mongoose from "mongoose";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// Helper to find scheme by slug or MongoDB _id
async function findSchemeByIdOrSlug(idOrSlug: string) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const found = await Scheme.findById(idOrSlug).lean();
    if (found) return found;
  }
  return await Scheme.findOne({ slug: idOrSlug }).lean();
}

// GET /api/schemes/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    const scheme = await findSchemeByIdOrSlug(id);

    if (!scheme) {
      return NextResponse.json(
        { success: false, message: "Scheme not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    console.error("GET scheme error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch scheme" },
      { status: 500 }
    );
  }
}

// PUT /api/schemes/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const adminSession = await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const validatedData = SchemeValidationSchema.partial().parse(body);

    let updatedScheme = await updateScheme(id, validatedData);

    if (!updatedScheme && mongoose.Types.ObjectId.isValid(id)) {
      const dbScheme = await Scheme.findByIdAndUpdate(id, validatedData, { new: true }).lean();
      if (dbScheme) updatedScheme = dbScheme as any;
    }

    if (!updatedScheme) {
      return NextResponse.json(
        { success: false, message: "Scheme not found" },
        { status: 404 }
      );
    }

    const adminEmail = (adminSession.user as any)?.email || "admin";
    await logActivity({
      action: "UPDATE",
      resource: "Scheme",
      resourceId: id,
      description: `Updated scheme "${validatedData.title || id}"`,
      performedBy: adminEmail,
    });

    return NextResponse.json({
      success: true,
      data: updatedScheme,
      message: "Scheme updated successfully",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: (error as any).status || 401 }
      );
    }
    console.error("PUT scheme error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update scheme" },
      { status: 500 }
    );
  }
}

// DELETE /api/schemes/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const adminSession = await requireAdmin();
    const { id } = await params;

    let deleted = await deleteScheme(id);

    if (!deleted && mongoose.Types.ObjectId.isValid(id)) {
      const dbScheme = await Scheme.findByIdAndDelete(id).lean();
      if (dbScheme) deleted = dbScheme as any;
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Scheme not found or already deleted" },
        { status: 404 }
      );
    }

    const adminEmail = (adminSession.user as any)?.email || "admin";
    await logActivity({
      action: "DELETE",
      resource: "Scheme",
      resourceId: id,
      description: `Deleted scheme "${deleted.title || id}"`,
      performedBy: adminEmail,
    });

    return NextResponse.json({
      success: true,
      message: "Scheme deleted successfully",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: (error as any).status || 401 }
      );
    }
    console.error("DELETE scheme error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete scheme" },
      { status: 500 }
    );
  }
}
