import { useState } from "react";
import { COLORS } from "../../constants/colors";
import { MUNICIPALITIES, CATEGORIAS, NIVELES } from "../../data/mockSchools";
import FilterSection from "../ui/FilterSection";

export default function Sidebar({ filters, setFilters }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  };

  const activeCount =
    filters.municipios.length + filters.categorias.length + filters.niveles.length;

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid rgba(0,74,153,0.08)",
      boxShadow: "0 2px 12px rgba(0,74,153,0.06)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: "100%", background: COLORS.blue, border: "none", cursor: "pointer",
          padding: "12px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>🔍 Filtros</span>
          {activeCount > 0 && (
            <span style={{
              background: COLORS.amber, color: COLORS.text,
              borderRadius: 100, padding: "1px 8px", fontSize: 11, fontWeight: 700,
            }}>{activeCount}</span>
          )}
        </div>
        <span style={{
          color: "#fff", fontSize: 18,
          transition: "transform 0.2s",
          transform: collapsed ? "rotate(90deg)" : "rotate(-90deg)",
          display: "inline-block",
        }}>›</span>
      </button>

      {!collapsed && (
        <div style={{ padding: 16 }}>
          {activeCount > 0 && (
            <button
              onClick={() => setFilters({ municipios: [], categorias: [], niveles: [] })}
              style={{
                width: "100%", background: "#fee8e8", border: "1px solid #fbbaba",
                borderRadius: 8, padding: "7px", cursor: "pointer",
                color: "#c0392b", fontSize: 12, fontWeight: 600, marginBottom: 14,
              }}
            >
              ✕ Limpiar {activeCount} filtro{activeCount > 1 ? "s" : ""}
            </button>
          )}
          <FilterSection title="Municipio" options={MUNICIPALITIES} selected={filters.municipios} toggle={v => toggle("municipios", v)} />
          <FilterSection title="Categoría de necesidad" options={CATEGORIAS} selected={filters.categorias} toggle={v => toggle("categorias", v)} />
          <FilterSection title="Nivel educativo" options={NIVELES} selected={filters.niveles} toggle={v => toggle("niveles", v)} />
        </div>
      )}
    </div>
  );
}
