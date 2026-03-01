import { COLORS } from "../constants/colors";
import { FOOTER_STEPS, CONTACT, CONTRIBUTION_TYPES } from "../data/mockStats";

export default function HowItWorksPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(32px, 5vw, 60px) 20px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{
          fontSize: "clamp(26px, 4vw, 40px)", fontFamily: "'Georgia', serif",
          color: COLORS.text, fontWeight: 700, marginBottom: 12,
        }}>
          ¿Cómo puedes ser parte del <span style={{ color: COLORS.blue }}>cambio</span>?
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
          Con cada gesto, podemos transformar la educación. Solo colaborando podemos marcar un rumbo distinto.
        </p>
      </div>

      {/* Contribution types */}
      <div style={{ marginBottom: 52 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 16, textAlign: "center" }}>
          Formas de sumarte
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
        }}>
          {CONTRIBUTION_TYPES.map(type => (
            <div key={type.id} style={{
              background: "#fff",
              border: `2px solid rgba(0,74,153,0.1)`,
              borderRadius: 14, padding: "20px 16px", textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,74,153,0.06)",
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{type.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{type.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Process steps */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 28, textAlign: "center" }}>
        El proceso, paso a paso
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 28, marginBottom: 52,
      }}>
        {FOOTER_STEPS.map((step, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: 68, height: 68, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, margin: "0 auto 14px",
              boxShadow: "0 8px 24px rgba(0,74,153,0.22)",
            }}>{step.icon}</div>
            <div style={{
              background: COLORS.amber, color: COLORS.text,
              borderRadius: 100, padding: "2px 12px",
              fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 8,
            }}>Paso {i + 1}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{step.title}</h3>
            <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueLight} 100%)`,
        borderRadius: 18, padding: "clamp(24px, 4vw, 40px)", textAlign: "center",
      }}>
        <h2 style={{ color: "#fff", fontSize: "clamp(18px, 3vw, 24px)", fontFamily: "'Georgia', serif", marginBottom: 8 }}>
          El primer paso comienza con un mensaje
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 24, fontSize: 14 }}>
          Contáctanos, aclara tus dudas y construyamos juntos un mejor presente para la educación.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={`mailto:${CONTACT.email}`} style={{
            color: COLORS.greenLight, fontSize: 15, textDecoration: "none", fontWeight: 600,
          }}>📧 {CONTACT.email}</a>
          <a href={`tel:${CONTACT.phone}`} style={{
            color: "#fff", fontSize: 15, textDecoration: "none", fontWeight: 600,
          }}>📞 {CONTACT.phone}</a>
        </div>
        <div style={{ marginTop: 16, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
          Rosalba Gascón — Coordinadora de Mi Escuela Primero
        </div>
      </div>
    </div>
  );
}
