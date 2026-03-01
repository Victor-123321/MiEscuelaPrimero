import { COLORS } from "../../constants/colors";

export default function Navbar({ page, setPage, adminUnlocked, setAdminUnlocked }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: COLORS.blue,
      boxShadow: "0 2px 20px rgba(0,74,153,0.4)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: COLORS.green,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff",
          }}>M</div>
          <span style={{
            color: "#fff", fontFamily: "'Georgia', serif",
            fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px",
          }}>
            Mi Escuela <span style={{ color: COLORS.greenLight }}>Primero</span>
          </span>
        </button>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[
            { label: "Inicio", id: "home" },
            { label: "Cómo Funciona", id: "how" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                background: page === item.id ? "rgba(255,255,255,0.15)" : "none",
                border: "none", cursor: "pointer",
                color: "#fff", padding: "8px 16px", borderRadius: 6,
                fontSize: 14, fontWeight: 500, transition: "background 0.2s",
              }}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => { setAdminUnlocked(true); setPage("admin"); }}
            style={{
              background: adminUnlocked ? COLORS.amber : "rgba(255,255,255,0.1)",
              border: `1px solid ${adminUnlocked ? COLORS.amber : "rgba(255,255,255,0.3)"}`,
              cursor: "pointer",
              color: adminUnlocked ? COLORS.text : "#fff",
              padding: "8px 16px", borderRadius: 6,
              fontSize: 14, fontWeight: 600,
            }}
          >
            {adminUnlocked ? "⚙️ Admin" : "Iniciar Sesión"}
          </button>
        </div>
      </div>
    </nav>
  );
}
