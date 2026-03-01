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
        padding: 24, overflowY: "auto",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Hero image */}
        <div style={{ position: "relative" }}>
          <img src={school.image} alt={school.name} style={{
            width: "100%", height: 220, objectFit: "cover", display: "block",
            borderRadius: "20px 20px 0 0",
          }} />
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer",
            borderRadius: "50%", width: 36, height: 36, color: "#fff", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            padding: "32px 28px 20px",
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ background: COLORS.blue, color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                {school.category}
              </span>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                {school.municipality}
              </span>
              {school.urgent && (
                <span style={{ background: "#e05c5c", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                  🔥 Urgente
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            {school.name}
          </h2>
          <p style={{ color: COLORS.muted, lineHeight: 1.6, marginBottom: 24 }}>
            {school.description}
          </p>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Estudiantes", val: school.students, icon: "👩‍🎓" },
              { label: "Docentes",    val: school.teachers, icon: "👨‍🏫" },
              { label: "Necesidades", val: school.needs.length, icon: "📋" },
            ].map(s => (
              <div key={s.label} style={{
                background: COLORS.gray, borderRadius: 12, padding: "14px 16px", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: COLORS.text }}>{s.val}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Progreso de financiamiento</h3>
              <span style={{ fontWeight: 800, color: COLORS.green, fontSize: 18 }}>{school.funded}%</span>
            </div>
            <ProgressBar pct={school.funded} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: COLORS.muted }}>
                Recaudado: ${(totalCost * school.funded / 100).toLocaleString()}
              </span>
              <span style={{ fontSize: 12, color: "#e05c5c", fontWeight: 600 }}>
                Restante: ${remaining.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Needs table */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
            Desglose de Necesidades
          </h3>
          <div style={{ border: "1px solid #e8edf5", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
            {school.needs.map((n, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto",
                gap: 16, padding: "14px 16px", alignItems: "center",
                borderBottom: i < school.needs.length - 1 ? "1px solid #e8edf5" : "none",
                background: i % 2 === 0 ? "#fff" : COLORS.gray,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{n.item}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{n.model}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, color: COLORS.blue }}>{n.qty}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>unidades</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: COLORS.text }}>${(n.qty * n.unitCost).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>${n.unitCost.toLocaleString()} c/u</div>
                </div>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "14px 16px", background: COLORS.blue,
            }}>
              <span style={{ color: "#fff", fontWeight: 700 }}>Total estimado</span>
              <span style={{ color: COLORS.amber, fontWeight: 800, fontSize: 16 }}>
                ${totalCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onContact}
            style={{
              width: "100%", background: COLORS.green, border: "none", cursor: "pointer",
              borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, color: "#fff",
              boxShadow: `0 6px 20px rgba(120,184,51,0.4)`,
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
