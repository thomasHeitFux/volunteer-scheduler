type ClearWeekModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ClearWeekModal({
  onCancel,
  onConfirm,
}: ClearWeekModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-3 text-center">Confirm clear week</h2>
        <p className="text-gray-300 text-sm mb-5 text-center">
          Are you sure you want to delete all shifts for this week?
        </p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Yes, clear
          </button>
        </div>
      </div>
    </div>
  );
}
