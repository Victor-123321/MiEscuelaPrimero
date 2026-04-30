
import { useState } from "react";
import { COLORS } from "../../constants/colors";

/**
 * counts — optional object { [optionValue]: number } for live school counts.
 * When omitted, the badge is hidden.
 */
export default function FilterSection({ title, options, selected, toggle, counts }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid #e8edf5", paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 0", marginBottom: collapsed ? 0 : 12,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.text }}>{title}</span>
        <span style={{
          color: COLORS.muted, fontSize: 18,
          transition: "transform 0.2s",
          transform: collapsed ? "rotate(-90deg)" : "rotate(0)",
          display: "inline-block",
        }}>›</span>
      </button>

      {!collapsed && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.map(opt => (
            <label key={opt} style={{
              display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer", fontSize: 13, color: COLORS.text,
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4,
                border: `2px solid ${selected.includes(opt) ? COLORS.blue : "#c8d0e0"}`,
                background: selected.includes(opt) ? COLORS.blue : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }}>
                {selected.includes(opt) && (
                  <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>
                )}
              </div>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                style={{ display: "none" }}
              />
              {opt}
              {counts && (
                <span style={{
                  marginLeft: "auto", background: "#f0f4fb",
                  borderRadius: 100, padding: "1px 8px", fontSize: 11, color: COLORS.muted,
                }}>
                  {counts[opt] ?? 0}
                </span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
