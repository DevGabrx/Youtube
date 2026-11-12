import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Play, Search } from "./Icons";
import { useAuth } from "../context/AuthContext";
import Avatar from "./avatar";

function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const { user, token } = useAuth();

  // Estado para el modal de subir video
  const [showUpload, setShowUpload] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/?q=${encodeURIComponent(term)}` : "/");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !urlVideo.trim()) return;
    setUploading(true);

    // Extraer ID de YouTube si el usuario pega link normal para generar miniatura automática
    let finalUrl = urlVideo.trim();
    let finalThumb = thumbnailUrl.trim();
    const ytMatch = finalUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      finalUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      if (!finalThumb) finalThumb = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    }

    try {
      const res = await fetch("http://localhost:3000/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          url_video: finalUrl,
          thumbnail_url: finalThumb || "/thumbs/gta.jpg",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir el video");

      setShowUpload(false);
      setTitulo("");
      setDescripcion("");
      setUrlVideo("");
      setThumbnailUrl("");
      window.location.href = "/"; // Recargamos para mostrar el nuevo video
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
              <Play width={16} height={16} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">TuVideo</span>
          </Link>

          <form
            role="search"
            onSubmit={submit}
            className="flex w-full max-w-lg items-center rounded-full bg-surface ring-1 ring-line focus-within:ring-brand"
          >
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar videos"
              aria-label="Buscar videos"
              className="w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-mute"
            />
            <button aria-label="Buscar" className="px-4 text-mute hover:text-ink">
              <Search />
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => setShowUpload(true)}
                  className="rounded-full bg-surface px-4 py-2 text-sm font-semibold ring-1 ring-line transition hover:bg-line"
                >
                  + Subir
                </button>
                <Link to="/profile" title="Mi perfil" className="flex items-center gap-2">
                  <Avatar name={user.nombre} />
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Modal para Subir Video */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Publicar nuevo video</h2>
              <button onClick={() => setShowUpload(false)} className="text-mute hover:text-ink">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-mute">Título *</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Gameplay épico"
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-mute">
                  Enlace de YouTube *
                </label>
                <input
                  type="url"
                  required
                  value={urlVideo}
                  onChange={(e) => setUrlVideo(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-mute">
                  URL de Miniatura (Opcional, se genera sola si es YouTube)
                </label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://... o /thumbs/..."
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-mute">Descripción</label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="De qué trata tu video..."
                  className="w-full resize-none rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-mute hover:text-ink"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-soft disabled:opacity-50"
                >
                  {uploading ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;