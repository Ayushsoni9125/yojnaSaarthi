import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { SchemeValidationSchema } from "@/validations/scheme";
import { createScheme } from "@/services/scheme.service";
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
} from "@/lib/api/response";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const validationResult = SchemeValidationSchema.safeParse(body);

        if (!validationResult.success) {
            return validationErrorResponse(
                validationResult.error.flatten()
            );
        }

        const scheme = await createScheme(
            validationResult.data
        );
        return successResponse(
            scheme,
            "Scheme created successfully.",
            201
        );
    } catch (error: any) {
        console.error(error);

        return errorResponse(
            "Internal Server Error"
        );

        
    }
}