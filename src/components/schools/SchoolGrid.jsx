import { COLORS } from "../../constants/colors";
import SchoolCard from "./SchoolCard";

export default function SchoolGrid({ schools, onSelect }) {
  if (schools.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", color: COLORS.muted }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
        <h3 style={{ fontSize: 18, color: COLORS.text, marginBottom: 6 }}>Sin resultados</h3>
        <p style={{ fontSize: 14 }}>Prueba con otros filtros o términos de búsqueda.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 20,
    }}>
      {schools.map(school => (
        <SchoolCard key={school.id} school={school} onClick={() => onSelect(school)} />
      ))}
    </div>
  );
}
