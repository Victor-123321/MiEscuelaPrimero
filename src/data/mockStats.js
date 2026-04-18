export const INITIAL_STATS = {
  schools: 16,
  students: 1855,
  activeNeeds: 48,
  teachers: 60,
};

export const FOOTER_STEPS = [
  { icon: "🔍", title: "Explora las necesidades", desc: "Navega el catálogo y encuentra la escuela o necesidad que más resuene contigo." },
  { icon: "📞", title: "Contáctanos", desc: "Completa el formulario o llámanos. Rosalba te guiará en todo el proceso." },
  { icon: "🤝", title: "Coordinamos juntos", desc: "Conectamos tu donativo directamente con la escuela beneficiada." },
  { icon: "🎉", title: "Generamos impacto", desc: "Recibe un reporte del impacto real de tu contribución en la comunidad." },
];

export const CONTACT = {
  name: "Rosalba Gascón",
  title: "Coordinadora de Mi Escuela Primero",
  email: "rgascon@mpj.org.mx",
  phone: "33 1177 8783",
  website: "https://mexicanosprimerojalisco.org/",
  facebook: "@MexPrimJal",
  instagram: "@mexicanosprimjal",
};

// Tipos de donativo per the MPJ spec
// CONTRIBUTION_TYPES is an alias used by ContributeStrip and HowItWorksPage
export const DONATION_TYPES = [
  { id: "formacion_familias",     label: "Formación para familias",          icon: "👨‍👩‍👧", group: "formacion" },
  { id: "formacion_estudiantes",  label: "Formación para estudiantes",       icon: "📚", group: "formacion" },
  { id: "formacion_docentes",     label: "Formación a docentes",             icon: "🧑‍🏫", group: "formacion" },
  { id: "atencion_psicologica",   label: "Atención psicológica para estudiantes", icon: "🧠", group: "psicologia" },
  { id: "material_tecnologico",   label: "Material tecnológico",             icon: "💻", group: "material" },
  { id: "material_papeleria",     label: "Material de papelería",            icon: "📝", group: "material" },
  { id: "material_literario",     label: "Material literario",               icon: "📖", group: "material" },
  { id: "material_ed_fisica",     label: "Material de educación física",     icon: "⚽", group: "material" },
  { id: "material_infraestructura", label: "Material de infraestructura",   icon: "🔨", group: "material" },
  { id: "mobiliario",             label: "Mobiliario",                       icon: "🪑", group: "material" },
  { id: "transporte",             label: "Transporte",                       icon: "🚌", group: "acceso" },
  { id: "condiciones_camino",     label: "Condiciones del camino",           icon: "🛤️", group: "acceso" },
  { id: "salud_fisica",           label: "Salud física",                     icon: "🏥", group: "acceso" },
  { id: "visitas_extraescolares", label: "Visitas extraescolares",           icon: "🗺️", group: "acceso" },
  { id: "apoyo_gestion",          label: "Apoyo en gestión",                 icon: "📋", group: "acceso" },
  { id: "otro",                   label: "Otro",                             icon: "➕", group: "otro" },
];

export const TIPOS_INSTANCIA = [
  { id: "empresa",              label: "Empresa" },
  { id: "osc",                  label: "Organización de la sociedad civil" },
  { id: "inst_educativa",       label: "Institución educativa" },
  { id: "gobierno_municipal",   label: "Gobierno municipal" },
  { id: "ninguna",              label: "No represento una instancia" },
  { id: "otro",                 label: "Otro" },
];

// Alias used in ContributeStrip and HowItWorksPage
export const CONTRIBUTION_TYPES = DONATION_TYPES;
