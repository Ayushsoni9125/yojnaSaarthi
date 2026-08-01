import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db/mongoose";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api/response";

import { RegisterSchema } from "@/validations/auth";

import {
  getUserByEmail,
  createUser,
} from "@/services/user.service";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(
        validation.error.flatten()
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return errorResponse("User already exists.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
    });

    return successResponse(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "User registered successfully."
    );
  } catch (error) {
    console.error(error);

    return errorResponse("Internal Server Error");
  }
}