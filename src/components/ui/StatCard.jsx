
export default function StatCard({ value, label, icon, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 16,
        padding: "24px 28px",
        textAlign: "center",
        transition: "transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontSize: 36, fontWeight: 800, color,
        fontFamily: "'Georgia', serif", lineHeight: 1,
      }}>
        {value.toLocaleString()}
      </div>
      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}
