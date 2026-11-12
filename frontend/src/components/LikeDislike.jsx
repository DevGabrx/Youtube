import { useState } from "react";
import { ThumbDown, ThumbUp } from "./Icons";

// Estado local por ahora. Con Supabase: en onVote guarden el voto del usuario
// (tabla votes: video_id, user_id, value) y reemplacen los conteos.
export default function LikeDislike({ likes = 0, dislikes = 0, onVote }) {
  const [vote, setVote] = useState(null); // "like" | "dislike" | null

  const choose = (next) => {
    const value = vote === next ? null : next;
    setVote(value);
    onVote?.(value);
  };

  const btn = (active) =>
    `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-line ${
      active ? "text-brand-soft" : ""
    }`;

  return (
    <div className="inline-flex divide-x divide-line overflow-hidden rounded-full bg-surface ring-1 ring-line">
      <button onClick={() => choose("like")} aria-pressed={vote === "like"} className={btn(vote === "like")}>
        <ThumbUp fill={vote === "like" ? "currentColor" : "none"} />
        {likes + (vote === "like" ? 1 : 0)}
      </button>
      <button
        onClick={() => choose("dislike")}
        aria-pressed={vote === "dislike"}
        aria-label="No me gusta"
        className={btn(vote === "dislike")}
      >
        <ThumbDown fill={vote === "dislike" ? "currentColor" : "none"} />
        {dislikes + (vote === "dislike" ? 1 : 0)}
      </button>
    </div>
  );
}