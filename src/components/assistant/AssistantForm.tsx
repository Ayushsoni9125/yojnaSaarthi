"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { INDIAN_STATES } from "@/constants/state";
import { apiFetch } from "@/lib/apiClient";

type Question = {
  key: string;
  question: string;
  type: "text" | "number" | "select";
  options?: readonly string[];
};

const QUESTIONS: Question[] = [
  {
    key: "state",
    question: "Which state do you live in?",
    type: "select",
    options: INDIAN_STATES,
  },
  {
    key: "gender",
    question: "What is your gender?",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  {
    key: "age",
    question: "What is your age?",
    type: "number",
  },
  {
    key: "occupation",
    question: "What is your occupation?",
    type: "select",
    options: [
      "Student",
      "Farmer",
      "Business Owner",
      "Salaried Employee",
      "Homemaker",
      "Unemployed",
      "Senior Citizen",
      "Self Employed",
    ],
  },
  {
    key: "income",
    question: "What is your annual family income?",
    type: "select",
    options: [
      "Below 1 Lakh",
      "1-3 Lakh",
      "3-5 Lakh",
      "5-10 Lakh",
      "Above 10 Lakh",
    ],
  },
  {
    key: "category",
    question: "Do you belong to any category?",
    type: "select",
    options: [
      "General",
      "OBC",
      "SC",
      "ST",
      "EWS",
      "Minority",
    ],
  },
  {
    key: "disability",
    question: "Are you specially abled?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    key: "maritalStatus",
    question: "What is your marital status?",
    type: "select",
    options: ["Single", "Married", "Widowed", "Divorced"],
  },
];

export default function AssistantForm() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = QUESTIONS[step];

  const updateAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [current.key]: value,
    }));
  };

  const handleNext = async () => {
    const value = answers[current.key];

    if (!value || value.trim() === "") {
      toast.warning("Please answer this question before proceeding.");
      return;
    }

    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    try {
      const res = await apiFetch("/api/assistant/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status !== 429) {
          toast.error(data.message || "Failed to fetch recommendations.");
        }
        return;
      }

      // Save ONLY the array
      localStorage.setItem(
        "assistant-results",
        JSON.stringify(data.data)
      );

      router.push("/assistant/results");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePrevious = () => {
    if (step === 0) return;

    setStep((prev) => prev - 1);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-white p-8 shadow">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-gray-500">
          <span>
            Question {step + 1} of {QUESTIONS.length}
          </span>

          <span>
            {Math.round(((step + 1) / QUESTIONS.length) * 100)}%
          </span>
        </div>

        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{
              width: `${((step + 1) / QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-bold text-slate-900">
        {current.question}
      </h2>

      <div className="mt-8">
        {current.type === "text" && (
          <input
            type="text"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={answers[current.key] || ""}
            onChange={(e) => updateAnswer(e.target.value)}
          />
        )}

        {current.type === "number" && (
          <input
            type="number"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={answers[current.key] || ""}
            onChange={(e) => updateAnswer(e.target.value)}
          />
        )}

        {current.type === "select" && (
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={answers[current.key] || ""}
            onChange={(e) => updateAnswer(e.target.value)}
          >
            <option value="">Select an option</option>

            {current.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-10 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={step === 0}
          className="rounded-lg border px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          {step === QUESTIONS.length - 1
            ? "Get Recommendations"
            : "Next"}
        </button>
      </div>
    </div>
  );
}