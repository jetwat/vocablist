// components/WordCard.jsx
//
// แสดงคำเดียว + ปุ่ม action
// mode="extract" → ปุ่ม Save / Skip
// mode="saved"   → ปุ่ม Delete

const WordCard = ({ word, mode, onSave, onSkip, onDelete, onUndo }) => {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
      <span className="font-medium text-gray-800">{word}</span>

      <div className="flex gap-2">
        {mode === "extract" && (
          <>
            <button
              onClick={() => onSave(word)}
              className="text-xs bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
              Save
            </button>
            <button
              onClick={() => onSkip(word)}
              className="text-xs text-gray-400 hover:text-gray-600 px-2"
            >
              Skip
            </button>
          </>
        )}

        {mode === "saved" && (
          <button
            onClick={() => onDelete(word)}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Delete
          </button>
        )}

        {mode === "skipped" && (
          <button
            onClick={() => onUndo(word)}
            className="text-xs text-blue-500 hover:text-blue-700 px-2"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  );
};

export default WordCard;
