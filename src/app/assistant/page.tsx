import AssistantForm from "@/components/assistant/AssistantForm";

export default function AssistantPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-bold">
        AI Scheme Assistant
      </h1>

      <p className="mt-2 text-slate-600">
        Answer a few questions and we'll recommend the most relevant government schemes.
      </p>

      <div className="mt-10">
        <AssistantForm />
      </div>
    </main>
  );
}