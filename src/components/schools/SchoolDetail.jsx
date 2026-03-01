import { COLORS } from "../../constants/colors";
import ProgressBar from "../ui/ProgressBar";

export default function SchoolDetail({ school, onClose, onContact }) {
  const totalCost = school.needs.reduce((s, n) => s + n.qty * n.unitCost, 0);
  const remaining = totalCost * (1 - school.funded / 100);

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)", zIndex: 9998,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, overflowY: "auto",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 18, width: "100%", maxWidth: 640,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        maxHeight: "92vh", overflowY: "auto",
      }}>
        {/* Hero image */}
        <div style={{ position: "relative" }}>
          <img src={school.image} alt={school.name} style={{
            width: "100%", height: 200, objectFit: "cover", display: "block",
            borderRadius: "18px 18px 0 0",
          }} />
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer",
            borderRadius: "50%", width: 34, height: 34, color: "#fff", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
            padding: "24px 20px 16px",
          }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ background: COLORS.blue, color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{school.category}</span>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{school.municipality}</span>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{school.type}</span>
              {school.urgent && <span style={{ background: "#e05c5c", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>🔥 Urgente</span>}
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 20px 24px" }}>
          <h2 style={{ color: COLORS.text, fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 800, marginBottom: 8 }}>
            {school.name}
          </h2>
          <p style={{ color: COLORS.muted, lineHeight: 1.6, marginBottom: 20, fontSize: 14 }}>
            {school.description}
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Estudiantes", val: school.students, icon: "👩‍🎓" },
              { label: "Docentes",    val: school.teachers, icon: "👨‍🏫" },
              { label: "Necesidades", val: school.needs.length, icon: "📋" },
            ].map(s => (
              <div key={s.label} style={{
                background: "#f4f6f9", borderRadius: 10, padding: "12px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, marginBottom: 3 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.text }}>{s.val}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Progreso de financiamiento</span>
              <span style={{ fontWeight: 800, color: COLORS.green, fontSize: 16 }}>{school.funded}%</span>
            </div>
            <ProgressBar pct={school.funded} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontSize: 12, color: COLORS.muted }}>Recaudado: ${(totalCost * school.funded / 100).toLocaleString()}</span>
              <span style={{ fontSize: 12, color: "#e05c5c", fontWeight: 600 }}>Pendiente: ${remaining.toLocaleString()}</span>
            </div>
          </div>

          {/* Needs table */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 10 }}>
            Desglose de Necesidades
          </h3>
          <div style={{ border: "1px solid #e8edf5", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
            {school.needs.map((n, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto",
                gap: 12, padding: "12px 14px", alignItems: "center",
                borderBottom: i < school.needs.length - 1 ? "1px solid #e8edf5" : "none",
                background: i % 2 === 0 ? "#fff" : "#f9fafb",
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{n.item}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{n.model}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, color: COLORS.blue, fontSize: 14 }}>{n.qty}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted }}>uds.</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: COLORS.text, fontSize: 13 }}>${(n.qty * n.unitCost).toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted }}>${n.unitCost.toLocaleString()} c/u</div>
                </div>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "12px 14px", background: COLORS.blue,
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Total estimado</span>
              <span style={{ color: COLORS.amber, fontWeight: 800, fontSize: 15 }}>${totalCost.toLocaleString()}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onContact}
            style={{
              width: "100%", background: COLORS.green, border: "none", cursor: "pointer",
              borderRadius: 12, padding: "15px", fontSize: 16, fontWeight: 700, color: "#fff",
              boxShadow: "0 6px 20px rgba(120,184,51,0.4)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            💚 Apoyar a esta escuela
          </button>
        </div>
      </div>
    </div>
  );
}
