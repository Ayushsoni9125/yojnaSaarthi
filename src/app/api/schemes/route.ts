import { NextRequest } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDB } from "@/lib/db/mongoose";
import { logActivity } from "@/services/activity.service";
import Notification from "@/models/Notification";
import User from "@/models/User";
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
} from "@/lib/api/response";

import {
    SchemeValidationSchema,
} from "@/validations/scheme";

import {
    SchemeQuerySchema,
} from "@/validations/query";

import {
    createScheme,
    getSchemes,
} from "@/services/scheme.service";

// =======================
// POST /api/schemes
// =======================

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const body = await request.json();

        const validationResult =
            SchemeValidationSchema.safeParse(body);

        if (!validationResult.success) {
            return validationErrorResponse(
                validationResult.error.flatten()
            );
        }

        const scheme = await createScheme(
            validationResult.data
        );

        // Log activity
        await logActivity({
            action: "CREATE",
            resource: "Scheme",
            resourceId: scheme.slug,
            description: `Created scheme "${scheme.title}"`,
        });

        return successResponse(
            scheme,
            "Scheme created successfully.",
            201
        );
    } catch (error) {
        console.error(error);

        if (error instanceof AuthError) {
            return errorResponse(error.message, error.status);
        }

        return errorResponse("Internal Server Error");
    }
}

// =======================
// GET /api/schemes
// =======================

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const queryResult = SchemeQuerySchema.safeParse({
            page: searchParams.get("page") ?? "1",
            limit: searchParams.get("limit") ?? "10",
            search: searchParams.get("search") ?? undefined,
            category: searchParams.get("category") ?? undefined,
            status: searchParams.get("status") ?? undefined,
            state: searchParams.get("state") ?? undefined,
            sort: searchParams.get("sort") ?? "latest",
        });

        if (!queryResult.success) {
            return validationErrorResponse(
                queryResult.error.flatten()
            );
        }

        const result = await getSchemes(
            queryResult.data
        );

        return successResponse(
            result,
            "Schemes fetched successfully."
        );
    } catch (error) {
        console.error(error);

        return errorResponse(
            "Internal Server Error"
        );
    }
}