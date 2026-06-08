// pages/ExtractPage.jsx
//
// Flow:
//  1. user วาง text ลง textarea
//  2. กด Extract → POST /api/v1/words/extract → ได้ word list
//     → กรองคำที่ save ใน DB ออกแล้ว (ถ้า login อยู่)
//  3. แต่ละคำมีปุ่ม Save / Skip
//     → skipped เก็บใน localStorage ข้ามการ extract

import { useState, useEffect } from "react";
import WordList from "../components/WordList.jsx";
import useAuth from "../hooks/useAuth.js";
import API from "../api.js";


const ExtractPage = () => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [words, setWords] = useState([]);
  const [skipped, setSkipped] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showSkipped, setShowSkipped] = useState(false);

  // reset เมื่อ user เปลี่ยน (login/logout)
  useEffect(() => {
    setWords([]);
    setSaved(new Set());
    setSkipped(new Set());
    setShowSkipped(false);
  }, [user?._id]);

  // คำที่ยังแสดงอยู่ = ยังไม่ skip และยังไม่ save
  const visibleWords = words.filter((w) => !skipped.has(w) && !saved.has(w));
  // skipped words จาก extract ปัจจุบัน (ไม่รวมที่ save ไปแล้ว)
  const skippedWords = words.filter((w) => skipped.has(w) && !saved.has(w));

  const handleExtract = async () => {
    if (!text.trim()) return;
    setError("");
    setSuccessMsg("");
    setLoading(true);
    setWords([]);
    setSaved(new Set());
    // ไม่ reset skipped — ให้ใช้ค่าจาก localStorage ต่อเนื่อง

    try {
      const res = await fetch(`${API}/api/v1/words/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const alreadySkipped = data.data.skipped ?? [];
      setWords([...data.data.words, ...alreadySkipped]);
      setSkipped(new Set(alreadySkipped));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (word) => {
    setSaved((prev) => new Set([...prev, word]));

    try {
      const res = await fetch(`${API}/api/v1/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          words: [{ word, source: text.slice(0, 200) }],
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch (err) {
      // ถ้า save ไม่สำเร็จ → ย้อนกลับ
      setSaved((prev) => {
        const next = new Set(prev);
        next.delete(word);
        return next;
      });
      setError(`Failed to save "${word}": ${err.message}`);
    }
  };

  const handleSkip = async (word) => {
    setSkipped((prev) => new Set([...prev, word]));
    try {
      await fetch(`${API}/api/v1/words/skipped`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ word }),
      });
    } catch {
      setSkipped((prev) => {
        const next = new Set(prev);
        next.delete(word);
        return next;
      });
    }
  };

  const handleUndoSkip = async (word) => {
    setSkipped((prev) => {
      const next = new Set(prev);
      next.delete(word);
      return next;
    });
    try {
      await fetch(`${API}/api/v1/words/skipped/${encodeURIComponent(word)}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      setSkipped((prev) => new Set([...prev, word]));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold mb-3">Extract Words</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          onClick={handleExtract}
          disabled={loading || !text.trim()}
          className="mt-2 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-40"
        >
          {loading ? "Extracting..." : "Extract"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

      {words.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">
              {visibleWords.length} words remaining · {saved.size} saved · {skipped.size} skipped
            </p>
          </div>

          <WordList
            words={visibleWords}
            mode="extract"
            onSave={handleSave}
            onSkip={handleSkip}
          />

          {visibleWords.length === 0 && words.length > 0 && (
            <p className="text-center text-gray-400 py-4 text-sm">
              All done! {saved.size} words saved.
            </p>
          )}

          {skippedWords.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowSkipped((p) => !p)}
                className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <span>{showSkipped ? "▾" : "▸"}</span>
                <span>{skippedWords.length} skipped</span>
              </button>
              {showSkipped && (
                <div className="mt-2">
                  <WordList
                    words={skippedWords}
                    mode="skipped"
                    onUndo={handleUndoSkip}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExtractPage;
