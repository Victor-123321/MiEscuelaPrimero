import { useState } from "react";
import { COLORS } from "../../constants/colors";

export default function Navbar({ page, setPage, adminUnlocked, setAdminUnlocked }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Inicio", id: "home" },
    { label: "Cómo Funciona", id: "how" },
  ];

  const handleNav = (id) => {
    setPage(id);
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: COLORS.blue,
      boxShadow: "0 2px 20px rgba(0,74,153,0.4)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        {/* Logo */}
        <button onClick={() => handleNav("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        }}>
          <img
            src="/logo.svg"
            alt="Mexicanos Primero Jalisco"
            style={{ height: 38, width: "auto", display: "block" }}
          />
          <span style={{
            color: "#fff", fontFamily: "'Georgia', serif",
            fontSize: 16, fontWeight: 700, letterSpacing: "-0.5px",
          }}>
            Mi Escuela <span style={{ color: COLORS.greenLight }}>Primero</span>
          </span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }} className="desktop-nav">
          <style>{`
            @media (max-width: 640px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } }
            @media (min-width: 641px) { .mobile-menu-btn { display: none !important; } .mobile-menu { display: none !important; } }
          `}</style>
          {navLinks.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)} style={{
              background: page === item.id ? "rgba(255,255,255,0.15)" : "none",
              border: "none", cursor: "pointer",
              color: "#fff", padding: "8px 14px", borderRadius: 6,
              fontSize: 14, fontWeight: 500, transition: "background 0.2s",
              whiteSpace: "nowrap",
            }}>{item.label}</button>
          ))}
          <button
            onClick={() => { setAdminUnlocked(true); handleNav("admin"); }}
            style={{
              background: adminUnlocked ? COLORS.amber : "rgba(255,255,255,0.1)",
              border: `1px solid ${adminUnlocked ? COLORS.amber : "rgba(255,255,255,0.3)"}`,
              cursor: "pointer",
              color: adminUnlocked ? COLORS.text : "#fff",
              padding: "8px 14px", borderRadius: 6,
              fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
            }}
          >
            {adminUnlocked ? "⚙️ Admin" : "Iniciar Sesión"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none", border: "none", cursor: "pointer",
            color: "#fff", fontSize: 24, padding: 4,
            alignItems: "center", justifyContent: "center",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className="mobile-menu" style={{
        display: menuOpen ? "flex" : "none",
        flexDirection: "column",
        background: COLORS.blueDark,
        padding: "8px 0 16px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}>
        {navLinks.map(item => (
          <button key={item.id} onClick={() => handleNav(item.id)} style={{
            background: page === item.id ? "rgba(255,255,255,0.1)" : "none",
            border: "none", cursor: "pointer",
            color: "#fff", padding: "12px 20px", textAlign: "left",
            fontSize: 15, fontWeight: 500,
          }}>{item.label}</button>
        ))}
        <button
          onClick={() => { setAdminUnlocked(true); handleNav("admin"); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: COLORS.amber, padding: "12px 20px", textAlign: "left",
            fontSize: 15, fontWeight: 600,
          }}
        >
          {adminUnlocked ? "⚙️ Admin" : "Iniciar Sesión"}
        </button>
      </div>
    </nav>
  );
}
