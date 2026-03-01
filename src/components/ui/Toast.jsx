import { COLORS } from "../../constants/colors";

export default function Toast({ msg, type = "success" }) {
  if (!msg) return null;

  return (
    <div style={{
      position: "fixed", top: 80, right: 24, zIndex: 9999,
      background: type === "success" ? COLORS.green : "#e05c5c",
      color: "#fff", borderRadius: 10, padding: "14px 24px",
      fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    }}>
      {type === "success" ? "✅" : "⚠️"} {msg}
    </div>
  );
}
