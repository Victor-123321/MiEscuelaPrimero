import { useState } from "react";
import { COLORS } from "../../constants/colors";
import { CONTRIBUTION_TYPES } from "../../data/mockStats";

export default function LeadForm({ school, onClose }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", org: "", msg: "" });
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || selectedTypes.length === 0) return;
    setSent(true);
    setTimeout(onClose, 3500);
  };

  const fields = [
    { key: "name",  label: "Nombre completo *",       placeholder: "Tu nombre" },
    { key: "email", label: "Correo electrónico *",     placeholder: "correo@empresa.com" },
    { key: "phone", label: "Teléfono",                 placeholder: "33 0000 0000" },
    { key: "org",   label: "Empresa / Organización",   placeholder: "Nombre de tu empresa" },
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, overflowY: "auto",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)", overflow: "hidden",
        maxHeight: "95vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ background: COLORS.blue, padding: "20px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            Apoya a {school?.name || "esta escuela"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            Rosalba te contactará para coordinar tu apoyo.
          </p>
        </div>

        {sent ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ color: COLORS.blue, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>¡Gracias!</h3>
            <p style={{ color: COLORS.muted, lineHeight: 1.6 }}>
              Rosalba Gascón te contactará muy pronto para coordinar tu apoyo.<br />
              <strong style={{ color: COLORS.text }}>rgascon@mpj.org.mx · 33 1177 8783</strong>
            </p>
          </div>
        ) : (
          <div style={{ padding: 20 }}>
            {/* Contribution type selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, display: "block", marginBottom: 10 }}>
                ¿Cómo te gustaría contribuir? * <span style={{ color: COLORS.muted, fontWeight: 400 }}>(elige uno o más)</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CONTRIBUTION_TYPES.map(type => {
                  const active = selectedTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", borderRadius: 100,
                        border: `2px solid ${active ? COLORS.blue : "#dde3f0"}`,
                        background: active ? COLORS.blue : "#fff",
                        color: active ? "#fff" : COLORS.text,
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <span>{type.icon}</span> {type.label}
                    </button>
                  );
                })}
              </div>
              {selectedTypes.length === 0 && (
                <p style={{ fontSize: 11, color: "#e05c5c", marginTop: 6 }}>
                  Selecciona al menos una opción para continuar
                </p>
              )}
            </div>

            {/* Contact fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 5 }}>
                    {f.label}
                  </label>
                  <input
                    value={form[f.key]}
                    onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8,
                      padding: "9px 12px", fontSize: 14, outline: "none",
                      boxSizing: "border-box", transition: "border-color 0.2s",
                    }}
                    onFocus={e => (e.target.style.borderColor = COLORS.blue)}
                    onBlur={e => (e.target.style.borderColor = "#dde3f0")}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 5 }}>
                Mensaje (opcional)
              </label>
              <textarea
                value={form.msg}
                onChange={e => setForm(x => ({ ...x, msg: e.target.value }))}
                placeholder="Cuéntanos más sobre cómo te gustaría contribuir…"
                rows={3}
                style={{
                  width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8,
                  padding: "9px 12px", fontSize: 14, outline: "none",
                  resize: "vertical", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = COLORS.blue)}
                onBlur={e => (e.target.style.borderColor = "#dde3f0")}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{
                flex: 1, background: "#f0f4fb", border: "none", cursor: "pointer",
                borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, color: COLORS.muted,
              }}>
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.email || selectedTypes.length === 0}
                style={{
                  flex: 2, background: (!form.name || !form.email || selectedTypes.length === 0) ? "#ccc" : COLORS.green,
                  border: "none", cursor: (!form.name || !form.email || selectedTypes.length === 0) ? "not-allowed" : "pointer",
                  borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, color: "#fff",
                  boxShadow: selectedTypes.length > 0 ? "0 4px 16px rgba(120,184,51,0.35)" : "none",
                  transition: "background 0.2s",
                }}
              >
                Enviar solicitud →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
