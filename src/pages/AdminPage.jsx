import { useState, useEffect } from "react";
import { COLORS } from "../constants/colors";
import { FOOTER_STEPS } from "../data/mockStats";
import ProgressBar from "../components/ui/ProgressBar";
import Toast from "../components/ui/Toast";
import {
  getStats, updateStat,
  getFooterContent, updateFooterContent,
  uploadSchoolsFile, getUploadHistory,
  listSchools, deleteSchool,
  listLeads, updateLeadStatus,
} from "../services/api";

const TABS = [
  { id: "upload",  label: "📤 Carga de Archivo" },
  { id: "leads",   label: "📬 Solicitudes" },
  { id: "schools", label: "🏫 Escuelas" },
  { id: "stats",   label: "📊 Estadísticas" },
  { id: "footer",  label: "📝 Footer" },
];

const STATUS_LABELS = {
  nuevo:      { label: "Nuevo",      bg: "#e8f0fe", color: "#1a56db" },
  contactado: { label: "Contactado", bg: "#fff3e0", color: "#b35c00" },
  completado: { label: "Completado", bg: "#e8f5e0", color: "#2d7a1f" },
  cancelado:  { label: "Cancelado",  bg: "#fee8e8", color: "#c0392b" },
};

function normalizeSchool(s) {
  return { id: s.id, name: s.name, municipality: s.municipality, category: s.category, funded: parseFloat(s.funding_pct ?? 0), urgent: s.urgent ?? false };
}

export default function AdminPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [toast, setToast]         = useState(null);

  // Upload
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);

  // Leads
  const [leads, setLeads]         = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Schools
  const [schools, setSchools]     = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  // Stats
  const [rawStats, setRawStats]   = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsSaving, setStatsSaving] = useState({});

  // Footer
  const [footerData, setFooterData] = useState(null);
  const [footerLoading, setFooterLoading] = useState(false);
  const [footerSaving, setFooterSaving] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (activeTab === "leads")   loadLeads();
    if (activeTab === "schools") loadSchools();
    if (activeTab === "stats")   loadStats();
    if (activeTab === "footer")  loadFooter();
    if (activeTab === "upload")  loadUploadHistory();
  }, [activeTab]);

  async function loadLeads() {
    setLeadsLoading(true);
    try { const { leads: l } = await listLeads({ limit: 100 }); setLeads(l); }
    catch (err) { showToast("Error cargando solicitudes: " + err.message, "error"); }
    finally { setLeadsLoading(false); }
  }
  async function loadSchools() {
    setSchoolsLoading(true);
    try { const { schools: raw } = await listSchools({ limit: 100 }); setSchools(raw.map(normalizeSchool)); }
    catch (err) { showToast("Error cargando escuelas: " + err.message, "error"); }
    finally { setSchoolsLoading(false); }
  }
  async function loadStats() {
    setStatsLoading(true);
    try { setRawStats(await getStats()); }
    catch (err) { showToast("Error cargando estadísticas: " + err.message, "error"); }
    finally { setStatsLoading(false); }
  }
  async function loadFooter() {
    setFooterLoading(true);
    try { setFooterData(await getFooterContent()); }
    catch {
      const mock = {};
      FOOTER_STEPS.forEach((s, i) => { mock["step_" + (i+1) + "_title"] = s.title; mock["step_" + (i+1) + "_description"] = s.desc; });
      setFooterData(mock);
    }
    finally { setFooterLoading(false); }
  }
  async function loadUploadHistory() {
    try { const d = await getUploadHistory({ limit: 5 }); setUploadHistory(Array.isArray(d) ? d : []); }
    catch { setUploadHistory([]); }
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus("processing"); setUploadResult(null);
    try {
      const result = await uploadSchoolsFile(file);
      setUploadResult(result); setUploadStatus("success");
      showToast("Archivo procesado: " + result.rows_successful + " filas procesadas");
      loadUploadHistory();
    } catch (err) { setUploadStatus("error"); showToast("Error: " + err.message, "error"); }
    if (e.target) e.target.value = "";
  }

  async function handleSaveStat(statKey, statValue, statLabel) {
    setStatsSaving(s => ({ ...s, [statKey]: true }));
    try { await updateStat(statKey, { stat_value: String(statValue), stat_label: statLabel }); showToast("Estadística actualizada ✓"); }
    catch (err) { showToast("Error: " + err.message, "error"); }
    finally { setStatsSaving(s => ({ ...s, [statKey]: false })); }
  }

  async function handleSaveFooterKey(key, value) {
    setFooterSaving(s => ({ ...s, [key]: true }));
    try { await updateFooterContent(key, value); showToast("Guardado ✓"); }
    catch (err) { showToast("Error: " + err.message, "error"); }
    finally { setFooterSaving(s => ({ ...s, [key]: false })); }
  }

  async function handleDeleteSchool(school) {
    if (!confirm('¿Eliminar "' + school.name + '"?')) return;
    try { await deleteSchool(school.id); setSchools(prev => prev.filter(s => s.id !== school.id)); showToast("Escuela eliminada"); }
    catch (err) { showToast("Error: " + err.message, "error"); }
  }

  async function handleLeadStatus(lead, status) {
    try {
      const updated = await updateLeadStatus(lead.id, status);
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status } : l));
      if (selectedLead?.id === lead.id) setSelectedLead({ ...selectedLead, status });
      showToast("Estado actualizado ✓");
    } catch (err) { showToast("Error: " + err.message, "error"); }
  }

  function downloadTemplate() {
    const header = "Municipio,Escuela,Categoría,Subcategoría,Propuesta,Cantidad,Unidad,Estado,Detalles";
    const ex     = "Arandas,Francisco Rojas,Material,Pizarrones / pintarrones,Pizarrones,5,Piezas,Aun no cubierto,";
    const blob   = new Blob([header + "\n" + ex], { type: "text/csv" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href = url; a.download = "plantilla_necesidades.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("Plantilla descargada");
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: COLORS.amber, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚙️</div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: COLORS.text }}>Panel de Administración</h1>
            <p style={{ color: COLORS.muted, fontSize: 13 }}>Mi Escuela Primero</p>
          </div>
        </div>
        {onLogout && (
          <button onClick={onLogout} style={{ background: "#fee8e8", color: "#c0392b", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            🚪 Cerrar Sesión
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, overflowX: "auto", borderBottom: "2px solid #e8edf5" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "10px 18px", fontSize: 13, fontWeight: 600,
            color: activeTab === t.id ? COLORS.blue : COLORS.muted,
            borderBottom: "2px solid " + (activeTab === t.id ? COLORS.blue : "transparent"),
            marginBottom: -2, whiteSpace: "nowrap",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Upload ────────────────────────────────────────── */}
      {activeTab === "upload" && (
        <div>
          <div
            style={{ border: "2px dashed #c8d0e0", borderRadius: 16, padding: "48px", textAlign: "center", background: "#fafbff", transition: "all 0.2s" }}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = COLORS.blue; e.currentTarget.style.background = "#f0f4ff"; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = "#c8d0e0"; e.currentTarget.style.background = "#fafbff"; }}
            onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor="#c8d0e0"; e.currentTarget.style.background="#fafbff"; const f=e.dataTransfer.files[0]; if(f) handleFileChange({target:{files:[f],value:""}}); }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Carga el Archivo de Necesidades</h3>
            <p style={{ color: COLORS.muted, marginBottom: 6, fontSize: 14 }}>Arrastra tu archivo Excel (.xlsx) o CSV, o haz clic para seleccionar</p>
            <p style={{ color: COLORS.muted, fontSize: 12, marginBottom: 24 }}>Formato: <strong>Municipio | Escuela | Categoría | Subcategoría | Propuesta | Cantidad | Unidad | Estado | Detalles</strong></p>
            <input type="file" accept=".xlsx,.csv" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} />
            <label htmlFor="fileInput" style={{ display: "inline-block", background: uploadStatus === "processing" ? COLORS.muted : COLORS.blue, color: "#fff", padding: "12px 28px", borderRadius: 10, cursor: uploadStatus === "processing" ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, boxShadow: "0 4px 16px rgba(0,74,153,0.3)" }}>
              {uploadStatus === "processing" ? "⏳ Procesando…" : "Seleccionar Archivo"}
            </label>
            {uploadStatus === "success" && uploadResult && (
              <div style={{ marginTop: 20, background: "#e8f5e0", border: "1px solid #a8d88a", borderRadius: 10, padding: "14px 20px", textAlign: "left" }}>
                <div style={{ fontWeight: 700, color: "#2d7a1f", marginBottom: 6 }}>✅ Procesado exitosamente</div>
                <div style={{ fontSize: 13, color: "#4a7a3a" }}>• {uploadResult.rows_successful} filas procesadas {uploadResult.rows_failed > 0 && `· ${uploadResult.rows_failed} con errores`}</div>
                {uploadResult.errors?.map((e, i) => <div key={i} style={{ fontSize: 11, color: "#c0392b", marginTop: 3 }}>Fila {e.row}: {e.error}</div>)}
              </div>
            )}
            {uploadStatus === "error" && (
              <div style={{ marginTop: 20, background: "#fee8e8", border: "1px solid #f5a0a0", borderRadius: 10, padding: "12px 18px", textAlign: "left" }}>
                <div style={{ fontWeight: 700, color: "#c0392b" }}>❌ Error al procesar</div>
              </div>
            )}
          </div>

          {uploadHistory.length > 0 && (
            <div style={{ marginTop: 20, background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #e8edf5" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 10 }}>Historial de Cargas</h3>
              {uploadHistory.map((h, i) => (
                <div key={h.id ?? i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < uploadHistory.length - 1 ? "1px solid #f0f4fb" : "none", fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: COLORS.text }}>{h.filename}</span>
                  <span style={{ color: COLORS.muted }}>{h.rows_successful ?? "?"} filas · {new Date(h.created_at).toLocaleDateString("es-MX")}</span>
                </div>
              ))}
            </div>
          )}

          {/* Format table */}
          <div style={{ marginTop: 20, background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #e8edf5" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Columnas del Archivo</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: COLORS.blue }}>{["Columna","Tipo","Ejemplo"].map(h => <th key={h} style={{ color: "#fff", padding: "8px 12px", textAlign: "left" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["Municipio",    "Texto",         "Arandas"],
                    ["Escuela",      "Texto",         "Francisco Rojas"],
                    ["Categoría",    "Texto",         "Material / Infraestructura / Formación"],
                    ["Subcategoría", "Texto",         "Pizarrones / pintarrones"],
                    ["Propuesta",    "Texto",         "Pizarrones"],
                    ["Cantidad",     "Número",        "5"],
                    ["Unidad",       "Texto",         "Piezas / Tonelada / Horas"],
                    ["Estado",       "Texto",         "Cubierto / Aun no cubierto / Cubierto parcialmente"],
                    ["Detalles",     "Texto (opcional)", "Información adicional"],
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
                      {row.map((cell, j) => <td key={j} style={{ padding: "8px 12px", borderBottom: "1px solid #e8edf5", fontFamily: j === 0 ? "monospace" : "inherit", color: j === 0 ? COLORS.blue : COLORS.text }}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={downloadTemplate} style={{ marginTop: 12, background: "#f0f4fb", border: "1px solid #dde3f0", borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: COLORS.blue }}>
              📥 Descargar Plantilla CSV
            </button>
          </div>
        </div>
      )}

      {/* ── Leads ─────────────────────────────────────────── */}
      {activeTab === "leads" && (
        <div style={{ display: selectedLead ? "grid" : "block", gridTemplateColumns: "1fr 380px", gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
              Solicitudes de aliados {!leadsLoading && `(${leads.length})`}
            </h3>
            {leadsLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>⏳ Cargando…</div>
            ) : leads.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>No hay solicitudes aún.</div>
            ) : (
              <div style={{ border: "1px solid #e8edf5", borderRadius: 12, overflow: "hidden" }}>
                {leads.map((lead, i) => {
                  const st = STATUS_LABELS[lead.status] ?? STATUS_LABELS.nuevo;
                  const active = selectedLead?.id === lead.id;
                  return (
                    <div key={lead.id} onClick={() => setSelectedLead(active ? null : lead)} style={{
                      display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, padding: "13px 16px", alignItems: "center",
                      borderBottom: i < leads.length - 1 ? "1px solid #e8edf5" : "none",
                      background: active ? "#f0f4ff" : i % 2 === 0 ? "#fff" : "#fafbff",
                      cursor: "pointer", transition: "background 0.15s",
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{lead.nombre_completo}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted }}>{lead.email} · {lead.tipo_donativo?.replace(/_/g," ")}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{new Date(lead.created_at).toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" })}</div>
                      </div>
                      <span style={{ ...st, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>{st.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lead detail panel */}
          {selectedLead && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20, position: "sticky", top: 80, alignSelf: "start", maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, margin: 0 }}>Detalle de solicitud</h4>
                <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: COLORS.muted }}>✕</button>
              </div>

              {[
                ["Nombre",       selectedLead.nombre_completo],
                ["Email",        selectedLead.email],
                ["Celular",      selectedLead.celular],
                ["Municipio",    selectedLead.municipio_estado],
                ["Instancia",    selectedLead.tipo_instancia?.replace(/_/g," ")],
                ["Organización", selectedLead.nombre_instancia],
                ["Donativo",     selectedLead.tipo_donativo?.replace(/_/g," ")],
                ["Escuela(s)",   selectedLead.escuelas_destino ? (typeof selectedLead.escuelas_destino === "string" ? JSON.parse(selectedLead.escuelas_destino) : selectedLead.escuelas_destino).join(", ") : ""],
                ["Tema",         selectedLead.tema_formacion],
                ["Público",      selectedLead.publico_dirigido],
                ["Horas",        selectedLead.num_horas_sesiones],
                ["Artículo",     selectedLead.articulo_donar],
                ["Cantidad",     selectedLead.cantidad_articulos],
                ["Entrega",      selectedLead.opcion_flete?.replace(/_/g," ")],
                ["Dirección",    selectedLead.direccion_recoleccion],
                ["Descripción",  selectedLead.descripcion_apoyo],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid #f0f4fb", fontSize: 12 }}>
                  <span style={{ color: COLORS.muted, fontWeight: 600, minWidth: 90, flexShrink: 0 }}>{label}</span>
                  <span style={{ color: COLORS.text, wordBreak: "break-word" }}>{String(value)}</span>
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 8 }}>Cambiar estado:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.entries(STATUS_LABELS).map(([key, st]) => (
                    <button key={key} onClick={() => handleLeadStatus(selectedLead, key)} style={{
                      background: selectedLead.status === key ? st.bg : "#f0f4fb",
                      color: selectedLead.status === key ? st.color : COLORS.muted,
                      border: selectedLead.status === key ? `1.5px solid ${st.color}` : "1.5px solid #dde3f0",
                      borderRadius: 6, padding: "5px 11px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>{st.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Schools ───────────────────────────────────────── */}
      {activeTab === "schools" && (
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Escuelas registradas {!schoolsLoading && `(${schools.length})`}</h3>
          {schoolsLoading ? (
            <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>⏳ Cargando…</div>
          ) : (
            <div style={{ border: "1px solid #e8edf5", borderRadius: 12, overflow: "hidden" }}>
              {schools.length === 0
                ? <div style={{ padding: 32, textAlign: "center", color: COLORS.muted }}>No hay escuelas. Sube un archivo para comenzar.</div>
                : schools.map((school, i) => (
                  <div key={school.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 14, padding: "14px 18px", alignItems: "center", borderBottom: i < schools.length - 1 ? "1px solid #e8edf5" : "none", background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{school.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{school.municipality}</div>
                    </div>
                    <div style={{ width: 90 }}>
                      <ProgressBar pct={school.funded} />
                      <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2, textAlign: "center" }}>{school.funded}%</div>
                    </div>
                    {school.urgent && <span style={{ background: "#fee8e8", color: "#c0392b", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>Urgente</span>}
                    <button onClick={() => handleDeleteSchool(school)} style={{ background: "#fee8e8", color: "#c0392b", border: "none", cursor: "pointer", borderRadius: 6, padding: "5px 11px", fontSize: 11, fontWeight: 600 }}>Eliminar</button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────── */}
      {activeTab === "stats" && (
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Estadísticas del Hero Section</h3>
          {statsLoading
            ? <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>⏳ Cargando…</div>
            : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 16 }}>
                {rawStats.map(stat => <EditableStat key={stat.stat_key} stat={stat} saving={statsSaving[stat.stat_key]} onSave={handleSaveStat} />)}
                {rawStats.length === 0 && <p style={{ color: COLORS.muted, fontSize: 13 }}>No hay estadísticas. Verifica que el backend esté corriendo.</p>}
              </div>
            )
          }
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────── */}
      {activeTab === "footer" && (
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Contenido del Footer</h3>
          {footerLoading
            ? <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>⏳ Cargando…</div>
            : footerData
              ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(footerData).map(([key, value]) => (
                    <FooterField key={key} fieldKey={key} value={value} saving={footerSaving[key]} onSave={handleSaveFooterKey} />
                  ))}
                </div>
              : <p style={{ color: COLORS.muted }}>No se pudo cargar.</p>
          }
        </div>
      )}
    </div>
  );
}

function EditableStat({ stat, saving, onSave }) {
  const [value, setValue] = useState(stat.stat_value);
  const [label, setLabel] = useState(stat.stat_label);
  const icons = { total_schools: "🏫", total_students: "👩‍🎓", active_needs: "📋", total_teachers: "👨‍🏫" };
  return (
    <div style={{ background: "#fff", border: "1px solid #e8edf5", borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icons[stat.stat_key] ?? "📊"}</div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 4 }}>Etiqueta</label>
        <input value={label} onChange={e => setLabel(e.target.value)} style={{ width: "100%", border: "1.5px solid #dde3f0", borderRadius: 7, padding: "6px 10px", fontSize: 12, boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 4 }}>Valor</label>
        <input value={value} onChange={e => setValue(e.target.value)} style={{ width: "100%", border: "2px solid #dde3f0", borderRadius: 7, padding: "8px 10px", fontSize: 20, fontWeight: 800, color: COLORS.blue, outline: "none", boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = COLORS.blue)} onBlur={e => (e.target.style.borderColor = "#dde3f0")} />
      </div>
      <button onClick={() => onSave(stat.stat_key, value, label)} disabled={saving} style={{ width: "100%", background: saving ? COLORS.muted : COLORS.green, border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: 7, padding: "8px", fontSize: 12, fontWeight: 700, color: "#fff" }}>
        {saving ? "Guardando…" : "💾 Guardar"}
      </button>
    </div>
  );
}

function FooterField({ fieldKey, value: iv, saving, onSave }) {
  const [value, setValue] = useState(iv ?? "");
  const label = fieldKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return (
    <div style={{ background: "#fff", border: "1px solid #e8edf5", borderRadius: 10, padding: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 5 }}>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={value} onChange={e => setValue(e.target.value)} style={{ flex: 1, border: "1.5px solid #dde3f0", borderRadius: 7, padding: "7px 10px", fontSize: 13, outline: "none" }} onFocus={e => (e.target.style.borderColor = COLORS.blue)} onBlur={e => (e.target.style.borderColor = "#dde3f0")} />
        <button onClick={() => onSave(fieldKey, value)} disabled={saving} style={{ background: saving ? COLORS.muted : COLORS.blue, color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600 }}>
          {saving ? "…" : "💾"}
        </button>
      </div>
    </div>
  );
}
