import { COLORS } from "../../constants/colors";
import { CONTRIBUTION_TYPES } from "../../data/mockStats";

export default function ContributeStrip({ onContact }) {
  return (
    <div style={{
      background: "#fff",
      borderTop: `4px solid ${COLORS.green}`,
      borderBottom: "1px solid #e8edf5",
      padding: "32px 20px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
            ¿Cómo puedes ser parte del cambio?
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 14 }}>
            Tu apoyo, en la forma y cantidad que desees, siempre será bienvenido
          </p>
        </div>

        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: 12, justifyContent: "center", marginBottom: 24,
        }}>
          {CONTRIBUTION_TYPES.map(type => (
            <div key={type.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f4f8ff",
              border: `1px solid rgba(0,74,153,0.12)`,
              borderRadius: 12, padding: "12px 20px",
              minWidth: 160, flex: "1 1 160px", maxWidth: 220,
            }}>
              <span style={{ fontSize: 24 }}>{type.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{type.label}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={onContact}
            style={{
              background: COLORS.blue, color: "#fff", border: "none",
              padding: "13px 32px", borderRadius: 10, fontSize: 15,
              fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,74,153,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            ¡Quiero sumarme! →
          </button>
        </div>
      </div>
    </div>
  );
}
