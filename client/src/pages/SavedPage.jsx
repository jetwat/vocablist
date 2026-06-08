// pages/SavedPage.jsx

import { useState, useEffect } from "react";
import WordList from "../components/WordList.jsx";
import API from "../api.js";

const SavedPage = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(`${API}/api/v1/words`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setWords(data.data.words);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const handleDelete = async (wordObj) => {
    // optimistic update — ลบจาก UI ก่อน แล้วค่อย call API
    setWords((prev) => prev.filter((w) => w._id !== wordObj._id));

    try {
      const res = await fetch(`${API}/api/v1/words/${wordObj._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch (err) {
      // ถ้า delete ไม่สำเร็จ → คืนคำกลับมา
      setWords((prev) => [...prev, wordObj]);
      setError(err.message);
    }
  };

  const handleExport = async () => {
    const res = await fetch(`${API}/api/v1/words/export`, {
      credentials: "include",
    });
    // server ส่ง Content-Disposition: attachment → browser download อัตโนมัติ
    // แต่ต้องทำผ่าน blob เพราะ fetch ไม่ trigger download เอง
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vocab.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Saved Words ({words.length})</h1>
        {words.length > 0 && (
          <button
            onClick={handleExport}
            className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Export .txt
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <WordList
        words={words.map((w) => w.word)}
        mode="saved"
        onDelete={(word) => {
          const wordObj = words.find((w) => w.word === word);
          if (wordObj) handleDelete(wordObj);
        }}
      />
    </div>
  );
};

export default SavedPage;
