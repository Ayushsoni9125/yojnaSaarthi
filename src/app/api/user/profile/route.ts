import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireUser } from "@/lib/auth/requireUser";
import { updateUser } from "@/services/user.service";
import { AuthError } from "@/lib/auth/requireAdmin";
import { z } from "zod";

const ProfileUpdateSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(50, "Name cannot exceed 50 characters"),
  image: z.string().url("Profile picture must be a valid URL").or(z.string().length(0)).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = await requireUser();

    const body = await req.json();
    const validation = ProfileUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Failed",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, image } = validation.data;

    const updatedUser = await updateUser(user._id.toString(), {
      name,
      image: image || "",
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        name: updatedUser.name,
        image: updatedUser.image,
      },
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
