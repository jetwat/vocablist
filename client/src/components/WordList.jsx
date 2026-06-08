// components/WordList.jsx
//
// render list ของ WordCard
// แยกออกมาเพื่อให้ ExtractPage และ SavedPage ใช้ร่วมกัน

import WordCard from "./WordCard.jsx";

const WordList = ({ words, mode, onSave, onSkip, onDelete, onUndo }) => {
  if (words.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        {mode === "extract" ? "No words extracted yet" : "No saved words yet"}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {words.map((word) => (
        <WordCard
          key={word}
          word={word}
          mode={mode}
          onSave={onSave}
          onSkip={onSkip}
          onDelete={onDelete}
          onUndo={onUndo}
        />
      ))}
    </div>
  );
};

export default WordList;
