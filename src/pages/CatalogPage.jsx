import { useState } from "react";
import { COLORS } from "../constants/colors";
import { MOCK_SCHOOLS } from "../data/mockSchools";
import { INITIAL_STATS } from "../data/mockStats";
import StatCard from "../components/ui/StatCard";
import ContributeStrip from "../components/ui/ContributeStrip";
import Sidebar from "../components/layout/Sidebar";
import SchoolGrid from "../components/schools/SchoolGrid";
import SchoolDetail from "../components/schools/SchoolDetail";
import LeadForm from "../components/forms/LeadForm";

// ── Hero ──────────────────────────────────────────────────────────────────
function Hero({ stats }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${COLORS.blueDark} 0%, ${COLORS.blue} 60%, #0a5bbf 100%)`,
      padding: "clamp(36px, 6vw, 64px) 20px clamp(48px, 7vw, 80px)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(120,184,51,0.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(245,166,35,0.05)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(28px, 5vw, 48px)" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(120,184,51,0.2)",
            border: `1px solid ${COLORS.green}`,
            borderRadius: 100, padding: "5px 18px",
            color: COLORS.greenLight, fontSize: 12, fontWeight: 600,
            letterSpacing: "0.05em", marginBottom: 18,
          }}>
            🌱 Mexicanos Primero Jalisco
          </div>

          {/* Real tagline from the PDF */}
          <h1 style={{
            color: "#fff", fontSize: "clamp(28px, 5vw, 52px)",
            fontFamily: "'Georgia', serif", fontWeight: 700,
            lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.5px",
          }}>
            Tu aporte,{" "}
            <span style={{ color: COLORS.amber }}>su futuro</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.8)", fontSize: "clamp(15px, 2vw, 18px)",
            maxWidth: 580, margin: "0 auto 10px", lineHeight: 1.6, fontStyle: "italic",
          }}>
            Como a ti, nos inspira poder transformar vidas con una mejor educación.
          </p>
          <p style={{
            color: "rgba(255,255,255,0.6)", fontSize: 13,
            maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.6,
          }}>
            Mejoramos las condiciones educativas de escuelas públicas en contextos vulnerables
            a través de la atención de necesidades prioritarias — con el apoyo de aliados como tú.
          </p>

          <button
            onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: COLORS.green, color: "#fff", border: "none",
              padding: "13px 28px", borderRadius: 10, fontSize: 15,
              fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(120,184,51,0.4)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Ver necesidades de las escuelas →
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
        }}>
          <StatCard value={stats.schools}     label="Escuelas apoyadas"      icon="🏫" color={COLORS.greenLight} />
          <StatCard value={stats.students}    label="Estudiantes alcanzados"  icon="👩‍🎓" color={COLORS.amber} />
          <StatCard value={stats.activeNeeds} label="Necesidades activas"     icon="📋" color="#fff" />
          <StatCard value={stats.teachers}    label="Maestros impactados"     icon="👨‍🏫" color={COLORS.greenLight} />
        </div>
      </div>
    </div>
  );
}

// ── CatalogPage ───────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [filters, setFilters]           = useState({ municipios: [], categorias: [], niveles: [] });
  const [search, setSearch]             = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showLead, setShowLead]         = useState(false);

  const filtered = MOCK_SCHOOLS.filter(s => {
    if (filters.municipios.length && !filters.municipios.includes(s.municipio)) return false;
    if (filters.categorias.length && !s.needs.some(n => filters.categorias.includes(n.categoria))) return false;
    if (filters.niveles.length && !filters.niveles.includes(s.nivel_educativo)) return false;
    if (search && !s.escuela.toLowerCase().includes(search.toLowerCase()) &&
        !s.municipio.toLowerCase().includes(search.toLowerCase()) &&
        !s.needs.some(n => n.propuesta.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const openLead = (school = null) => {
    if (school) setSelectedSchool(school);
    setShowLead(true);
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .catalog-layout { grid-template-columns: 1fr !important; }
          .sidebar-sticky { position: static !important; }
        }
      `}</style>

      <Hero stats={INITIAL_STATS} />

      {/* Contribute strip — visible immediately below hero */}
      <ContributeStrip onContact={() => openLead(null)} />

      <div id="catalog" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* Search bar */}
        <div style={{ marginBottom: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔎</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Busca escuela, municipio o necesidad…"
              style={{
                width: "100%", padding: "12px 14px 12px 40px",
                border: "2px solid #dde3f0", borderRadius: 10, fontSize: 14,
                outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = COLORS.blue)}
              onBlur={e => (e.target.style.borderColor = "#dde3f0")}
            />
          </div>
          <div style={{ color: COLORS.muted, fontSize: 13, whiteSpace: "nowrap" }}>
            {filtered.length} escuela{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Main layout — sidebar + grid */}
        <div className="catalog-layout" style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 24, alignItems: "start",
        }}>
          <div className="sidebar-sticky" style={{ position: "sticky", top: 76 }}>
            <Sidebar filters={filters} setFilters={setFilters} />
          </div>
          <SchoolGrid schools={filtered} onSelect={setSelectedSchool} />
        </div>
      </div>

      {selectedSchool && !showLead && (
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
