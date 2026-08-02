"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
    SchemeValidationSchema,
    SchemeInput,
} from "@/validations/scheme";

import {
    SCHEME_CATEGORIES,
    SCHEME_STATUS,
} from "@/constants/scheme";

type SchemeFormProps = {
    initialData?: Partial<SchemeInput>;
    isEdit?: boolean;
};

export default function SchemeForm({
    initialData,
    isEdit = false,
}: SchemeFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SchemeInput>({
        resolver: zodResolver(SchemeValidationSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: SchemeInput) => {
        try {
            const payload = {
                ...data,
                benefits: [],
                documents: [],
                tags: [],
                states: [],
            };

            const url = isEdit
                ? `/api/schemes/${initialData?.slug}`
                : "/api/schemes";

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Failed to create scheme");
                return;
            }

            toast.success(
                isEdit
                    ? "Scheme updated successfully!"
                    : "Scheme created successfully!"
            );

            console.log(result);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create scheme");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl border bg-white p-8 shadow-sm"
        >
            {/* Basic Information */}
            <div>
                <h2 className="mb-6 text-xl font-semibold">
                    Basic Information
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Title */}
                    <div>
                        <label className="mb-2 block font-medium">
                            Scheme Title
                        </label>

                        <input
                            {...register("title")}
                            placeholder="PM Kisan Samman Nidhi"
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
                        />

                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="mb-2 block font-medium">
                            Slug
                        </label>

                        <input
                            {...register("slug")}
                            placeholder="pm-kisan-samman-nidhi"
                            disabled={isEdit}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />

                        {errors.slug && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.slug.message}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-2 block font-medium">
                            Category
                        </label>

                        <select
                            {...register("category")}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
                        >
                            <option value="">Select Category</option>

                            {SCHEME_CATEGORIES.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>

                        {errors.category && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-2 block font-medium">
                            Status
                        </label>

                        <select
                            {...register("status")}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
                        >
                            <option value="">Select Status</option>

                            {SCHEME_STATUS.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>

                        {errors.status && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.status.message}
                            </p>
                        )}
                    </div>

                    {/* Ministry */}
                    <div>
                        <label className="mb-2 block font-medium">
                            Ministry
                        </label>

                        <input
                            {...register("ministry")}
                            placeholder="Ministry of Agriculture"
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
                        />

                        {errors.ministry && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.ministry.message}
                            </p>
                        )}
                    </div>

                    {/* Official URL */}
                    <div>
                        <label className="mb-2 block font-medium">
                            Official Website
                        </label>

                        <input
                            {...register("officialUrl")}
                            placeholder="https://..."
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
                        />

                        {errors.officialUrl && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.officialUrl.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <h2 className="mb-6 text-xl font-semibold">
                    Description
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="mb-2 block font-medium">
                            Short Description
                        </label>

                        <textarea
                            rows={3}
                            {...register("shortDescription")}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
                        />

                        {errors.shortDescription && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.shortDescription.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Full Description
                        </label>

                        <textarea
                            rows={8}
                            {...register("description")}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
                        />

                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="border-t pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? isEdit
                            ? "Updating..."
                            : "Saving..."
                        : isEdit
                            ? "Update Scheme"
                            : "Create Scheme"}
                </button>
            </div>
        </form>
    );
}

