import { COLORS } from "../../constants/colors";

export default function ProgressBar({ pct }) {
  const color =
    pct >= 75 ? COLORS.green :
    pct >= 40 ? COLORS.amber :
    "#e05c5c";

  return (
    <div style={{ background: "#e8edf5", borderRadius: 100, height: 8, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: color,
        borderRadius: 100,
        transition: "width 0.8s ease",
      }} />
    </div>
  );
}
