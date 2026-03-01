import { COLORS } from "../../constants/colors";
import SchoolCard from "./SchoolCard";

export default function SchoolGrid({ schools, onSelect }) {
  if (schools.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px", color: COLORS.muted }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h3 style={{ fontSize: 20, color: COLORS.text }}>Sin resultados</h3>
        <p>Prueba con otros filtros o términos de búsqueda.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 24,
    }}>
      {schools.map(school => (
        <SchoolCard key={school.id} school={school} onClick={() => onSelect(school)} />
      ))}
    </div>
  );
}
