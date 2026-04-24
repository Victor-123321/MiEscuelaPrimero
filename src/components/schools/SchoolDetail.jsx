import { COLORS } from "../../constants/colors";
import ProgressBar from "../ui/ProgressBar";

const ESTADO_STYLES = {
  "Cubierto":              { background: "#e8f5e0", color: "#2d7a1f" },
  "Aun no cubierto":       { background: "#fee8e8", color: "#c0392b" },
  "Cubierto parcialmente": { background: "#fff3e0", color: "#b7580c" },
};

export default function SchoolDetail({ school, onClose, onContact }) {
  const total = school.needs.length;
  const score = school.needs.reduce((s, n) => s + (n.estado === 'Cubierto' ? 1 : n.estado === 'Cubierto parcialmente' ? 0.5 : 0), 0);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const catCount = {};
  school.needs.forEach(n => { catCount[n.categoria] = (catCount[n.categoria] || 0) + 1; });
  const primaryCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

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
          <img src={school.image} alt={school.escuela} style={{
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
              <span style={{ background: COLORS.blue, color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{primaryCat}</span>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{school.municipio}</span>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{school.nivel_educativo}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 20px 24px" }}>
          <h2 style={{ color: COLORS.text, fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 800, marginBottom: 8 }}>
            {school.escuela}
          </h2>

          {/* Metadata pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {[
              { label: `CCT: ${school.cct}` },
              { label: school.modalidad },
              { label: school.turno },
              { label: school.sostenimiento },
            ].map(m => (
              <span key={m.label} style={{
                background: "#f0f4fb", color: COLORS.muted,
                borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 600,
              }}>{m.label}</span>
            ))}
          </div>

          <p style={{ color: COLORS.muted, lineHeight: 1.6, marginBottom: 4, fontSize: 13 }}>
            📍 {school.direccion}
          </p>
          <a
            href={school.ubicacion}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 13, color: COLORS.blue, fontWeight: 600, display: "inline-block", marginBottom: 20 }}
          >
            Ver ubicación →
          </a>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Estudiantes",  val: school.estudiantes,     icon: "👩‍🎓" },
              { label: "Personal",     val: school.personal_escolar, icon: "👨‍🏫" },
              { label: "Necesidades",  val: school.needs.length,     icon: "📋" },
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
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Progreso de necesidades</span>
              <span style={{ fontWeight: 800, color: COLORS.green, fontSize: 16 }}>{pct}%</span>
            </div>
            <ProgressBar pct={pct} />
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
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{n.propuesta}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{n.subcategoria}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, color: COLORS.blue, fontSize: 14 }}>{n.cantidad}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted }}>{n.unidad}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600,
                    ...(ESTADO_STYLES[n.estado] || { background: "#f0f4fb", color: COLORS.muted }),
                  }}>{n.estado}</span>
                </div>
              </div>
            ))}
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
