import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<p className="p-8 text-mute">Esta página no existe.</p>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}