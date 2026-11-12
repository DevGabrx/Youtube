import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { Play } from "../components/Icons";

function Hero({ video }) {
  const channelName = video.usuarios?.nombre || "Canal Oficial";

  return (
    <Link
      to={`/watch/${video.id}`}
      className="group relative block overflow-hidden rounded-2xl bg-surface ring-1 ring-line"
    >
      <div className="aspect-video sm:aspect-21/9">
        {video.thumbnail_url && (
          <img
            src={video.thumbnail_url}
            alt={video.titulo}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <p className="mb-2 text-sm text-mute">{channelName}</p>
        <h2 className="max-w-2xl text-2xl font-extrabold leading-tight sm:text-4xl">
          {video.titulo}
        </h2>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white group-hover:bg-brand-soft">
          <Play width={16} height={16} /> Ver ahora
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim().toLowerCase();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/videos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al conectar con el servidor");
        return res.json();
      })
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los videos. Verifica que el backend esté encendido.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center text-mute">
        Cargando videos desde el servidor...
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center text-red-400">
        {error}
      </main>
    );
  }

  const filtered = videos.filter((v) => {
    const channelName = v.usuarios?.nombre || "";
    return !q || `${v.titulo} ${channelName}`.toLowerCase().includes(q);
  });

  const showHero = !q && filtered.length > 0;
  const featured = showHero 
    ? filtered.find((v) => v.titulo.toLowerCase().includes("grand theft auto")) || filtered[0] 
    : null;
  const rest = showHero ? filtered.filter((v) => v.id !== featured.id) : filtered;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {videos.length === 0 ? (
        <p className="py-24 text-center text-mute">
          Aún no hay videos en la base de datos de Supabase.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-24 text-center text-mute">
          No encontramos videos{q ? ` para “${params.get("q")}”` : ""}. Prueba con otra búsqueda.
        </p>
      ) : (
        <>
          {featured && (
            <div className="mb-10">
              <Hero video={featured} />
            </div>
          )}
          {rest.length > 0 && (
            <>
              {showHero && <h2 className="mb-4 text-lg font-bold">Más videos</h2>}
              <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rest.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}