// Círculo con la inicial del canal. Cuando tengan foto de perfil en Supabase,
// se cambia por un <img>.
export default function Avatar({ name = "?", size = "size-9" }) {
  return (
    <span
      aria-hidden="true"
      className={`${size} grid shrink-0 place-items-center rounded-full bg-brand/25 text-sm font-bold text-brand-soft`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}