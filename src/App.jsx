import { useState } from "react";
import { COLORS } from "./constants/colors";
import { INITIAL_STATS } from "./data/mockStats";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CatalogPage from "./pages/CatalogPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const [page, setPage]               = useState("home");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [stats, setStats]             = useState(INITIAL_STATS);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <CatalogPage />;

      case "how":
        return <HowItWorksPage />;

      case "admin":
        return adminUnlocked
          ? <AdminPage stats={stats} setStats={setStats} />
          : (
            <div style={{ textAlign: "center", padding: 80, color: COLORS.muted }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <h2 style={{ color: COLORS.text }}>Acceso Restringido</h2>
              <p>Esta sección es solo para administradores de Mi Escuela Primero.</p>
              <button
                onClick={() => setAdminUnlocked(true)}
                style={{
                  marginTop: 16, background: COLORS.blue, color: "#fff", border: "none",
                  padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontWeight: 700,
                }}
              >
                Simular Inicio de Sesión →
              </button>
            </div>
          );

      default:
        return <NotFoundPage setPage={setPage} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: COLORS.gray,
      color: COLORS.text,
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${COLORS.gray}; }
      `}</style>

      <Navbar
        page={page}
        setPage={setPage}
        adminUnlocked={adminUnlocked}
        setAdminUnlocked={setAdminUnlocked}
      />

      <main style={{ minHeight: "calc(100vh - 64px)" }}>
        {renderPage()}
      </main>

      {page !== "admin" && <Footer setPage={setPage} />}
    </div>
  );
}
