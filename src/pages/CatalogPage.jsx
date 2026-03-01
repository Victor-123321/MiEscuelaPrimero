import { useState } from "react";
import { COLORS } from "../constants/colors";
import { MOCK_SCHOOLS } from "../data/mockSchools";
import { INITIAL_STATS } from "../data/mockStats";
import StatCard from "../components/ui/StatCard";
import Sidebar from "../components/layout/Sidebar";
import SchoolGrid from "../components/schools/SchoolGrid";
import SchoolDetail from "../components/schools/SchoolDetail";
import LeadForm from "../components/forms/LeadForm";

function Hero({ stats }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${COLORS.blueDark} 0%, ${COLORS.blue} 60%, #0a5bbf 100%)`,
      padding: "60px 24px 80px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 400, height: 400, borderRadius: "50%",
        background: "rgba(120,184,51,0.08)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -120, left: -60,
        width: 300, height: 300, borderRadius: "50%",
        background: "rgba(245,166,35,0.06)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(120,184,51,0.2)",
            border: `1px solid ${COLORS.green}`,
            borderRadius: 100, padding: "6px 20px",
            color: COLORS.greenLight, fontSize: 13, fontWeight: 600,
            letterSpacing: "0.05em", marginBottom: 20,
          }}>
            🌱 Programa de Impacto Social — Jalisco
          </div>
          <h1 style={{
            color: "#fff", fontSize: "clamp(32px, 5vw, 54px)",
            fontFamily: "'Georgia', serif", fontWeight: 700,
            lineHeight: 1.15, marginBottom: 16, letterSpacing: "-1px",
          }}>
            Juntos transformamos<br />
            <span style={{ color: COLORS.amber }}>la educación</span> en Jalisco
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.75)", fontSize: 18, maxWidth: 600,
            margin: "0 auto 32px", lineHeight: 1.6,
          }}>
            Conectamos a empresas y personas con las necesidades reales de escuelas primarias públicas.
            Cada donativo genera un impacto medible y transparente.
          </p>
          <button
            onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: COLORS.green, color: "#fff", border: "none",
              padding: "14px 32px", borderRadius: 10, fontSize: 16,
              fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(120,184,51,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(120,184,51,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(120,184,51,0.4)"; }}
          >
            Ver Catálogo de Necesidades →
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}>
          <StatCard value={stats.schools}      label="Escuelas Beneficiadas" icon="🏫" color={COLORS.greenLight} />
          <StatCard value={stats.students}     label="Estudiantes Alcanzados" icon="👩‍🎓" color={COLORS.amber} />
          <StatCard value={stats.activeNeeds}  label="Necesidades Activas"    icon="📋" color="#fff" />
          <StatCard value={stats.teachers}     label="Maestros Impactados"    icon="👨‍🏫" color={COLORS.greenLight} />
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [filters, setFilters] = useState({ municipalities: [], categories: [], types: [] });
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showLead, setShowLead] = useState(false);
  const stats = INITIAL_STATS;

  const filtered = MOCK_SCHOOLS.filter(s => {
    if (filters.municipalities.length && !filters.municipalities.includes(s.municipality)) return false;
    if (filters.categories.length && !filters.categories.includes(s.category)) return false;
    if (filters.types.length && !filters.types.includes(s.type)) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Hero stats={stats} />

      <div id="catalog" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* Search bar */}
        <div style={{ marginBottom: 28, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔎</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Busca por nombre de escuela o descripción…"
              style={{
                width: "100%", padding: "13px 16px 13px 44px",
                border: "2px solid #dde3f0", borderRadius: 10, fontSize: 15,
                outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = COLORS.blue)}
              onBlur={e => (e.target.style.borderColor = "#dde3f0")}
            />
          </div>
          <div style={{ color: COLORS.muted, fontSize: 14, whiteSpace: "nowrap" }}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 80 }}>
            <Sidebar filters={filters} setFilters={setFilters} />
          </div>
          <SchoolGrid schools={filtered} onSelect={setSelectedSchool} />
        </div>
      </div>

      {selectedSchool && (
        <SchoolDetail
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
          onContact={() => setShowLead(true)}
        />
      )}
      {showLead && (
        <LeadForm
          school={selectedSchool}
          onClose={() => { setShowLead(false); setSelectedSchool(null); }}
        />
      )}
    </>
  );
}
