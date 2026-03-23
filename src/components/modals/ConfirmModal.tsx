type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure?",
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
        <p className="mb-4 text-gray-700">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}