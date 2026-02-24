# 🏫 Mi Escuela Primero — Interactive Impact Catalog

> A social impact platform connecting donors with real needs of public elementary schools in Nuevo León, México.

![Mi Escuela Primero](https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=400&fit=crop)

---

## 📖 About

**Mi Escuela Primero** is a web platform built for a social impact program in Nuevo León, México. It serves as an interactive catalog that transparently showcases the needs of public elementary schools — from technology equipment and furniture to infrastructure repairs and sports gear — enabling companies and individuals to make targeted, meaningful donations.

The platform bridges the gap between schools that lack resources and donors who want to help, ensuring every contribution is traceable and impactful.

---

## ✨ Features

### 🗺️ Multi-Page Application
- **Home / Catalog** — Hero section with live impact statistics, searchable and filterable school grid
- **How It Works** — Step-by-step donation process walkthrough
- **School Detail View** — Full breakdown of needs, quantities, models, and estimated costs per school
- **Admin Dashboard** — Private panel for webmaster content management

### 🔍 Smart Filtering
- Filter by **Municipality**, **Category**, and **Institution Type**
- Collapsible sidebar to maximize screen space on any device
- Real-time search across school names and descriptions
- Active filter count badge for quick reference

### 🏫 School Cards
- Photo, description, category, and municipality tags
- Visual **funding progress bar** (color-coded by urgency)
- Urgent school indicators 🔥
- Remaining funding amount at a glance

### 💬 Lead Generation
- "Support This School" button on every card and detail view
- Professional contact/donation form (name, email, phone, organization, message)
- Success confirmation with auto-close

### ⚙️ Admin Dashboard
| Tab | Functionality |
|-----|---------------|
| 📤 File Upload | Drag & drop Excel/CSV master file with format reference and downloadable template |
| 📊 Statistics | Edit hero section impact numbers live |
| 📝 Footer Content | Update "What's Next?" steps and contact info |
| 🏫 Schools | View, edit, and delete school listings |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Deep Blue | `#004A99` | Primary branding, navbar, buttons |
| Lime Green | `#78B833` | Progress bars, CTAs, success states |
| Amber/Orange | `#F5A623` | Impact highlights, badges, stats |
| Text | `#1a2740` | Body copy |
| Muted | `#6b7a99` | Secondary text, labels |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

```bash
node -v   # should be 18+
npm -v    # should be 9+
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mi-escuela-primero.git
cd mi-escuela-primero

# 2. Create a Vite + React project (if starting fresh)
npm create vite@latest . -- --template react

# 3. Install dependencies
npm install

# 4. Replace App.jsx with the platform file
cp path/to/mi-escuela-primero.jsx src/App.jsx

# 5. Clear default styles
echo "" > src/App.css
echo "" > src/index.css

# 6. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
mi-escuela-primero/
├── public/
├── src/
│   ├── App.jsx          # Main application (all components)
│   ├── App.css          # (empty — styles are inline)
│   ├── index.css        # (empty — reset only)
│   └── main.jsx         # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 📋 Master File Format (CSV/Excel Upload)

The Admin panel accepts `.xlsx` or `.csv` files with the following columns:

| Column | Type | Required |
|--------|------|----------|
| `nombre_escuela` | Text | ✅ |
| `municipio` | Text | ✅ |
| `categoria` | Text | ✅ |
| `tipo_institucion` | Text | ✅ |
| `descripcion` | Long text | ✅ |
| `porcentaje_fondeo` | Number (0–100) | ✅ |
| `estudiantes` | Number | ❌ |
| `maestros` | Number | ❌ |
| `urgente` | Boolean (`true`/`false`) | ❌ |

---

## 🗺️ Roadmap

- [ ] Supabase integration for real-time data persistence
- [ ] Admin authentication (Supabase Auth)
- [ ] School detail dedicated pages with shareable URLs
- [ ] Social sharing buttons per school
- [ ] Email notifications for new donor leads
- [ ] Donor dashboard with contribution history
- [ ] Mobile app (React Native)

---

## 🛠️ Tech Stack

- **Framework** — [React 18](https://react.dev/) via [Vite](https://vitejs.dev/)
- **Styling** — Inline styles with CSS variables (no external CSS framework required)
- **Icons** — Emoji-based (Lucide React ready to integrate)
- **File Parsing** — PapaParse-ready CSV/Excel upload component
- **Database (planned)** — [Supabase](https://supabase.com/)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

MIT © Mi Escuela Primero — Nuevo León, México

---

## 💚 About the Program

**Mi Escuela Primero** is a social impact initiative dedicated to improving educational conditions in public elementary schools across Nuevo León. Every donation is tracked, reported, and directly applied to the school's specific needs.

📧 contacto@mpj.org.mx · 📞 +52 81 0000-0000
