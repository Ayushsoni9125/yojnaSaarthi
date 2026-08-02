"use client";

type DeleteSchemeModalProps = {
  open: boolean;
  loading?: boolean;
  schemeTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteSchemeModal({
  open,
  loading = false,
  schemeTitle,
  onClose,
  onConfirm,
}: DeleteSchemeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">
          Delete Scheme
        </h2>

        <p className="mt-4 text-slate-600">
          Are you sure you want to delete
          <span className="font-semibold">
            {" "}
            {schemeTitle}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-red-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-5 py-2 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}