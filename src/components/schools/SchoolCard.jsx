import { COLORS } from "../../constants/colors";
import ProgressBar from "../ui/ProgressBar";

const ESTADO_COLOR = {
  "Cubierto":              { bg: "#e8f5e0", color: "#2d7a1f" },
  "Cubierto parcialmente": { bg: "#fff3e0", color: "#b35c00" },
  "Aun no cubierto":       { bg: "#fee8e8", color: "#c0392b" },
};

export default function SchoolCard({ school, onClick }) {
  const totalNeeds    = school.needs.length;
  const cubiertos     = school.needs.filter(n => n.estado === "Cubierto").length;
  const noCubiertos   = school.needs.filter(n => n.estado === "Aun no cubierto").length;
  const categories    = school.categories?.length ? school.categories : school.category ? [school.category] : [];

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 14,
        boxShadow: "0 2px 12px rgba(0,74,153,0.08)",
        border: "1px solid rgba(0,74,153,0.08)",
        overflow: "hidden", cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,74,153,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,74,153,0.08)"; }}
    >
      {/* Image or placeholder */}
      <div style={{ position: "relative", height: 160, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`, overflow: "hidden" }}>
        {school.image
          ? <img src={school.image} alt={school.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🏫</div>
        }
        {/* Category badges */}
        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4, flexWrap: "wrap", maxWidth: "calc(100% - 16px)" }}>
          {categories.slice(0, 2).map(cat => (
            <span key={cat} style={{ background: COLORS.blue, color: "#fff", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700 }}>
              {cat}
            </span>
          ))}
          {categories.length > 2 && (
            <span style={{ background: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700 }}>
              +{categories.length - 2}
            </span>
          )}
        </div>
        {school.urgent && (
          <span style={{ position: "absolute", top: 8, right: 8, background: "#e05c5c", color: "#fff", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
            🔥 Urgente
          </span>
        )}
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          borderRadius: 5, padding: "2px 8px", color: "#fff", fontSize: 10, fontWeight: 600,
        }}>
          {school.municipality}
        </div>
      </div>

      <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
            <h3 style={{ color: COLORS.text, fontSize: 14, fontWeight: 700, lineHeight: 1.3, flex: 1, margin: 0 }}>
              {school.name}
            </h3>
            {school.type && (
              <span style={{ background: "#f0f4fb", color: COLORS.muted, borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                {school.type}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600 }}>Necesidades cubiertas</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: school.funded >= 75 ? COLORS.green : school.funded >= 40 ? COLORS.amber : "#e05c5c" }}>
              {school.funded}%
            </span>
          </div>
          <ProgressBar pct={school.funded} />
        </div>

        {/* Needs summary badges */}
        {totalNeeds > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
            {cubiertos > 0 && (
              <span style={{ ...ESTADO_COLOR["Cubierto"], borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>
                ✓ {cubiertos} cubiertas
              </span>
            )}
            {noCubiertos > 0 && (
              <span style={{ ...ESTADO_COLOR["Aun no cubierto"], borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>
                ✗ {noCubiertos} pendientes
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #eef1f7", marginTop: "auto" }}>
          <span style={{ fontSize: 11, color: COLORS.muted }}>
            👩‍🎓 <strong>{school.students}</strong> alumnos
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.blue }}>
            {totalNeeds} necesidad{totalNeeds !== 1 ? "es" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
