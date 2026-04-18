import { COLORS } from "../../constants/colors";
import ProgressBar from "../ui/ProgressBar";

const ESTADO_STYLE = {
  "Cubierto":              { bg: "#e8f5e0", color: "#2d7a1f", icon: "✅" },
  "Cubierto parcialmente": { bg: "#fff3e0", color: "#b35c00", icon: "⚠️" },
  "Aun no cubierto":       { bg: "#fee8e8", color: "#c0392b", icon: "❌" },
};

function NeedsTable({ needs }) {
  // Group by categoria
  const grouped = needs.reduce((acc, n) => {
    const cat = n.categoria || "Sin categoría";
    if (!acc[cat]) acc[cat] = {};
    const sub = n.subcategoria || "General";
    if (!acc[cat][sub]) acc[cat][sub] = [];
    acc[cat][sub].push(n);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([cat, subs]) => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <div style={{
            background: COLORS.blue, color: "#fff",
            padding: "6px 12px", borderRadius: "8px 8px 0 0",
            fontSize: 12, fontWeight: 700,
          }}>
            {cat}
          </div>
          {Object.entries(subs).map(([sub, items]) => (
            <div key={sub}>
              {sub !== "General" && (
                <div style={{ background: "#f0f4fb", padding: "5px 12px", fontSize: 11, color: COLORS.muted, fontWeight: 600, borderLeft: `3px solid ${COLORS.blue}` }}>
                  {sub}
                </div>
              )}
              {items.map((n, i) => {
                const estStyle = ESTADO_STYLE[n.estado] ?? { bg: "#f0f4fb", color: COLORS.muted, icon: "•" };
                return (
                  <div key={n.id ?? i} style={{
                    display: "grid", gridTemplateColumns: "1fr auto auto",
                    gap: 10, padding: "10px 12px", alignItems: "center",
                    borderBottom: "1px solid #f0f4fb",
                    background: i % 2 === 0 ? "#fff" : "#fafbff",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{n.propuesta}</div>
                      {n.detalles && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{n.detalles}</div>}
                    </div>
                    <div style={{ textAlign: "center", minWidth: 60 }}>
                      {n.cantidad != null && n.cantidad !== 0 && (
                        <>
                          <div style={{ fontWeight: 700, color: COLORS.blue, fontSize: 14 }}>
                            {Number.isInteger(n.cantidad) ? n.cantidad : n.cantidad.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 10, color: COLORS.muted }}>{n.unidad}</div>
                        </>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        ...estStyle, borderRadius: 5, padding: "3px 8px",
                        fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                      }}>
                        {estStyle.icon} {n.estado || "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function SchoolDetail({ school, onClose, onContact }) {
  const totalNeeds  = school.needs.length;
  const cubiertos   = school.needs.filter(n => n.estado === "Cubierto").length;
  const pendientes  = school.needs.filter(n => n.estado === "Aun no cubierto").length;
  const categories  = school.categories?.length ? school.categories : school.category ? [school.category] : [];

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
        background: "#fff", borderRadius: 18, width: "100%", maxWidth: 680,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        maxHeight: "92vh", overflowY: "auto",
      }}>
        {/* Hero */}
        <div style={{ position: "relative", background: `linear-gradient(135deg, ${COLORS.blueDark}, ${COLORS.blue})`, borderRadius: "18px 18px 0 0", minHeight: 140, display: "flex", alignItems: "flex-end" }}>
          {school.image && (
            <img src={school.image} alt={school.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "18px 18px 0 0", opacity: 0.4 }} />
          )}
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer",
            borderRadius: "50%", width: 34, height: 34, color: "#fff", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2,
          }}>✕</button>
          <div style={{ padding: "20px 20px 16px", position: "relative", zIndex: 1, width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
              {categories.map(c => (
                <span key={c} style={{ background: COLORS.green, color: "#fff", borderRadius: 5, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{c}</span>
              ))}
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 5, padding: "2px 9px", fontSize: 11, fontWeight: 600 }}>{school.municipality}</span>
              {school.type && <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 5, padding: "2px 9px", fontSize: 11 }}>{school.type}</span>}
              {school.urgent && <span style={{ background: "#e05c5c", color: "#fff", borderRadius: 5, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>🔥 Urgente</span>}
            </div>
            <h2 style={{ color: "#fff", fontSize: "clamp(18px,3vw,22px)", fontWeight: 800, margin: 0 }}>{school.name}</h2>
          </div>
        </div>

        <div style={{ padding: "20px 20px 24px" }}>
          {school.description && (
            <p style={{ color: COLORS.muted, lineHeight: 1.6, marginBottom: 18, fontSize: 14 }}>{school.description}</p>
          )}

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
            {[
              { label: "Alumnos",    val: school.students, icon: "👩‍🎓" },
              { label: "Docentes",   val: school.teachers, icon: "👨‍🏫" },
              { label: "Cubiertos",  val: cubiertos,        icon: "✅" },
              { label: "Pendientes", val: pendientes,       icon: "❌" },
            ].map(s => (
              <div key={s.label} style={{ background: "#f4f6f9", borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.text }}>{s.val}</div>
                <div style={{ fontSize: 10, color: COLORS.muted }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Necesidades cubiertas</span>
              <span style={{ fontWeight: 800, color: COLORS.green, fontSize: 15 }}>{school.funded}%</span>
            </div>
            <ProgressBar pct={school.funded} />
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
              {cubiertos} de {totalNeeds} necesidades están cubiertas
            </div>
          </div>

          {/* Needs grouped table */}
          {totalNeeds > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 10 }}>
                Listado de Necesidades
              </h3>
              <div style={{ border: "1px solid #e8edf5", borderRadius: 10, overflow: "hidden" }}>
                <NeedsTable needs={school.needs} />
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onContact}
            style={{
              width: "100%", background: COLORS.green, border: "none", cursor: "pointer",
              borderRadius: 12, padding: "15px", fontSize: 16, fontWeight: 700, color: "#fff",
              boxShadow: "0 6px 20px rgba(120,184,51,0.4)", transition: "transform 0.2s",
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
