import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import LikeDislike from "../components/LikeDislike";
import Comments from "../components/Comments";
import VideoCard from "../components/VideoCard";
import Avatar from "../components/avatar";
import { timeAgo } from "../lib/format";
import { useAuth } from "../context/AuthContext";

function Description({ video }) {
  const [open, setOpen] = useState(false);
  const meta = timeAgo(video.fecha_subida);

  return (
    <div className="mt-4 rounded-xl bg-surface p-4 text-sm ring-1 ring-line">
      {meta && <p className="font-semibold">Publicado {meta}</p>}
      {video.descripcion && (
        <>
          <p
            className={`mt-2 whitespace-pre-wrap text-ink/90 ${
              open ? "" : "line-clamp-3"
            }`}
          >
            {video.descripcion}
          </p>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-2 font-semibold text-brand-soft hover:underline"
          >
            {open ? "Ver menos" : "Ver más"}
          </button>
        </>
      )}
    </div>
  );
}

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando el video:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center text-mute">
        Cargando reproductor...
      </main>
    );
  }

  const video = videos.find((v) => String(v.id) === String(id));

  if (!video) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="mb-3 text-mute">
          No encontramos este video en la base de datos.
        </p>
        <Link to="/" className="font-semibold text-brand-soft hover:underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  const handleDeleteVideo = async () => {
    if (!confirm("¿Seguro que deseas eliminar este video como administrador?"))
      return;
    try {
      const res = await fetch(`http://localhost:3000/api/videos/${video.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo eliminar el video");
      }

      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const channelName = video.usuarios?.nombre || "Canal Oficial";
  const related = videos.filter((v) => String(v.id) !== String(video.id));

  return (
    <main className="pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-5 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          <VideoPlayer
            key={video.id}
            src={video.url_video}
            poster={video.thumbnail_url}
          />

          <h1 className="mt-4 text-2xl font-extrabold leading-tight">
            {video.titulo}
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={channelName} size="size-10" />
              <p className="font-semibold">{channelName}</p>
            </div>

            <div className="flex items-center gap-3">
              {user?.rol === "admin" && (
                <button
                  onClick={handleDeleteVideo}
                  className="rounded-full bg-red-600/20 px-4 py-2 text-xs font-semibold text-red-400 ring-1 ring-red-500/40 transition hover:bg-red-600 hover:text-white"
                >
                  Eliminar video (Admin)
                </button>
              )}
              <LikeDislike likes={0} dislikes={0} />
            </div>
          </div>

          <Description key={video.id} video={video} />

          <Comments key={`c-${video.id}`} videoId={video.id} />
        </div>

        <aside
          aria-label="Más videos"
          className="space-y-4 lg:sticky lg:top-20 lg:self-start"
        >
          <h2 className="text-lg font-bold">Más videos</h2>
          {related.map((v) => (
            <VideoCard key={v.id} video={v} compact />
          ))}
        </aside>
      </div>
    </main>
  );
}