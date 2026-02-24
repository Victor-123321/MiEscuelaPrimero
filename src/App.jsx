import { useState, useEffect, useRef } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const COLORS = {
  blue: "#004A99",
  green: "#78B833",
  amber: "#F5A623",
  blueDark: "#003370",
  blueLight: "#0060c0",
  greenLight: "#9fd14e",
  gray: "#f4f6f9",
  text: "#1a2740",
  muted: "#6b7a99",
};

const MOCK_SCHOOLS = [
  {
    id: 1,
    name: "Escuela Primaria Benito Juárez",
    municipality: "Monterrey",
    type: "Pública",
    category: "Tecnología",
    description: "Esta escuela necesita computadoras y tablets para modernizar su aula de cómputo y brindar acceso digital a 320 estudiantes.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=240&fit=crop",
    needs: [
      { item: "Laptops HP ProBook", qty: 20, unitCost: 8500, model: "HP ProBook 450 G9" },
      { item: "Tablets educativas", qty: 30, unitCost: 3200, model: "Samsung Galaxy Tab A8" },
      { item: "Router Wi-Fi", qty: 2, unitCost: 1800, model: "TP-Link Archer AX55" },
    ],
    funded: 62,
    students: 320,
    teachers: 12,
    urgent: true,
  },
  {
    id: 2,
    name: "Primaria Francisco I. Madero",
    municipality: "Guadalupe",
    type: "Pública",
    category: "Mobiliario",
    description: "Mobiliario escolar en mal estado afecta la postura y concentración de los alumnos. Se requieren bancas y sillas ergonómicas.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=240&fit=crop",
    needs: [
      { item: "Bancas ergonómicas", qty: 120, unitCost: 650, model: "Mobel Escolar Serie 500" },
      { item: "Sillas docentes", qty: 8, unitCost: 1200, model: "Ergon Office Pro" },
      { item: "Escritorios modulares", qty: 8, unitCost: 2400, model: "Steelcase Flex" },
    ],
    funded: 38,
    students: 480,
    teachers: 16,
    urgent: false,
  },
  {
    id: 3,
    name: "Centro Escolar Lázaro Cárdenas",
    municipality: "San Nicolás",
    type: "Pública",
    category: "Infraestructura",
    description: "El techo de tres aulas presenta filtraciones severas que interrumpen clases durante temporada de lluvias, afectando a 90 alumnos.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=240&fit=crop",
    needs: [
      { item: "Impermeabilización de techo", qty: 3, unitCost: 28000, model: "Sistema Sika MultiSeal" },
      { item: "Reparación eléctrica", qty: 1, unitCost: 15000, model: "Instalación certificada NYCE" },
    ],
    funded: 80,
    students: 190,
    teachers: 7,
    urgent: true,
  },
  {
    id: 4,
    name: "Escuela Primaria Niños Héroes",
    municipality: "Apodaca",
    type: "Pública",
    category: "Material Didáctico",
    description: "Falta de libros actualizados y material didáctico impacta la calidad de enseñanza en matemáticas y ciencias naturales.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=240&fit=crop",
    needs: [
      { item: "Libros de texto matemáticas", qty: 200, unitCost: 185, model: "Ed. SM Matemáticas 2024" },
      { item: "Kits de ciencias", qty: 15, unitCost: 890, model: "Science Kit Pro Jr." },
      { item: "Material didáctico", qty: 50, unitCost: 320, model: "Assorted Educational Sets" },
    ],
    funded: 55,
    students: 410,
    teachers: 14,
    urgent: false,
  },
  {
    id: 5,
    name: "Primaria Vicente Guerrero",
    municipality: "Escobedo",
    type: "Pública",
    category: "Tecnología",
    description: "Proyectores obsoletos y sin mantenimiento limitan la enseñanza interactiva. La escuela requiere equipos modernos de proyección.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=240&fit=crop",
    needs: [
      { item: "Proyectores interactivos", qty: 12, unitCost: 12500, model: "Epson EB-1485Fi" },
      { item: "Pantallas 80\"", qty: 12, unitCost: 3800, model: "Elite Screens Yard Master" },
    ],
    funded: 25,
    students: 360,
    teachers: 11,
    urgent: true,
  },
  {
    id: 6,
    name: "Escuela Primaria Cuauhtémoc",
    municipality: "Santa Catarina",
    type: "Pública",
    category: "Deportes",
    description: "La cancha deportiva carece de equipamiento básico para educación física. Se busca mejorar la actividad física de los estudiantes.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop",
    needs: [
      { item: "Pelotas deportivas surtido", qty: 40, unitCost: 280, model: "Mikasa Sports Bundle" },
      { item: "Red de voleibol", qty: 2, unitCost: 1500, model: "Park & Sun Tournament" },
      { item: "Aros y conos de entrenamiento", qty: 60, unitCost: 85, model: "Pro Training Set" },
    ],
    funded: 90,
    students: 290,
    teachers: 9,
    urgent: false,
  },
];

const MUNICIPALITIES = [...new Set(MOCK_SCHOOLS.map(s => s.municipality))];
const CATEGORIES = [...new Set(MOCK_SCHOOLS.map(s => s.category))];
const TYPES = [...new Set(MOCK_SCHOOLS.map(s => s.type))];

const INITIAL_STATS = {
  schools: 147,
  students: 42800,
  activeNeeds: 389,
  teachers: 1620,
};

const FOOTER_STEPS = [
  { icon: "🔍", title: "Explora las necesidades", desc: "Navega el catálogo y encuentra la escuela que más resuene contigo." },
  { icon: "📞", title: "Contáctanos", desc: "Completa el formulario o llámanos. Nuestro equipo te guiará en todo el proceso." },
  { icon: "🤝", title: "Coordinamos juntos", desc: "Conectamos tu donativo directamente con la escuela beneficiada." },
  { icon: "🎉", title: "Generamos impacto", desc: "Recibe un reporte del impacto real de tu contribución en la comunidad." },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Navbar({ page, setPage, adminUnlocked, setAdminUnlocked }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: COLORS.blue,
      boxShadow: "0 2px 20px rgba(0,74,153,0.4)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: COLORS.green,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff",
          }}>M</div>
          <span style={{
            color: "#fff", fontFamily: "'Georgia', serif",
            fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px",
          }}>Mi Escuela <span style={{ color: COLORS.greenLight }}>Primero</span></span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[
            { label: "Inicio", id: "home" },
            { label: "Cómo Funciona", id: "how" },
          ].map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              background: page === item.id ? "rgba(255,255,255,0.15)" : "none",
              border: "none", cursor: "pointer",
              color: "#fff", padding: "8px 16px", borderRadius: 6,
              fontSize: 14, fontWeight: 500,
              transition: "background 0.2s",
            }}>{item.label}</button>
          ))}
          <button
            onClick={() => { setAdminUnlocked(true); setPage("admin"); }}
            style={{
              background: adminUnlocked ? COLORS.amber : "rgba(255,255,255,0.1)",
              border: `1px solid ${adminUnlocked ? COLORS.amber : "rgba(255,255,255,0.3)"}`,
              cursor: "pointer", color: adminUnlocked ? COLORS.text : "#fff",
              padding: "8px 16px", borderRadius: 6,
              fontSize: 14, fontWeight: 600,
            }}>
            {adminUnlocked ? "⚙️ Admin" : "Iniciar Sesión"}
          </button>
        </div>
      </div>
    </nav>
  );
}

function StatCard({ value, label, icon, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: 16, padding: "24px 28px",
      textAlign: "center",
      transition: "transform 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontSize: 36, fontWeight: 800, color: color,
        fontFamily: "'Georgia', serif", lineHeight: 1,
      }}>{value.toLocaleString()}</div>
      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function Hero({ stats, setPage }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${COLORS.blueDark} 0%, ${COLORS.blue} 60%, #0a5bbf 100%)`,
      padding: "60px 24px 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 400, height: 400, borderRadius: "50%",
        background: "rgba(120,184,51,0.08)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -120, left: -60,
        width: 300, height: 300, borderRadius: "50%",
        background: "rgba(245,166,35,0.06)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-block",
            background: `rgba(120,184,51,0.2)`,
            border: `1px solid ${COLORS.green}`,
            borderRadius: 100, padding: "6px 20px",
            color: COLORS.greenLight, fontSize: 13, fontWeight: 600,
            letterSpacing: "0.05em", marginBottom: 20,
          }}>
            🌱 Programa de Impacto Social — Nuevo León
          </div>
          <h1 style={{
            color: "#fff", fontSize: "clamp(32px, 5vw, 54px)",
            fontFamily: "'Georgia', serif", fontWeight: 700,
            lineHeight: 1.15, marginBottom: 16, letterSpacing: "-1px",
          }}>
            Juntos transformamos<br />
            <span style={{ color: COLORS.amber }}>la educación</span> en Nuevo León
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.75)", fontSize: 18, maxWidth: 600,
            margin: "0 auto 32px", lineHeight: 1.6,
          }}>
            Conectamos a empresas y personas con las necesidades reales de escuelas primarias públicas.
            Cada donativo genera un impacto medible y transparente.
          </p>
          <button onClick={() => {
            document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
          }} style={{
            background: COLORS.green, color: "#fff", border: "none",
            padding: "14px 32px", borderRadius: 10, fontSize: 16,
            fontWeight: 700, cursor: "pointer",
            boxShadow: `0 4px 20px rgba(120,184,51,0.4)`,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px rgba(120,184,51,0.5)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px rgba(120,184,51,0.4)`; }}
          >
            Ver Catálogo de Necesidades →
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}>
          <StatCard value={stats.schools} label="Escuelas Beneficiadas" icon="🏫" color={COLORS.greenLight} />
          <StatCard value={stats.students} label="Estudiantes Alcanzados" icon="👩‍🎓" color={COLORS.amber} />
          <StatCard value={stats.activeNeeds} label="Necesidades Activas" icon="📋" color="#fff" />
          <StatCard value={stats.teachers} label="Maestros Impactados" icon="👨‍🏫" color={COLORS.greenLight} />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ pct, color = COLORS.green }) {
  return (
    <div style={{ background: "#e8edf5", borderRadius: 100, height: 8, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: pct >= 75 ? COLORS.green : pct >= 40 ? COLORS.amber : "#e05c5c",
        borderRadius: 100, transition: "width 0.8s ease",
      }} />
    </div>
  );
}

function SchoolCard({ school, onClick }) {
  const totalCost = school.needs.reduce((s, n) => s + n.qty * n.unitCost, 0);

  return (
    <div onClick={onClick} style={{
      background: "#fff", borderRadius: 16,
      boxShadow: "0 2px 12px rgba(0,74,153,0.08)",
      border: "1px solid rgba(0,74,153,0.08)",
      overflow: "hidden", cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,74,153,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,74,153,0.08)"; }}
    >
      <div style={{ position: "relative" }}>
        <img src={school.image} alt={school.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
          <span style={{
            background: COLORS.blue, color: "#fff",
            borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600,
          }}>{school.category}</span>
          {school.urgent && (
            <span style={{
              background: "#e05c5c", color: "#fff",
              borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600,
            }}>🔥 Urgente</span>
          )}
        </div>
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
          borderRadius: 6, padding: "3px 10px",
          color: "#fff", fontSize: 11, fontWeight: 600,
        }}>
          {school.municipality}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <h3 style={{
          color: COLORS.text, fontSize: 15, fontWeight: 700,
          marginBottom: 6, lineHeight: 1.3,
        }}>{school.name}</h3>
        <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          {school.description.slice(0, 110)}…
        </p>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>Progreso de financiamiento</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: school.funded >= 75 ? COLORS.green : school.funded >= 40 ? COLORS.amber : "#e05c5c" }}>
              {school.funded}%
            </span>
          </div>
          <ProgressBar pct={school.funded} />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 12, borderTop: "1px solid #eef1f7",
        }}>
          <div style={{ fontSize: 12, color: COLORS.muted }}>
            👩‍🎓 <strong>{school.students}</strong> alumnos · 📚 <strong>{school.needs.length}</strong> necesidades
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: COLORS.blue,
          }}>
            ${(totalCost * (1 - school.funded / 100) / 1000).toFixed(0)}k restante
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, options, selected, toggle, collapsed, setCollapsed }) {
  return (
    <div style={{ borderBottom: "1px solid #e8edf5", paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setCollapsed(!collapsed)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 0", marginBottom: collapsed ? 0 : 12,
      }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.text }}>{title}</span>
        <span style={{
          color: COLORS.muted, fontSize: 18, transition: "transform 0.2s",
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
                {selected.includes(opt) && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
              </div>
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
                style={{ display: "none" }} />
              {opt}
              <span style={{
                marginLeft: "auto", background: "#f0f4fb",
                borderRadius: 100, padding: "1px 8px", fontSize: 11, color: COLORS.muted,
              }}>
                {MOCK_SCHOOLS.filter(s => s.municipality === opt || s.category === opt || s.type === opt).length}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ filters, setFilters, collapsed, setCollapsed }) {
  const [mun, setMun] = useState(false);
  const [cat, setCat] = useState(false);
  const [typ, setTyp] = useState(false);

  const toggle = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  };

  const activeCount = filters.municipalities.length + filters.categories.length + filters.types.length;

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid rgba(0,74,153,0.08)",
      boxShadow: "0 2px 12px rgba(0,74,153,0.06)",
      overflow: "hidden",
    }}>
      <button onClick={() => setCollapsed(!collapsed)} style={{
        width: "100%", background: COLORS.blue, border: "none", cursor: "pointer",
        padding: "14px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>🔍 Filtros</span>
          {activeCount > 0 && (
            <span style={{
              background: COLORS.amber, color: COLORS.text,
              borderRadius: 100, padding: "1px 8px", fontSize: 11, fontWeight: 700,
            }}>{activeCount}</span>
          )}
        </div>
        <span style={{
          color: "#fff", fontSize: 18, transition: "transform 0.2s",
          transform: collapsed ? "rotate(90deg)" : "rotate(-90deg)",
          display: "inline-block",
        }}>›</span>
      </button>

      {!collapsed && (
        <div style={{ padding: 20 }}>
          {activeCount > 0 && (
            <button onClick={() => setFilters({ municipalities: [], categories: [], types: [] })} style={{
              width: "100%", background: "#fee8e8", border: "1px solid #fbbaba",
              borderRadius: 8, padding: "8px", cursor: "pointer",
              color: "#c0392b", fontSize: 12, fontWeight: 600, marginBottom: 16,
            }}>
              ✕ Limpiar {activeCount} filtro{activeCount > 1 ? "s" : ""}
            </button>
          )}
          <FilterSection title="Municipio" options={MUNICIPALITIES} selected={filters.municipalities}
            toggle={v => toggle("municipalities", v)} collapsed={mun} setCollapsed={setMun} />
          <FilterSection title="Categoría" options={CATEGORIES} selected={filters.categories}
            toggle={v => toggle("categories", v)} collapsed={cat} setCollapsed={setCat} />
          <FilterSection title="Tipo de Institución" options={TYPES} selected={filters.types}
            toggle={v => toggle("types", v)} collapsed={typ} setCollapsed={setTyp} />
        </div>
      )}
    </div>
  );
}

function LeadForm({ school, onClose }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", org: "", msg: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    setSent(true);
    setTimeout(onClose, 3000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)", overflow: "hidden",
      }}>
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
              {[
                { key: "name", label: "Nombre completo*", placeholder: "Tu nombre" },
                { key: "email", label: "Correo electrónico*", placeholder: "correo@ejemplo.com" },
                { key: "phone", label: "Teléfono", placeholder: "+52 81 0000 0000" },
                { key: "org", label: "Empresa / Organización", placeholder: "Nombre de tu empresa" },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.key === "name" || f.key === "email" ? "auto" : "auto" }}>
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
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = COLORS.blue}
                    onBlur={e => e.target.style.borderColor = "#dde3f0"}
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
                  padding: "10px 12px", fontSize: 14, outline: "none", resize: "vertical",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = COLORS.blue}
                onBlur={e => e.target.style.borderColor = "#dde3f0"}
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={onClose} style={{
                flex: 1, background: "#f0f4fb", border: "none", cursor: "pointer",
                borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, color: COLORS.muted,
              }}>Cancelar</button>
              <button onClick={handleSubmit} style={{
                flex: 2, background: COLORS.green, border: "none", cursor: "pointer",
                borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, color: "#fff",
                boxShadow: `0 4px 16px rgba(120,184,51,0.35)`,
              }}>Enviar solicitud →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SchoolDetail({ school, onClose, onContact }) {
  const totalCost = school.needs.reduce((s, n) => s + n.qty * n.unitCost, 0);
  const remaining = totalCost * (1 - school.funded / 100);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)", zIndex: 9998,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      overflowY: "auto",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ position: "relative" }}>
          <img src={school.image} alt={school.name} style={{
            width: "100%", height: 220, objectFit: "cover", display: "block",
            borderRadius: "20px 20px 0 0",
          }} />
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer",
            borderRadius: "50%", width: 36, height: 36,
            color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            padding: "32px 28px 20px",
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ background: COLORS.blue, color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{school.category}</span>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{school.municipality}</span>
              {school.urgent && <span style={{ background: "#e05c5c", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>🔥 Urgente</span>}
            </div>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{school.name}</h2>
          <p style={{ color: COLORS.muted, lineHeight: 1.6, marginBottom: 24 }}>{school.description}</p>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24,
          }}>
            {[
              { label: "Estudiantes", val: school.students, icon: "👩‍🎓" },
              { label: "Docentes", val: school.teachers, icon: "👨‍🏫" },
              { label: "Necesidades", val: school.needs.length, icon: "📋" },
            ].map(s => (
              <div key={s.label} style={{
                background: COLORS.gray, borderRadius: 12, padding: "14px 16px", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: COLORS.text }}>{s.val}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Progreso de financiamiento</h3>
              <span style={{ fontWeight: 800, color: COLORS.green, fontSize: 18 }}>{school.funded}%</span>
            </div>
            <ProgressBar pct={school.funded} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: COLORS.muted }}>Recaudado: ${(totalCost * school.funded / 100).toLocaleString()}</span>
              <span style={{ fontSize: 12, color: "#e05c5c", fontWeight: 600 }}>Restante: ${remaining.toLocaleString()}</span>
            </div>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Desglose de Necesidades</h3>
          <div style={{ border: "1px solid #e8edf5", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
            {school.needs.map((n, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto",
                gap: 16, padding: "14px 16px", alignItems: "center",
                borderBottom: i < school.needs.length - 1 ? "1px solid #e8edf5" : "none",
                background: i % 2 === 0 ? "#fff" : COLORS.gray,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{n.item}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{n.model}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, color: COLORS.blue }}>{n.qty}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>unidades</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: COLORS.text }}>${(n.qty * n.unitCost).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>${n.unitCost.toLocaleString()} c/u</div>
                </div>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "14px 16px", background: COLORS.blue,
            }}>
              <span style={{ color: "#fff", fontWeight: 700 }}>Total estimado</span>
              <span style={{ color: COLORS.amber, fontWeight: 800, fontSize: 16 }}>${totalCost.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={onContact} style={{
            width: "100%", background: COLORS.green, border: "none", cursor: "pointer",
            borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, color: "#fff",
            boxShadow: `0 6px 20px rgba(120,184,51,0.4)`,
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            💚 Apoyar a esta escuela
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogPage({ setPage, setSelectedSchool: _setSelected }) {
  const [filters, setFilters] = useState({ municipalities: [], categories: [], types: [] });
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showLead, setShowLead] = useState(false);
  const [stats] = useState(INITIAL_STATS);

  const filtered = MOCK_SCHOOLS.filter(s => {
    if (filters.municipalities.length && !filters.municipalities.includes(s.municipality)) return false;
    if (filters.categories.length && !filters.categories.includes(s.category)) return false;
    if (filters.types.length && !filters.types.includes(s.type)) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Hero stats={stats} setPage={setPage} />

      <div id="catalog" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* Search bar */}
        <div style={{ marginBottom: 28, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔎</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Busca por nombre de escuela o descripción…"
              style={{
                width: "100%", padding: "13px 16px 13px 44px",
                border: "2px solid #dde3f0", borderRadius: 10, fontSize: 15,
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = COLORS.blue}
              onBlur={e => e.target.style.borderColor = "#dde3f0"}
            />
          </div>
          <div style={{ color: COLORS.muted, fontSize: 14, whiteSpace: "nowrap" }}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }}>
          {/* Sidebar */}
          <div style={{ position: "sticky", top: 80 }}>
            <Sidebar filters={filters} setFilters={setFilters}
              collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
          </div>

          {/* Grid */}
          <div>
            {filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px 24px",
                color: COLORS.muted,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontSize: 20, color: COLORS.text }}>Sin resultados</h3>
                <p>Prueba con otros filtros o términos de búsqueda.</p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 24,
              }}>
                {filtered.map(school => (
                  <SchoolCard key={school.id} school={school} onClick={() => setSelectedSchool(school)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedSchool && (
        <SchoolDetail
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
          onContact={() => { setShowLead(true); }}
        />
      )}
      {showLead && (
        <LeadForm school={selectedSchool} onClose={() => { setShowLead(false); setSelectedSchool(null); }} />
      )}
    </>
  );
}

function HowItWorksPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{ fontSize: 40, fontFamily: "'Georgia', serif", color: COLORS.text, fontWeight: 700, marginBottom: 16 }}>
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
              boxShadow: `0 8px 24px rgba(0,74,153,0.25)`,
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
          Contáctanos hoy y encuentra la forma ideal de apoyar la educación en Nuevo León.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ color: "#fff", fontSize: 14 }}>📧 contacto@mpj.org.mx</div>
          <div style={{ color: "#fff", fontSize: 14 }}>📞 +52 81 0000-0000</div>
        </div>
      </div>
    </div>
  );
}

function AdminPage({ stats, setStats }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [localStats, setLocalStats] = useState({ ...stats });
  const [footerSteps, setFooterSteps] = useState([...FOOTER_STEPS]);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const TABS = [
    { id: "upload", label: "📤 Carga de Archivo" },
    { id: "stats", label: "📊 Estadísticas" },
    { id: "footer", label: "📝 Contenido Footer" },
    { id: "schools", label: "🏫 Escuelas" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      {toast && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999,
          background: toast.type === "success" ? COLORS.green : "#e05c5c",
          color: "#fff", borderRadius: 10, padding: "14px 24px",
          fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.3s ease",
        }}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{
            background: COLORS.amber, borderRadius: 10, width: 44, height: 44,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>⚙️</div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.text }}>Panel de Administración</h1>
            <p style={{ color: COLORS.muted, fontSize: 14 }}>Mi Escuela Primero — Gestión de Contenidos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 28, overflowX: "auto",
        borderBottom: "2px solid #e8edf5", paddingBottom: 0,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 20px", fontSize: 14, fontWeight: 600,
            color: activeTab === t.id ? COLORS.blue : COLORS.muted,
            borderBottom: `2px solid ${activeTab === t.id ? COLORS.blue : "transparent"}`,
            marginBottom: -2, whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div>
          <div style={{
            border: "2px dashed #c8d0e0", borderRadius: 16, padding: "48px",
            textAlign: "center", background: "#fafbff",
            transition: "border-color 0.2s, background 0.2s",
          }}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = COLORS.blue; e.currentTarget.style.background = "#f0f4ff"; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = "#c8d0e0"; e.currentTarget.style.background = "#fafbff"; }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
              Carga el Archivo Maestro
            </h3>
            <p style={{ color: COLORS.muted, marginBottom: 24 }}>
              Arrastra aquí tu archivo Excel (.xlsx) o CSV, o haz clic para seleccionar
            </p>
            <input
              type="file" accept=".xlsx,.csv" id="fileInput" style={{ display: "none" }}
              onChange={e => {
                if (e.target.files[0]) {
                  setUploadStatus("processing");
                  setTimeout(() => {
                    setUploadStatus("success");
                    showToast("Archivo procesado: 6 escuelas actualizadas exitosamente");
                  }, 1800);
                }
              }}
            />
            <label htmlFor="fileInput" style={{
              display: "inline-block",
              background: COLORS.blue, color: "#fff",
              padding: "12px 28px", borderRadius: 10, cursor: "pointer",
              fontWeight: 700, fontSize: 15,
              boxShadow: `0 4px 16px rgba(0,74,153,0.3)`,
            }}>
              {uploadStatus === "processing" ? "⏳ Procesando…" : "Seleccionar Archivo"}
            </label>

            {uploadStatus === "success" && (
              <div style={{
                marginTop: 24, background: "#e8f5e0", border: "1px solid #a8d88a",
                borderRadius: 12, padding: "16px 24px", textAlign: "left",
              }}>
                <div style={{ fontWeight: 700, color: "#2d7a1f", marginBottom: 8 }}>✅ Archivo procesado exitosamente</div>
                <div style={{ fontSize: 13, color: "#4a7a3a" }}>• 6 escuelas actualizadas · 3 nuevas necesidades detectadas · 1 escuela marcada urgente</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 24, background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e8edf5" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Formato del Archivo Maestro</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: COLORS.blue }}>
                    {["Columna", "Tipo", "Ejemplo", "Requerido"].map(h => (
                      <th key={h} style={{ color: "#fff", padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["nombre_escuela", "Texto", "Escuela Primaria Benito Juárez", "✅"],
                    ["municipio", "Texto", "Monterrey", "✅"],
                    ["categoria", "Texto", "Tecnología", "✅"],
                    ["tipo_institucion", "Texto", "Pública", "✅"],
                    ["descripcion", "Texto largo", "Esta escuela necesita…", "✅"],
                    ["porcentaje_fondeo", "Número (0-100)", "62", "✅"],
                    ["estudiantes", "Número", "320", "❌"],
                    ["maestros", "Número", "12", "❌"],
                    ["urgente", "Booleano", "true/false", "❌"],
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : COLORS.gray }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: "10px 14px", borderBottom: "1px solid #e8edf5",
                          fontFamily: j === 0 ? "monospace" : "inherit",
                          color: j === 0 ? COLORS.blue : COLORS.text,
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => showToast("Plantilla CSV descargada")}
              style={{
                marginTop: 16, background: COLORS.gray, border: "1px solid #dde3f0",
                borderRadius: 8, padding: "10px 20px", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: COLORS.blue,
              }}>
              📥 Descargar Plantilla CSV
            </button>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>
            Estadísticas del Hero Section
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { key: "schools", label: "Escuelas Beneficiadas", icon: "🏫" },
              { key: "students", label: "Estudiantes Alcanzados", icon: "👩‍🎓" },
              { key: "activeNeeds", label: "Necesidades Activas", icon: "📋" },
              { key: "teachers", label: "Maestros Impactados", icon: "👨‍🏫" },
            ].map(f => (
              <div key={f.key} style={{
                background: "#fff", border: "1px solid #e8edf5",
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 8 }}>
                  {f.label}
                </label>
                <input
                  type="number"
                  value={localStats[f.key]}
                  onChange={e => setLocalStats(s => ({ ...s, [f.key]: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: "100%", border: "2px solid #dde3f0", borderRadius: 8,
                    padding: "10px 12px", fontSize: 20, fontWeight: 800,
                    color: COLORS.blue, outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = COLORS.blue}
                  onBlur={e => e.target.style.borderColor = "#dde3f0"}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => { setStats(localStats); showToast("Estadísticas actualizadas en la página principal"); }}
            style={{
              marginTop: 24, background: COLORS.green, border: "none", cursor: "pointer",
              borderRadius: 10, padding: "13px 32px", fontSize: 15, fontWeight: 700, color: "#fff",
              boxShadow: `0 4px 16px rgba(120,184,51,0.35)`,
            }}>
            💾 Guardar Cambios
          </button>
        </div>
      )}

      {/* Footer Tab */}
      {activeTab === "footer" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>
            Editar Pasos "¿Qué Sigue?"
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {footerSteps.map((step, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid #e8edf5",
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{step.icon}</span>
                  <span style={{
                    background: COLORS.blue, color: "#fff",
                    borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700,
                  }}>Paso {i + 1}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 6 }}>Título</label>
                    <input value={step.title}
                      onChange={e => setFooterSteps(steps => steps.map((s, j) => j === i ? { ...s, title: e.target.value } : s))}
                      style={{ width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: "block", marginBottom: 6 }}>Descripción</label>
                    <input value={step.desc}
                      onChange={e => setFooterSteps(steps => steps.map((s, j) => j === i ? { ...s, desc: e.target.value } : s))}
                      style={{ width: "100%", border: "1.5px solid #dde3f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast("Contenido del footer actualizado")}
            style={{
              marginTop: 24, background: COLORS.green, border: "none", cursor: "pointer",
              borderRadius: 10, padding: "13px 32px", fontSize: 15, fontWeight: 700, color: "#fff",
            }}>
            💾 Guardar Footer
          </button>
        </div>
      )}

      {/* Schools Tab */}
      {activeTab === "schools" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>
            Gestión de Escuelas ({MOCK_SCHOOLS.length} registradas)
          </h3>
          <div style={{ border: "1px solid #e8edf5", borderRadius: 14, overflow: "hidden" }}>
            {MOCK_SCHOOLS.map((school, i) => (
              <div key={school.id} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto auto",
                gap: 16, padding: "16px 20px", alignItems: "center",
                borderBottom: i < MOCK_SCHOOLS.length - 1 ? "1px solid #e8edf5" : "none",
                background: i % 2 === 0 ? "#fff" : COLORS.gray,
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{school.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{school.municipality} · {school.category}</div>
                </div>
                <div style={{ width: 100 }}>
                  <ProgressBar pct={school.funded} />
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 3, textAlign: "center" }}>{school.funded}%</div>
                </div>
                {school.urgent && (
                  <span style={{ background: "#fee8e8", color: "#c0392b", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>
                    Urgente
                  </span>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => showToast(`Editando: ${school.name}`)} style={{
                    background: COLORS.blue, color: "#fff", border: "none", cursor: "pointer",
                    borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                  }}>Editar</button>
                  <button onClick={() => showToast("Acción de eliminar (simulada)", "error")} style={{
                    background: "#fee8e8", color: "#c0392b", border: "none", cursor: "pointer",
                    borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                  }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: COLORS.blueDark, padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            color: "#fff", fontSize: 32, fontFamily: "'Georgia', serif",
            fontWeight: 700, marginBottom: 12,
          }}>¿Qué Sigue?</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>
            Así funciona el proceso para hacer tu donativo
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 32, marginBottom: 56,
        }}>
          {FOOTER_STEPS.map((step, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 36, marginBottom: 12,
                width: 64, height: 64,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 12px",
              }}>{step.icon}</div>
              <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{step.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 32, display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            © 2024 Mi Escuela Primero — Nuevo León, México
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>📧 contacto@mpj.org.mx</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>📞 +52 81 0000-0000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [stats, setStats] = useState(INITIAL_STATS);

  const renderPage = () => {
    switch (page) {
      case "home": return <CatalogPage setPage={setPage} />;
      case "how": return <HowItWorksPage />;
      case "admin": return adminUnlocked
        ? <AdminPage stats={stats} setStats={setStats} />
        : <div style={{ textAlign: "center", padding: 80, color: COLORS.muted }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: COLORS.text }}>Acceso Restringido</h2>
          <p>Esta sección es solo para administradores de Mi Escuela Primero.</p>
          <button onClick={() => { setAdminUnlocked(true); }} style={{
            marginTop: 16, background: COLORS.blue, color: "#fff", border: "none",
            padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontWeight: 700,
          }}>Simular Inicio de Sesión →</button>
        </div>;
      default: return <div style={{ padding: 80, textAlign: "center" }}>
        <h2>Página no encontrada</h2>
        <button onClick={() => setPage("home")} style={{ color: COLORS.blue, cursor: "pointer", background: "none", border: "none", fontSize: 16 }}>← Volver al inicio</button>
      </div>;
    }
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: COLORS.gray, color: COLORS.text }}>
      <style>{`* { margin: 0; padding: 0; box-sizing: border-box; } body { background: ${COLORS.gray}; }`}</style>
      <Navbar page={page} setPage={setPage} adminUnlocked={adminUnlocked} setAdminUnlocked={setAdminUnlocked} />
      <main style={{ minHeight: "calc(100vh - 64px)" }}>
        {renderPage()}
      </main>
      {page !== "admin" && <Footer setPage={setPage} />}
    </div>
  );
}
