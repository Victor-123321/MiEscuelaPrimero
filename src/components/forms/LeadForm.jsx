import { useState } from "react";
import { COLORS } from "../../constants/colors";
import { DONATION_TYPES, TIPOS_INSTANCIA } from "../../data/mockStats";
import { submitLead } from "../../services/api";

const GRUPO_FORMACION = ["formacion_familias","formacion_estudiantes","formacion_docentes","atencion_psicologica"];
const GRUPO_MATERIAL  = ["material_tecnologico","material_papeleria","material_literario","material_ed_fisica","material_infraestructura","mobiliario"];
const GRUPO_ACCESO    = ["transporte","condiciones_camino","salud_fisica","visitas_extraescolares","apoyo_gestion","otro"];

const FLETE_OPTS = [
  { id: "hasta_escuela", label: "Puedo llevarlo hasta la escuela" },
  { id: "oficina",       label: "Lo llevo a sus oficinas" },
  { id: "recoger",       label: "Necesito que pasen a recogerlo" },
];

const PUBLICO_OPTS = [
  { id: "estudiantes", label: "Estudiantes" },
  { id: "docentes",    label: "Docentes" },
  { id: "familias",    label: "Familias" },
];

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 5 }}>
        {label}{required && <span style={{ color: "#e05c5c" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8,
  padding: "9px 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s", background: "#fff",
};

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={inputStyle}
      onFocus={e => (e.target.style.borderColor = COLORS.blue)}
      onBlur={e => (e.target.style.borderColor = "#dde3f0")}
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, cursor: "pointer" }}
      onFocus={e => (e.target.style.borderColor = COLORS.blue)}
      onBlur={e => (e.target.style.borderColor = "#dde3f0")}
    >
      {children}
    </select>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ ...inputStyle, resize: "vertical" }}
      onFocus={e => (e.target.style.borderColor = COLORS.blue)}
      onBlur={e => (e.target.style.borderColor = "#dde3f0")}
    />
  );
}

function ToggleChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} type="button" style={{
      padding: "7px 13px", borderRadius: 100,
      border: `2px solid ${active ? COLORS.blue : "#dde3f0"}`,
      background: active ? COLORS.blue : "#fff",
      color: active ? "#fff" : COLORS.text,
      fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
    }}>
      {children}
    </button>
  );
}

const STEPS = ["Contacto", "Donativo", "Detalles", "Confirmar"];

export default function LeadForm({ school, schools = [], onClose }) {
  const [step, setStep]     = useState(0);
  const [sent, setSent]     = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]   = useState("");

  const [nombre,           setNombre]           = useState("");
  const [tipoInstancia,    setTipoInstancia]    = useState("");
  const [tipoInstanciaOtro,setTipoInstanciaOtro] = useState("");
  const [nombreInstancia,  setNombreInstancia]  = useState("");
  const [email,            setEmail]            = useState("");
  const [celular,          setCelular]          = useState("");
  const [municipioEstado,  setMunicipioEstado]  = useState("");
  const [privacidad,       setPrivacidad]       = useState(false);

  const [tipoDonativo,    setTipoDonativo]    = useState(school ? "" : "");
  const [tipoDonativoOtro,setTipoDonativoOtro] = useState("");
  const [escuelasDestino, setEscuelasDestino] = useState(school ? [school.name] : []);

  const [temaFormacion,      setTemaFormacion]      = useState("");
  const [publicoDirigido,    setPublicoDirigido]    = useState([]);
  const [numHoras,           setNumHoras]           = useState("");
  const [articuloDonar,      setArticuloDonar]      = useState("");
  const [cantidadArticulos,  setCantidadArticulos]  = useState("");
  const [opcionFlete,        setOpcionFlete]        = useState("");
  const [direccionRecoleccion,setDireccionRecoleccion] = useState("");
  const [descripcionApoyo,   setDescripcionApoyo]   = useState("");

  const donationType = DONATION_TYPES.find(d => d.id === tipoDonativo);
  const isFormacion  = GRUPO_FORMACION.includes(tipoDonativo);
  const isMaterial   = GRUPO_MATERIAL.includes(tipoDonativo);
  const isAcceso     = GRUPO_ACCESO.includes(tipoDonativo);

  const allSchoolNames = schools.length
    ? schools.map(s => s.name)
    : school ? [school.name] : [];

  const toggleEscuela = (name) =>
    setEscuelasDestino(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);

  const togglePublico = (id) =>
    setPublicoDirigido(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  function canAdvance() {
    if (step === 0) return nombre && email && tipoInstancia && privacidad;
    if (step === 1) return tipoDonativo !== "";
    if (step === 2) {
      if (isFormacion) return escuelasDestino.length > 0;
      if (isMaterial)  return escuelasDestino.length > 0 && articuloDonar && cantidadArticulos && opcionFlete;
      if (isAcceso)    return escuelasDestino.length > 0 && descripcionApoyo;
      return true;
    }
    return true;
  }

  async function handleSubmit() {
    setSending(true);
    setError("");
    try {
      await submitLead({
        nombre_completo:      nombre,
        tipo_instancia:       tipoInstancia,
        tipo_instancia_otro:  tipoInstanciaOtro,
        nombre_instancia:     nombreInstancia,
        email,
        celular,
        municipio_estado:     municipioEstado,
        acepta_privacidad:    privacidad,
        tipo_donativo:        tipoDonativo,
        tipo_donativo_otro:   tipoDonativoOtro,
        escuelas_destino:     escuelasDestino,
        tema_formacion:       temaFormacion,
        publico_dirigido:     publicoDirigido.join(", "),
        num_horas_sesiones:   numHoras,
        articulo_donar:       articuloDonar,
        cantidad_articulos:   cantidadArticulos ? parseInt(cantidadArticulos) : null,
        opcion_flete:         opcionFlete,
        direccion_recoleccion:direccionRecoleccion,
        descripcion_apoyo:    descripcionApoyo,
      });
      setSent(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <Overlay onClose={onClose}>
        <div style={{ padding: "48px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
          <h3 style={{ color: COLORS.blue, fontSize: 22, fontWeight: 800, marginBottom: 12 }}>¡Gracias por ser parte del cambio!</h3>
          <p style={{ color: COLORS.muted, lineHeight: 1.7, maxWidth: 400, margin: "0 auto 20px" }}>
            Tu donativo representa una oportunidad más para seguir transformando vidas.
            En <strong>menos de 48 horas</strong> nos pondremos en contacto contigo para
            dar seguimiento y realizar las gestiones necesarias para que tu apoyo llegue a las escuelas.
          </p>
          <p style={{ color: COLORS.muted, fontSize: 13 }}>
            📧 Te pedimos estar atento a tu correo y celular.
          </p>
          <button onClick={onClose} style={{ marginTop: 24, background: COLORS.green, color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Cerrar
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: COLORS.blue, padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0 }}>
            {school ? `Apoyar a ${school.name}` : "Quiero apoyar"}
          </h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", borderRadius: "50%", width: 28, height: 28, color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: 3, borderRadius: 3, background: i <= step ? COLORS.green : "rgba(255,255,255,0.25)", transition: "background 0.3s" }} />
              <div style={{ fontSize: 10, color: i <= step ? COLORS.greenLight : "rgba(255,255,255,0.5)", marginTop: 4, fontWeight: i === step ? 700 : 400 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 22px", overflowY: "auto", maxHeight: "55vh" }}>
        {step === 0 && (
          <div>
            <Field label="Nombre completo" required>
              <TextInput value={nombre} onChange={setNombre} placeholder="Tu nombre completo" />
            </Field>
            <Field label="Tipo de instancia desde la que nos contactas" required>
              <SelectInput value={tipoInstancia} onChange={setTipoInstancia}>
                <option value="">Selecciona una opción…</option>
                {TIPOS_INSTANCIA.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </SelectInput>
            </Field>
            {tipoInstancia === "otro" && (
              <Field label="Especifica el tipo de instancia">
                <TextInput value={tipoInstanciaOtro} onChange={setTipoInstanciaOtro} placeholder="Describe tu tipo de instancia" />
              </Field>
            )}
            {tipoInstancia && tipoInstancia !== "ninguna" && (
              <Field label="Nombre de la instancia (si aplica)">
                <TextInput value={nombreInstancia} onChange={setNombreInstancia} placeholder="Nombre de tu empresa u organización" />
              </Field>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Correo electrónico" required>
                <TextInput type="email" value={email} onChange={setEmail} placeholder="correo@empresa.com" />
              </Field>
              <Field label="Celular de contacto">
                <TextInput value={celular} onChange={setCelular} placeholder="33 0000 0000" />
              </Field>
            </div>
            <Field label="Municipio y estado">
              <TextInput value={municipioEstado} onChange={setMunicipioEstado} placeholder="Ej. Zapopan, Jalisco" />
            </Field>
            <div style={{ background: "#f8faff", border: "1px solid #dde3f0", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <input
                type="checkbox"
                id="privacidad"
                checked={privacidad}
                onChange={e => setPrivacidad(e.target.checked)}
                style={{ marginTop: 2, cursor: "pointer", accentColor: COLORS.blue, width: 16, height: 16, flexShrink: 0 }}
              />
              <label htmlFor="privacidad" style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5, cursor: "pointer" }}>
                Acepto el{" "}
                <a href="https://mexicanosprimerojalisco.org/aviso-de-privacidad" target="_blank" rel="noreferrer" style={{ color: COLORS.blue, fontWeight: 600 }}>
                  aviso de privacidad
                </a>{" "}
                de Mexicanos Primero Jalisco y autorizo el uso de mis datos para dar seguimiento a mi donativo.
                <span style={{ color: "#e05c5c" }}> *</span>
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 14 }}>¿Cómo te gustaría contribuir?</p>
            {[
              { group: "formacion",   label: "Formación",    items: DONATION_TYPES.filter(d => d.group === "formacion") },
              { group: "psicologia",  label: "Psicología",   items: DONATION_TYPES.filter(d => d.group === "psicologia") },
              { group: "material",    label: "Material / Mobiliario", items: DONATION_TYPES.filter(d => d.group === "material") },
              { group: "acceso",      label: "Acceso / Salud / Gestión", items: DONATION_TYPES.filter(d => d.group === "acceso") },
              { group: "otro",        label: "Otro",         items: DONATION_TYPES.filter(d => d.group === "otro") },
            ].map(({ group, label, items }) => (
              <div key={group} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{label}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {items.map(d => (
                    <ToggleChip key={d.id} active={tipoDonativo === d.id} onClick={() => setTipoDonativo(d.id)}>
                      {d.icon} {d.label}
                    </ToggleChip>
                  ))}
                </div>
              </div>
            ))}
            {tipoDonativo === "otro" && (
              <Field label="Describe tu tipo de donativo">
                <TextInput value={tipoDonativoOtro} onChange={setTipoDonativoOtro} placeholder="Describe brevemente tu apoyo" />
              </Field>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <Field label="Escuela(s) destino" required>
              {allSchoolNames.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {allSchoolNames.map(name => (
                    <ToggleChip key={name} active={escuelasDestino.includes(name)} onClick={() => toggleEscuela(name)}>
                      🏫 {name}
                    </ToggleChip>
                  ))}
                </div>
              ) : (
                <TextInput value={escuelasDestino[0] ?? ""} onChange={v => setEscuelasDestino([v])} placeholder="Nombre de la escuela destino" />
              )}
            </Field>

            {isFormacion && (
              <>
                {tipoDonativo !== "atencion_psicologica" && (
                  <Field label="Tema de formación que desean impartir">
                    <TextInput value={temaFormacion} onChange={setTemaFormacion} placeholder="Ej. Habilidades socioemocionales, liderazgo…" />
                  </Field>
                )}
                <Field label="Público al que va dirigido">
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {PUBLICO_OPTS.map(o => (
                      <ToggleChip key={o.id} active={publicoDirigido.includes(o.id)} onClick={() => togglePublico(o.id)}>
                        {o.label}
                      </ToggleChip>
                    ))}
                  </div>
                </Field>
                <Field label="Número de horas y/o sesiones">
                  <TextInput value={numHoras} onChange={setNumHoras} placeholder="Ej. 6 horas / 3 sesiones de 2 horas" />
                </Field>
              </>
            )}

            {isMaterial && (
              <>
                <Field label="Artículo a donar" required>
                  <TextArea value={articuloDonar} onChange={setArticuloDonar} placeholder="Describe el artículo o artículos que deseas donar" rows={2} />
                </Field>
                <Field label="Cantidad de artículos a donar" required>
                  <TextInput type="number" value={cantidadArticulos} onChange={setCantidadArticulos} placeholder="Ej. 10" />
                </Field>
                <Field label="Opción de entrega" required>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {FLETE_OPTS.map(o => (
                      <label key={o.id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: COLORS.text }}>
                        <input type="radio" name="flete" value={o.id} checked={opcionFlete === o.id} onChange={() => setOpcionFlete(o.id)} style={{ accentColor: COLORS.blue, width: 16, height: 16 }} />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </Field>
                {opcionFlete === "recoger" && (
                  <Field label="Dirección de recolección">
                    <TextArea value={direccionRecoleccion} onChange={setDireccionRecoleccion} placeholder="Calle, número, colonia, municipio, estado, código postal" rows={2} />
                  </Field>
                )}
              </>
            )}

            {isAcceso && (
              <Field label="Describe el tipo de apoyo que deseas ofrecer" required>
                <TextArea value={descripcionApoyo} onChange={setDescripcionApoyo} placeholder="Describe detalladamente en qué consiste tu apoyo…" rows={4} />
              </Field>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>Revisa tu información antes de enviar:</p>
            <SummaryRow label="Nombre"       value={nombre} />
            <SummaryRow label="Instancia"    value={TIPOS_INSTANCIA.find(t => t.id === tipoInstancia)?.label ?? tipoInstancia} />
            {nombreInstancia && <SummaryRow label="Organización" value={nombreInstancia} />}
            <SummaryRow label="Correo"       value={email} />
            {celular && <SummaryRow label="Celular"      value={celular} />}
            {municipioEstado && <SummaryRow label="Municipio"    value={municipioEstado} />}
            <div style={{ margin: "12px 0", height: 1, background: "#e8edf5" }} />
            <SummaryRow label="Tipo de donativo" value={DONATION_TYPES.find(d => d.id === tipoDonativo)?.label ?? tipoDonativo} />
            <SummaryRow label="Escuela(s) destino" value={escuelasDestino.join(", ")} />
            {temaFormacion       && <SummaryRow label="Tema"           value={temaFormacion} />}
            {publicoDirigido.length > 0 && <SummaryRow label="Público"        value={publicoDirigido.join(", ")} />}
            {numHoras            && <SummaryRow label="Horas/sesiones" value={numHoras} />}
            {articuloDonar       && <SummaryRow label="Artículo"       value={articuloDonar} />}
            {cantidadArticulos   && <SummaryRow label="Cantidad"       value={cantidadArticulos} />}
            {opcionFlete         && <SummaryRow label="Entrega"        value={FLETE_OPTS.find(o => o.id === opcionFlete)?.label ?? opcionFlete} />}
            {descripcionApoyo    && <SummaryRow label="Descripción"    value={descripcionApoyo} />}
            {error && (
              <div style={{ background: "#fee8e8", border: "1px solid #f5a0a0", borderRadius: 8, padding: "10px 14px", marginTop: 12, fontSize: 13, color: "#c0392b", fontWeight: 600 }}>
                ❌ {error}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "14px 22px", borderTop: "1px solid #e8edf5", display: "flex", gap: 10 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "#f0f4fb", border: "none", cursor: "pointer", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 600, color: COLORS.muted }}>
            ← Atrás
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => { if (canAdvance()) setStep(s => s + 1); }}
            disabled={!canAdvance()}
            style={{ flex: 2, background: canAdvance() ? COLORS.blue : "#ccc", border: "none", cursor: canAdvance() ? "pointer" : "not-allowed", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, color: "#fff", transition: "background 0.2s" }}
          >
            Continuar →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={sending}
            style={{ flex: 2, background: sending ? COLORS.muted : COLORS.green, border: "none", cursor: sending ? "not-allowed" : "pointer", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 4px 16px rgba(120,184,51,0.35)" }}
          >
            {sending ? "Enviando…" : "💚 Enviar solicitud"}
          </button>
        )}
      </div>
    </Overlay>
  );
}

function Overlay({ onClose, children }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 560, boxShadow: "0 24px 80px rgba(0,0,0,0.3)", overflow: "hidden", maxHeight: "95vh", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: "1px solid #f0f4fb", fontSize: 13 }}>
      <span style={{ color: COLORS.muted, fontWeight: 600, minWidth: 120, flexShrink: 0 }}>{label}</span>
      <span style={{ color: COLORS.text }}>{value}</span>
    </div>
  );
}
