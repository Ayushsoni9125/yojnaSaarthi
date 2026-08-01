import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { SchemeValidationSchema } from "@/validations/scheme";
import { createScheme } from "@/services/scheme.service";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const validatedData = SchemeValidationSchema.parse(body);

    const scheme = await createScheme(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Scheme created successfully.",
        data: scheme,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          errors: error.errors,
        },
        {
          status: 400,
        }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}