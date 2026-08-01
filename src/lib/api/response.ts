import { NextResponse } from "next/server";

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    {
      status,
    }
  );
}

export function errorResponse(
  message = "Something went wrong",
  status = 500
) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
    }
  );
}

export function validationErrorResponse(errors: unknown) {
  return NextResponse.json(
    {
      success: false,
      message: "Validation Failed",
      errors,
    },
    {
      status: 400,
    }
  );
}