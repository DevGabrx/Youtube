export default function VideoPlayer({ src, poster }) {
  const isYouTube = src && (src.includes("youtube.com") || src.includes("youtu.be"));
  
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const finalSrc = isYouTube ? getEmbedUrl(src) : src;

  return (
    <div className="w-full">
      <div className="w-full bg-black overflow-hidden rounded-2xl shadow-lg">
        <div className="relative w-full aspect-video">
          {isYouTube ? (
            <iframe
              src={finalSrc}
              title="YouTube video player"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={finalSrc}
              poster={poster}
              controls
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          )}
        </div>
      </div>
    </div>
  );
}