import { useState } from "react";
import { COLORS } from "../constants/colors";
import { MOCK_SCHOOLS } from "../data/mockSchools";
import { FOOTER_STEPS } from "../data/mockStats";
import ProgressBar from "../components/ui/ProgressBar";
import Toast from "../components/ui/Toast";

const TABS = [
  { id: "upload",  label: "📤 Carga de Archivo" },
  { id: "stats",   label: "📊 Estadísticas" },
  { id: "footer",  label: "📝 Contenido Footer" },
  { id: "schools", label: "🏫 Escuelas" },
];

export default function AdminPage({ stats, setStats }) {
  const [activeTab, setActiveTab]     = useState("upload");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [localStats, setLocalStats]   = useState({ ...stats });
  const [footerSteps, setFooterSteps] = useState([...FOOTER_STEPS]);
  const [toast, setToast]             = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{
            background: COLORS.amber, borderRadius: 10, width: 44, height: 44,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>⚙️</div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.text }}>Panel de Administración</h1>
            <p style={{ color: COLORS.muted, fontSize: 14 }}>Mi Escuela Primero — Gestión de Contenidos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 28, overflowX: "auto",
        borderBottom: "2px solid #e8edf5",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 20px", fontSize: 14, fontWeight: 600,
            color: activeTab === t.id ? COLORS.blue : COLORS.muted,
            borderBottom: `2px solid ${activeTab === t.id ? COLORS.blue : "transparent"}`,
            marginBottom: -2, whiteSpace: "nowrap", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Upload Tab ─────────────────────────────────────── */}
      {activeTab === "upload" && (
        <div>
          <div
            style={{
              border: "2px dashed #c8d0e0", borderRadius: 16, padding: "48px",
              textAlign: "center", background: "#fafbff",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = COLORS.blue; e.currentTarget.style.background = "#f0f4ff"; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = "#c8d0e0"; e.currentTarget.style.background = "#fafbff"; }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
              Carga el Archivo Maestro
            </h3>
            <p style={{ color: COLORS.muted, marginBottom: 24 }}>
              Arrastra aquí tu archivo Excel (.xlsx) o CSV, o haz clic para seleccionar
            </p>
            <input
              type="file" accept=".xlsx,.csv" id="fileInput" style={{ display: "none" }}
              onChange={e => {
                if (e.target.files[0]) {
                  setUploadStatus("processing");
                  setTimeout(() => {
                    setUploadStatus("success");
                    showToast("Archivo procesado: 6 escuelas actualizadas exitosamente");
                  }, 1800);
                }
              }}
            />
            <label htmlFor="fileInput" style={{
              display: "inline-block",
              background: COLORS.blue, color: "#fff",
              padding: "12px 28px", borderRadius: 10, cursor: "pointer",
              fontWeight: 700, fontSize: 15,
              boxShadow: "0 4px 16px rgba(0,74,153,0.3)",
            }}>
              {uploadStatus === "processing" ? "⏳ Procesando…" : "Seleccionar Archivo"}
            </label>

            {uploadStatus === "success" && (
              <div style={{
                marginTop: 24, background: "#e8f5e0", border: "1px solid #a8d88a",
                borderRadius: 12, padding: "16px 24px", textAlign: "left",
              }}>
                <div style={{ fontWeight: 700, color: "#2d7a1f", marginBottom: 8 }}>
                  ✅ Archivo procesado exitosamente
                </div>
                <div style={{ fontSize: 13, color: "#4a7a3a" }}>
                  • 6 escuelas actualizadas · 3 nuevas necesidades detectadas · 1 escuela marcada urgente
                </div>
              </div>
            )}
          </div>

          {/* Format reference table */}
          <div style={{ marginTop: 24, background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e8edf5" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
              Formato del Archivo Maestro
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: COLORS.blue }}>
                    {["Columna", "Tipo", "Ejemplo", "Requerido"].map(h => (
                      <th key={h} style={{ color: "#fff", padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["nombre_escuela",    "Texto",          "Escuela Primaria Benito Juárez", "✅"],
                    ["municipio",         "Texto",          "Monterrey",                      "✅"],
                    ["categoria",         "Texto",          "Tecnología",                     "✅"],
                    ["tipo_institucion",  "Texto",          "Pública",                        "✅"],
                    ["descripcion",       "Texto largo",    "Esta escuela necesita…",         "✅"],
                    ["porcentaje_fondeo", "Número (0-100)", "62",                             "✅"],
                    ["estudiantes",       "Número",         "320",                            "❌"],
                    ["maestros",          "Número",         "12",                             "❌"],
                    ["urgente",           "Booleano",       "true/false",                     "❌"],
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : COLORS.gray }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: "10px 14px", borderBottom: "1px solid #e8edf5",
                          fontFamily: j === 0 ? "monospace" : "inherit",
                          color: j === 0 ? COLORS.blue : COLORS.text,
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => showToast("Plantilla CSV descargada")}
              style={{
                marginTop: 16, background: COLORS.gray, border: "1px solid #dde3f0",
                borderRadius: 8, padding: "10px 20px", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: COLORS.blue,
              }}
            >
              📥 Descargar Plantilla CSV
            </button>
          </div>
        </div>
      )}

      {/* ── Stats Tab ──────────────────────────────────────── */}
      {activeTab === "stats" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>
            Estadísticas del Hero Section
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { key: "schools",     label: "Escuelas Beneficiadas", icon: "🏫" },
              { key: "students",    label: "Estudiantes Alcanzados", icon: "👩‍🎓" },
              { key: "activeNeeds", label: "Necesidades Activas",    icon: "📋" },
              { key: "teachers",   label: "Maestros Impactados",    icon: "👨‍🏫" },
            ].map(f => (
              <div key={f.key} style={{ background: "#fff", border: "1px solid #e8edf5", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 8 }}>
                  {f.label}
                </label>
                <input
                  type="number"
                  value={localStats[f.key]}
                  onChange={e => setLocalStats(s => ({ ...s, [f.key]: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: "100%", border: "2px solid #dde3f0", borderRadius: 8,
                    padding: "10px 12px", fontSize: 20, fontWeight: 800,
                    color: COLORS.blue, outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = COLORS.blue)}
                  onBlur={e => (e.target.style.borderColor = "#dde3f0")}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => { setStats(localStats); showToast("Estadísticas actualizadas en la página principal"); }}
            style={{
              marginTop: 24, background: COLORS.green, border: "none", cursor: "pointer",
              borderRadius: 10, padding: "13px 32px", fontSize: 15, fontWeight: 700, color: "#fff",
              boxShadow: "0 4px 16px rgba(120,184,51,0.35)",
            }}
          >
            💾 Guardar Cambios
          </button>
        </div>
      )}

      {/* ── Footer Tab ─────────────────────────────────────── */}
      {activeTab === "footer" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>
            Editar Pasos "¿Qué Sigue?"
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {footerSteps.map((step, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e8edf5", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{step.icon}</span>
                  <span style={{
                    background: COLORS.blue, color: "#fff",
                    borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700,
                  }}>Paso {i + 1}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 6 }}>Título</label>
                    <input
                      value={step.title}
                      onChange={e => setFooterSteps(steps => steps.map((s, j) => j === i ? { ...s, title: e.target.value } : s))}
                      style={{ width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 6 }}>Descripción</label>
                    <input
                      value={step.desc}
                      onChange={e => setFooterSteps(steps => steps.map((s, j) => j === i ? { ...s, desc: e.target.value } : s))}
                      style={{ width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast("Contenido del footer actualizado")}
            style={{
              marginTop: 24, background: COLORS.green, border: "none", cursor: "pointer",
              borderRadius: 10, padding: "13px 32px", fontSize: 15, fontWeight: 700, color: "#fff",
            }}
          >
            💾 Guardar Footer
          </button>
        </div>
      )}

      {/* ── Schools Tab ────────────────────────────────────── */}
      {activeTab === "schools" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>
            Gestión de Escuelas ({MOCK_SCHOOLS.length} registradas)
          </h3>
          <div style={{ border: "1px solid #e8edf5", borderRadius: 14, overflow: "hidden" }}>
            {MOCK_SCHOOLS.map((school, i) => (
              <div key={school.id} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto auto",
                gap: 16, padding: "16px 20px", alignItems: "center",
                borderBottom: i < MOCK_SCHOOLS.length - 1 ? "1px solid #e8edf5" : "none",
                background: i % 2 === 0 ? "#fff" : COLORS.gray,
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{school.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{school.municipality} · {school.category}</div>
                </div>
                <div style={{ width: 100 }}>
                  <ProgressBar pct={school.funded} />
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 3, textAlign: "center" }}>{school.funded}%</div>
                </div>
                {school.urgent && (
                  <span style={{ background: "#fee8e8", color: "#c0392b", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>
                    Urgente
                  </span>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => showToast(`Editando: ${school.name}`)}
                    style={{
                      background: COLORS.blue, color: "#fff", border: "none", cursor: "pointer",
                      borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                    }}
                  >Editar</button>
                  <button
                    onClick={() => showToast("Acción de eliminar (simulada)", "error")}
                    style={{
                      background: "#fee8e8", color: "#c0392b", border: "none", cursor: "pointer",
                      borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                    }}
                  >Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
