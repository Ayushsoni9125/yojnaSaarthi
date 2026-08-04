"use client";

import { useEffect, useState } from "react";
import SchemeCard from "@/components/schemes/SchemeCard";
import { SCHEME_CATEGORIES, SCHEME_STATUS } from "@/constants/scheme";
import { INDIAN_STATES } from "@/constants/states";
type Scheme = {
    _id: string;
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    ministry: string;
    status: string;
};

export default function HomeClient({
    initialSchemes,
}: {
    initialSchemes: Scheme[];
}) {
    const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [state, setState] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const params = new URLSearchParams();

                if (search.trim()) params.append("search", search.trim());
                if (category) params.append("category", category);
                if (state.trim()) params.append("state", state.trim());
                if (status) params.append("status", status);

                const res = await fetch(`/api/schemes?${params.toString()}`);

                const data = await res.json();

                if (!res.ok) {
                    console.error(data);
                    return;
                }

                setSchemes(data.data.schemes);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSchemes();
    }, [search, category, state, status]);

    return (
    <>
            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search schemes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border p-3"
                />
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-4">
                {/* Category */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg border p-2"
                >
                    <option value="">All Categories</option>

                    {SCHEME_CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border p-2"
                >
                    <option value="">All Status</option>

                    {SCHEME_STATUS.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                {/* State */}
                <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="rounded-lg border p-2"
                >
                    <option value="">All States</option>

                    {INDIAN_STATES.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {/* Results */}
            {schemes.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                    No schemes found.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {schemes.map((scheme) => (
                        <SchemeCard
                            key={scheme._id}
                            scheme={scheme}
                        />
                    ))}
                </div>
            )}
        </>
    );
}