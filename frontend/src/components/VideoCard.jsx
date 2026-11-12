import { Link } from "react-router-dom";
import Avatar from "./avatar";
import { timeAgo } from "../lib/format";

export default function VideoCard({ video, compact = false }) {
  // Extraemos el nombre del canal desde la relación con 'usuarios'
  const channelName = video.usuarios?.nombre || "Canal Oficial";
  const meta = timeAgo(video.fecha_subida);

  return (
    <Link to={`/watch/${video.id}`} className={`group ${compact ? "flex gap-3" : "block"}`}>
      <div
        className={`relative aspect-video shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-line ${
          compact ? "w-44" : "w-full"
        }`}
      >
        {video.thumbnail_url && (
          <img
            src={video.thumbnail_url}
            alt={video.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className={compact ? "min-w-0" : "mt-3 flex gap-3"}>
        {!compact && <Avatar name={channelName} />}
        <div className="min-w-0">
          <h3
            className={`line-clamp-2 font-semibold leading-snug group-hover:text-brand-soft ${
              compact ? "text-sm" : ""
            }`}
          >
            {video.titulo}
          </h3>
          <p className="mt-1 text-sm text-mute">{channelName}</p>
          {meta && <p className="text-xs text-mute">{meta}</p>}
        </div>
      </div>
    </Link>
  );
}