import { COLORS } from "../../constants/colors";
import ProgressBar from "../ui/ProgressBar";

export default function SchoolCard({ school, onClick }) {
  const total     = school.needs.length;
  const score     = school.needs.reduce((s, n) => s + (n.estado === 'Cubierto' ? 1 : n.estado === 'Cubierto parcialmente' ? 0.5 : 0), 0);
  const pct       = total > 0 ? Math.round((score / total) * 100) : 0;
  const uncovered = school.needs.filter(n => n.estado === 'Aun no cubierto').length;

  // Most frequent category for the badge
  const catCount = {};
  school.needs.forEach(n => { catCount[n.categoria] = (catCount[n.categoria] || 0) + 1; });
  const primaryCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

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
      {/* Image */}
      <div style={{ position: "relative" }}>
        {school.image
          ? <img src={school.image} alt={school.escuela} style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
          : null
        }
        <div style={{ width: "100%", height: 170, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`, display: school.image ? "none" : "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🏫</div>

        {/* Category badge */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {primaryCat && (
            <span style={{ background: COLORS.blue, color: "#fff", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>
              {primaryCat}
            </span>
          )}
        </div>

        {/* Urgente badge */}
        {school.urgent && (
          <span style={{ position: "absolute", top: 10, right: 10, background: "#e05c5c", color: "#fff", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
            🔥 Urgente
          </span>
        )}

        {/* Municipio chip */}
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          borderRadius: 5, padding: "2px 8px", color: "#fff", fontSize: 10, fontWeight: 600,
        }}>
          {school.municipio}
        </div>
      </div>

      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <h3 style={{ color: COLORS.text, fontSize: 14, fontWeight: 700, lineHeight: 1.3, flex: 1, margin: 0 }}>
            {school.escuela}
          </h3>
          <span style={{
            background: "#f0f4fb", color: COLORS.muted,
            borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600,
            whiteSpace: "nowrap", flexShrink: 0,
          }}>{school.nivel_educativo}</span>
        </div>

        {school.direccion && (
          <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.5, marginBottom: 12, margin: "0 0 12px 0" }}>
            {school.direccion.slice(0, 80)}{school.direccion.length > 80 ? "…" : ""}
          </p>
        )}

        {/* Progress bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>Progreso de necesidades</span>
            <span style={{
              fontSize: 12, fontWeight: 800,
              color: pct >= 75 ? COLORS.green : pct >= 40 ? COLORS.amber : "#e05c5c",
            }}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 10, borderTop: "1px solid #eef1f7", marginTop: "auto",
          flexWrap: "wrap", gap: 6,
        }}>
          <div style={{ fontSize: 11, color: COLORS.muted }}>
            👩‍🎓 <strong>{school.estudiantes}</strong> alumnos
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#e05c5c" }}>
            {uncovered} sin cubrir
          </div>
        </div>
      </div>
    </div>
  );
}
