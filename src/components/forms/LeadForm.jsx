import { useState } from "react";
import { COLORS } from "../../constants/colors";

export default function LeadForm({ school, onClose }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", org: "", msg: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    setSent(true);
    setTimeout(onClose, 3000);
  };

  const fields = [
    { key: "name",  label: "Nombre completo*",        placeholder: "Tu nombre" },
    { key: "email", label: "Correo electrónico*",      placeholder: "correo@ejemplo.com" },
    { key: "phone", label: "Teléfono",                 placeholder: "+52 81 0000 0000" },
    { key: "org",   label: "Empresa / Organización",   placeholder: "Nombre de tu empresa" },
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ background: COLORS.blue, padding: "24px 28px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            Apoya a {school?.name || "esta escuela"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
            Nuestro equipo te contactará para coordinar tu donativo.
          </p>
        </div>

        {sent ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ color: COLORS.blue, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>¡Gracias!</h3>
            <p style={{ color: COLORS.muted }}>Te contactaremos muy pronto para coordinar tu apoyo.</p>
          </div>
        ) : (
          <div style={{ padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input
                    value={form[f.key]}
                    onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8,
                      padding: "10px 12px", fontSize: 14, outline: "none",
                      boxSizing: "border-box", transition: "border-color 0.2s",
                    }}
                    onFocus={e => (e.target.style.borderColor = COLORS.blue)}
                    onBlur={e => (e.target.style.borderColor = "#dde3f0")}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
                Mensaje (opcional)
              </label>
              <textarea
                value={form.msg}
                onChange={e => setForm(x => ({ ...x, msg: e.target.value }))}
                placeholder="¿Cómo te gustaría contribuir?"
                rows={3}
                style={{
                  width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8,
                  padding: "10px 12px", fontSize: 14, outline: "none",
                  resize: "vertical", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = COLORS.blue)}
                onBlur={e => (e.target.style.borderColor = "#dde3f0")}
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={onClose} style={{
                flex: 1, background: "#f0f4fb", border: "none", cursor: "pointer",
                borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, color: COLORS.muted,
              }}>
                Cancelar
              </button>
              <button onClick={handleSubmit} style={{
                flex: 2, background: COLORS.green, border: "none", cursor: "pointer",
                borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, color: "#fff",
                boxShadow: `0 4px 16px rgba(120,184,51,0.35)`,
              }}>
                Enviar solicitud →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
