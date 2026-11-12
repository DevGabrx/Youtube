import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(nombre, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl bg-surface p-8 ring-1 ring-line">
        <h1 className="text-2xl font-extrabold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-mute">Únete para subir videos y comentar</p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-mute">Nombre del canal / usuario</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. DullanDev"
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
              placeholder="tu@correo.com"
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-mute">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mute">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-brand-soft hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}