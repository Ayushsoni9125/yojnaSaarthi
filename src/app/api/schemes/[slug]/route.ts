import { NextRequest } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDB } from "@/lib/db/mongoose";
import { logActivity } from "@/services/activity.service";

import {
    successResponse,
    errorResponse,
    validationErrorResponse,
} from "@/lib/api/response";

import { SchemeValidationSchema } from "@/validations/scheme";

import {
    getSchemeBySlug,
    updateScheme,
    deleteScheme,
} from "@/services/scheme.service";

// =========================
// GET /api/schemes/:slug
// =========================

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;

        const scheme = await getSchemeBySlug(slug);

        if (!scheme) {
            return errorResponse("Scheme not found", 404);
        }

        return successResponse(
            scheme,
            "Scheme fetched successfully."
        );
    } catch (error) {
        console.error(error);

        return errorResponse("Internal Server Error");
    }
}

// =========================
// PUT /api/schemes/:slug
// =========================

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();

        const { slug } = await params;

        const body = await request.json();

        const validationResult =
            SchemeValidationSchema.partial().safeParse(body);

        if (!validationResult.success) {
            return validationErrorResponse(
                validationResult.error.flatten()
            );
        }

        const updatedScheme = await updateScheme(
            slug,
            validationResult.data
        );

        if (!updatedScheme) {
            return errorResponse("Scheme not found", 404);
        }

        // Log activity
        await logActivity({
            action: "UPDATE",
            resource: "Scheme",
            resourceId: updatedScheme.slug,
            description: `Updated scheme "${updatedScheme.title}"`,
        });

        return successResponse(
            updatedScheme,
            "Scheme updated successfully."
        );
    } catch (error) {
        console.error(error);

        if (error instanceof AuthError) {
            return errorResponse(error.message, error.status);
        }

        return errorResponse("Internal Server Error");
    }
}

// =========================
// DELETE /api/schemes/:slug
// =========================

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();

        const { slug } = await params;

        const deletedScheme = await deleteScheme(slug);

        if (!deletedScheme) {
            return errorResponse("Scheme not found", 404);
        }

        // Log activity
        await logActivity({
            action: "DELETE",
            resource: "Scheme",
            resourceId: deletedScheme.slug,
            description: `Deleted scheme "${deletedScheme.title}"`,
        });

        return successResponse(
            null,
            "Scheme deleted successfully."
        );
    } catch (error) {
        console.error(error);

        if (error instanceof AuthError) {
            return errorResponse(error.message, error.status);
        }

        return errorResponse("Internal Server Error");
    }
}