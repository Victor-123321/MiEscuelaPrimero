import { COLORS } from "../../constants/colors";
import { FOOTER_STEPS, CONTACT } from "../../data/mockStats";

export default function Footer() {
  return (
    <footer style={{ background: COLORS.blueDark, padding: "52px 20px 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{
            color: "#fff", fontSize: "clamp(22px, 4vw, 30px)",
            fontFamily: "'Georgia', serif", fontWeight: 700, marginBottom: 10,
          }}>¿Qué Sigue?</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
            Así funciona el proceso para sumarte
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 28, marginBottom: 48,
        }}>
          {FOOTER_STEPS.map((step, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 30, width: 58, height: 58,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>{step.icon}</div>
              <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{step.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact card */}
        <div style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16, padding: "24px 28px",
          display: "flex", flexWrap: "wrap", gap: 24,
          justifyContent: "space-between", alignItems: "center",
          marginBottom: 32,
        }}>
          <div>
            <div style={{ color: COLORS.greenLight, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 4 }}>
              COORDINADORA DEL PROGRAMA
            </div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{CONTACT.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>{CONTACT.title}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a href={`mailto:${CONTACT.email}`} style={{
              color: COLORS.greenLight, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
            }}>
              📧 {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} style={{
              color: "#fff", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
            }}>
              📞 {CONTACT.phone}
            </a>
            <a href={CONTACT.website} target="_blank" rel="noreferrer" style={{
              color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
            }}>
              🌐 mexicanosprimerojalisco.org
            </a>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: CONTACT.facebook, icon: "📘" },
              { label: CONTACT.instagram, icon: "📸" },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.08)", borderRadius: 8,
                padding: "8px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {s.icon} {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 20,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            © 2024 Mexicanos Primero Jalisco — Mi Escuela Primero
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            Jalisco, México
          </div>
        </div>
      </div>
    </footer>
  );
}
