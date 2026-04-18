import { useState } from "react";
import { COLORS } from "./constants/colors";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CatalogPage from "./pages/CatalogPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

// ── Login form shown when accessing /admin without a session ──────────────
function LoginGate({ onLogin }) {
  const [email, setEmail]     = useState("admin@mpj.org.mx");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await onLogin(email, password);
    if (!ok) setError("Correo o contraseña incorrectos.");
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{
        background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,74,153,0.12)",
        padding: "40px 36px", width: "100%", maxWidth: 400,
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>Acceso Administrador</h2>
          <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Mi Escuela Primero — Panel de Gestión</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 6 }}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@mpj.org.mx"
              required
              style={{ width: "100%", border: "2px solid #dde3f0", borderRadius: 9, padding: "11px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => (e.target.style.borderColor = COLORS.blue)}
              onBlur={e => (e.target.style.borderColor = "#dde3f0")}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 6 }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: "100%", border: "2px solid #dde3f0", borderRadius: 9, padding: "11px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => (e.target.style.borderColor = COLORS.blue)}
              onBlur={e => (e.target.style.borderColor = "#dde3f0")}
            />
          </div>
          {error && (
            <div style={{ background: "#fee8e8", border: "1px solid #f5a0a0", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c0392b", fontWeight: 600 }}>
              ❌ {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", background: loading ? COLORS.muted : COLORS.blue,
              color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
              borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 700,
              boxShadow: "0 4px 16px rgba(0,74,153,0.3)", transition: "background 0.2s",
            }}
          >
            {loading ? "Iniciando sesión…" : "Iniciar Sesión →"}
          </button>
        </form>

        <p style={{ marginTop: 18, textAlign: "center", fontSize: 11, color: COLORS.muted }}>
          Credenciales de prueba: admin@mpj.org.mx / Admin123!
        </p>
      </div>
    </div>
  );
}

// ── App root ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]   = useState("home");
  const { user, login, logout, isAuthenticated } = useAuth();

  const renderPage = () => {
    switch (page) {
      case "home":
        return <CatalogPage />;

      case "how":
        return <HowItWorksPage />;

      case "admin":
        return isAuthenticated
          ? <AdminPage onLogout={async () => { await logout(); }}  />
          : <LoginGate onLogin={login} />;

      default:
        return <NotFoundPage setPage={setPage} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      background: "#f5f7fc", color: COLORS.text,
    }}>
      <Navbar
        page={page}
        setPage={setPage}
        adminUnlocked={isAuthenticated}
        setAdminUnlocked={() => setPage("admin")}
        user={user}
      />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
