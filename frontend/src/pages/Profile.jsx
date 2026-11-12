import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/avatar";

export default function Profile() {
  const { user, token, logout, updateUserLocal } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.nombre) {
          setNombre(data.nombre);
          setEmail(data.email);
        }
      })
      .catch(() => {});
  }, [token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setSaving(true);
    try {
      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");

      updateUserLocal(data.user);
      setMsg("Perfil actualizado correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) return;
    try {
      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo eliminar la cuenta");
      logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return null;

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="rounded-2xl bg-surface p-8 ring-1 ring-line">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-6">
          <div className="flex items-center gap-4">
            <Avatar name={user.nombre} size="size-16" />
            <div>
              <h1 className="text-2xl font-extrabold">{user.nombre}</h1>
              <span className="mt-1 inline-block rounded-full bg-brand/20 px-3 py-0.5 text-xs font-semibold uppercase text-brand-soft">
                Rol: {user.rol}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="rounded-full bg-line px-4 py-2 text-xs font-semibold hover:bg-red-500/20 hover:text-red-400"
          >
            Cerrar sesión
          </button>
        </div>

        {msg && (
          <div className="mt-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-400 ring-1 ring-green-500/30">
            {msg}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-mute">Nombre del canal</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-mute">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        <div className="mt-10 border-t border-line pt-6">
          <h2 className="text-sm font-bold text-red-400">Zona de peligro</h2>
          <p className="mt-1 text-xs text-mute">
            Al eliminar tu cuenta se borrarán tus datos de la base de datos.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="mt-3 rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
          >
            Eliminar mi cuenta
          </button>
        </div>
      </div>
    </main>
  );
}