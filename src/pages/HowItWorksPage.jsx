import { COLORS } from "../constants/colors";
import { FOOTER_STEPS } from "../data/mockStats";

export default function HowItWorksPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{
          fontSize: 40, fontFamily: "'Georgia', serif",
          color: COLORS.text, fontWeight: 700, marginBottom: 16,
        }}>
          ¿Cómo <span style={{ color: COLORS.blue }}>Funciona</span>?
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 18, maxWidth: 540, margin: "0 auto" }}>
          Un proceso transparente que garantiza que tu donativo llegue directamente a donde más se necesita.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
        {FOOTER_STEPS.map((step, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(0,74,153,0.25)",
            }}>{step.icon}</div>
            <div style={{
              background: COLORS.amber, color: COLORS.text,
              borderRadius: 100, padding: "2px 12px",
              fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 10,
            }}>Paso {i + 1}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{step.title}</h3>
            <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
          </div>
        ))}
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueLight} 100%)`,
        borderRadius: 20, padding: "40px", textAlign: "center", marginTop: 60,
      }}>
        <h2 style={{ color: "#fff", fontSize: 26, fontFamily: "'Georgia', serif", marginBottom: 12 }}>
          ¿Listo para hacer la diferencia?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 24 }}>
          Contáctanos hoy y encuentra la forma ideal de apoyar la educación en Jalisco.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ color: "#fff", fontSize: 14 }}>📧 contacto@mpj.org.mx</div>
          <div style={{ color: "#fff", fontSize: 14 }}>📞 +52 33 0000-0000</div>
        </div>
      </div>
    </div>
  );
}
