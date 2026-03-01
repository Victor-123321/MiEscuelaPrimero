import { COLORS } from "../../constants/colors";
import { FOOTER_STEPS } from "../../data/mockStats";

export default function Footer({ setPage }) {
  return (
    <footer style={{ background: COLORS.blueDark, padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            color: "#fff", fontSize: 32, fontFamily: "'Georgia', serif",
            fontWeight: 700, marginBottom: 12,
          }}>¿Qué Sigue?</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>
            Así funciona el proceso para hacer tu donativo
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 32, marginBottom: 56,
        }}>
          {FOOTER_STEPS.map((step, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 36,
                width: 64, height: 64,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                {step.icon}
              </div>
              <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                {step.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 32,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            © 2026 Mi Escuela Primero — Jalisco, México
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>📧 contacto@mpj.org.mx</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>📞 +52 33 0000-0000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
