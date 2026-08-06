import AssistantForm from "@/components/assistant/AssistantForm";

export default function AssistantPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          🤖 AI Scheme Assistant
        </h1>

        <p className="mt-1.5 text-slate-500 text-sm">
          Answer a few questions about yourself and get personalized government scheme recommendations instantly.
        </p>
      </div>

      <div className="mt-6 max-w-4xl">
        <AssistantForm />
      </div>
    </main>
  );
}