import { COLORS } from "../../constants/colors";
import ProgressBar from "../ui/ProgressBar";

export default function SchoolCard({ school, onClick }) {
  const totalCost = school.needs.reduce((s, n) => s + n.qty * n.unitCost, 0);
  const remaining = totalCost * (1 - school.funded / 100);

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,74,153,0.08)",
        border: "1px solid rgba(0,74,153,0.08)",
        overflow: "hidden", cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,74,153,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,74,153,0.08)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative" }}>
        <img
          src={school.image} alt={school.name}
          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
          <span style={{
            background: COLORS.blue, color: "#fff",
            borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600,
          }}>{school.category}</span>
          {school.urgent && (
            <span style={{
              background: "#e05c5c", color: "#fff",
              borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600,
            }}>🔥 Urgente</span>
          )}
        </div>
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
          borderRadius: 6, padding: "3px 10px",
          color: "#fff", fontSize: 11, fontWeight: 600,
        }}>
          {school.municipality}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
          {school.name}
        </h3>
        <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          {school.description.slice(0, 110)}…
        </p>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>
              Progreso de financiamiento
            </span>
            <span style={{
              fontSize: 12, fontWeight: 800,
              color: school.funded >= 75 ? COLORS.green : school.funded >= 40 ? COLORS.amber : "#e05c5c",
            }}>
              {school.funded}%
            </span>
          </div>
          <ProgressBar pct={school.funded} />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 12, borderTop: "1px solid #eef1f7",
        }}>
          <div style={{ fontSize: 12, color: COLORS.muted }}>
            👩‍🎓 <strong>{school.students}</strong> alumnos · 📚 <strong>{school.needs.length}</strong> necesidades
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.blue }}>
            ${(remaining / 1000).toFixed(0)}k restante
          </div>
        </div>
      </div>
    </div>
  );
}
