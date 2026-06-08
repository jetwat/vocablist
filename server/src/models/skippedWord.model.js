import mongoose from "mongoose";

const skippedWordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    word: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

skippedWordSchema.index({ userId: 1, word: 1 }, { unique: true });

const SkippedWord = mongoose.model("SkippedWord", skippedWordSchema);
export default SkippedWord;
