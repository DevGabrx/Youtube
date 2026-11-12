import { useEffect, useState } from "react";
import Avatar from "./avatar";
import { timeAgo } from "../lib/format";
import { useAuth } from "../context/AuthContext";

export default function Comments({ videoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cargar comentarios reales desde Supabase al entrar al video
  useEffect(() => {
    if (!videoId) return;
    fetch(`http://localhost:3000/api/comments/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch((err) => console.error("Error cargando comentarios:", err));
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: text.trim(),
          video_id: videoId,
          usuario_id: user?.id, // Envía el ID del usuario logueado si existe
        }),
      });

      if (!res.ok) throw new Error("No se pudo publicar el comentario");
      const newComment = await res.json();

      setComments((prev) => [newComment, ...prev]);
      setText("");
    } catch (err) {
      console.error("Error al comentar:", err);
      alert("Hubo un error al publicar tu comentario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-bold">
        {comments.length} {comments.length === 1 ? "comentario" : "comentarios"}
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
        <Avatar name={user?.nombre || "Tú"} />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              user
                ? `Comenta como ${user.nombre}...`
                : "Escribe un comentario..."
            }
            rows={2}
            className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-ink outline-none focus:border-brand"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Publicando..." : "Comentar"}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((c) => {
          const author = c.usuarios?.nombre || "Usuario";
          return (
            <div key={c.id} className="flex gap-3">
              <Avatar name={author} />
              <div>
                <p className="text-xs font-semibold">
                  {author}{" "}
                  <span className="font-normal text-mute">
                    {timeAgo(c.fecha)}
                  </span>
                </p>
                <p className="mt-1 text-sm text-ink/90">{c.texto}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}