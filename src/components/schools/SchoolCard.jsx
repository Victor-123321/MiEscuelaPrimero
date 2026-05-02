import { COLORS } from "../../constants/colors";
import ProgressBar from "../ui/ProgressBar";

// Array de IDs reales de Unsplash que son exclusivamente de escuelas/educación
const SCHOOL_STOCK_IDS = [
  "photo-1588072432836-e10032774350", "photo-1519406596751-0a3ccc4937fe",
   "photo-1509062522246-3755977927d7",
  "photo-1497633762265-9d179a990aa6", "photo-1580582932707-520aed937b7b",
  "photo-1541339907198-e08759dfc3ef", "photo-1562774053-701939374585",
  "photo-1516979187457-637abb4f9353", "photo-1503676260728-1c00da094a0b",
  "photo-1524178232363-1fb2b075b655", "photo-1544535830-9df3f56fff6a",
   "photo-1501290741922-b56c0d0884af",
  "photo-1456513080510-7bf3a84b82f8", "photo-1532012197267-da84d127e765",
  "photo-1507537297725-24a19fe4c94b", "photo-1519452635265-7b1fbfd1e4e0",
  "photo-1513542789411-b6a5d4f31634", "photo-1527672809634-04ed36500acd",
  "photo-1577896851231-70ef18881754", "photo-1491841573634-28140fc7ced7"
];

export default function SchoolCard({ school, onClick }) {
  const total = school.needs?.length || 0;
  const score = school.needs?.reduce((s, n) => s + (n.estado === 'Cubierto' ? 1 : n.estado === 'Cubierto parcialmente' ? 0.5 : 0), 0) || 0;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const uncovered = school.needs?.filter(n => n.estado === 'Aun no cubierto').length || 0;

  // Función para obtener una imagen consistente basada en el nombre
  const getPersistentStockImage = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % SCHOOL_STOCK_IDS.length;
    return `https://images.unsplash.com/${SCHOOL_STOCK_IDS[index]}?auto=format&fit=crop&q=80&w=800`;
  };

  const displayImage = school.image || getPersistentStockImage(school.escuela);

  // Categoría más frecuente
  const catCount = {};
  school.needs?.forEach(n => { catCount[n.categoria] = (catCount[n.categoria] || 0) + 1; });
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
        height: "100%"
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,74,153,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,74,153,0.08)"; }}
    >
      <div style={{ position: "relative", height: 170 }}>
        <img 
          src={displayImage} 
          alt={school.escuela} 
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
        />
        
        {/* Overlay para legibilidad */}
        <div style={{ 
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%)",
        }} />

        {/* Badges superiores */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          {primaryCat && (
            <span style={{ background: COLORS.blue, color: "#fff", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>
              {primaryCat}
            </span>
          )}
        </div>

        {school.urgent && (
          <span style={{ position: "absolute", top: 10, right: 10, background: "#e05c5c", color: "#fff", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
            🔥 Urgente
          </span>
        )}

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
            whiteSpace: "nowrap",
          }}>{school.nivel_educativo}</span>
        </div>

        <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.5, marginBottom: 12, margin: "0 0 12px 0" }}>
          {school.direccion?.slice(0, 70)}{school.direccion?.length > 70 ? "…" : ""}
        </p>

        <div style={{ marginBottom: 12, marginTop: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>Progreso</span>
            <span style={{
              fontSize: 12, fontWeight: 800,
              color: pct >= 75 ? COLORS.green : pct >= 40 ? COLORS.amber : "#e05c5c",
            }}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 10, borderTop: "1px solid #eef1f7", gap: 6,
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
