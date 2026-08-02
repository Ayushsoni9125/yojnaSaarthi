"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  SchemeValidationSchema,
  SchemeInput,
} from "@/validations/scheme";

export default function SchemeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchemeInput>({
    resolver: zodResolver(SchemeValidationSchema),
  });

  const onSubmit = async (data: SchemeInput) => {
    try {
      const res = await fetch("/api/schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Something went wrong.");
        console.log(result);
        return;
      }

      alert("Scheme created successfully!");

      console.log(result);
    } catch (error) {
      console.error(error);
      alert("Failed to create scheme.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
      {/* Title */}
      <div>
        <label className="mb-2 block font-medium">
          Scheme Title
        </label>

        <input
          {...register("title")}
          placeholder="Enter scheme title"
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Scheme"}
      </button>
    </form>
  );
}