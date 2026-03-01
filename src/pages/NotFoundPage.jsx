import { COLORS } from "../constants/colors";

export default function NotFoundPage({ setPage }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px", color: COLORS.muted }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>404</div>
      <h2 style={{ color: COLORS.text, fontSize: 24, marginBottom: 8 }}>Página no encontrada</h2>
      <p style={{ marginBottom: 24 }}>La página que buscas no existe o fue movida.</p>
      <button
        onClick={() => setPage("home")}
        style={{
          color: "#fff", background: COLORS.blue, cursor: "pointer",
          border: "none", fontSize: 15, fontWeight: 700,
          padding: "12px 28px", borderRadius: 10,
        }}
      >
        ← Volver al inicio
      </button>
    </div>
  );
}
