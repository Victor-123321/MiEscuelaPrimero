# Brand Guidelines — Mexicanos Primero Jalisco

![Mexicanos Primero Jalisco Logo](../docs/assets/logo/logo_color.png)
<!-- TODO: Add actual logo image from Google Drive ZZ Fotos para Reto Tec -->

## Organization

**Mexicanos Primero Jalisco**
Movilización de personas y grupos en torno a una iniciativa cívica independiente y plural, enfocada en la calidad educativa.

**Motto:** *Sólo la educación de calidad cambia a Jalisco*

---

## Color Palette

![Brand Colors](../docs/assets/brand/color_palette.png)
<!-- TODO: Download color palette image from Google Drive -->

| Name | HEX | RGB | CMYK | Pantone | Usage |
|------|-----|-----|------|---------|-------|
| **Primary Green** | `#009933` | R:0 G:152 B:69 | C:93 M:2 Y:96 K:0 | 347 C | Success, active states, primary actions |
| **Dark Blue** | `#1C3661` | R:28 G:54 B:97 | C:100 M:83 Y:35 K:21 | 2210 C | Info, secondary actions, neutral states |
| **Orange** | `#EC671B` | R:236 G:103 B:27 | C:0 M:70 Y:95 K:0 | 3564 C | Warnings, important notifications |
| **Yellow** | `#F4981C` | R:244 G:152 B:28 | C:0 M:47 Y:93 K:0 | 2010 C | Cautions, pending states |
| **Black** | `#000000` | R:0 G:0 B:0 | — | — | Errors, critical notifications |

### API Status Color Mapping

```json
{
  "success": "#009933",
  "info":    "#1C3661",
  "warning": "#EC671B",
  "caution": "#F4981C",
  "error":   "#000000"
}
```

---

## Typography

### Primary Font: Montserrat

- Versions: Light, Regular, Italic, Bold
- Usage: All documentation, written documents, formal communications

```css
font-family: 'Montserrat', sans-serif;
```

### Secondary Font: Watermelon

- Version: Regular
- Usage: Social media graphics, advertising (frontend only)
- **Do NOT use** in backend documentation or API responses

---

## Logo Usage

![Logo Color](../docs/assets/logo/logo_color.png)
<!-- TODO: Add actual logo from Google Drive -->

- Minimum digital size: **80px** width
- Always maintain **1× safety area** around the logo
- Use color version (`#009933`) as primary
- Use black or white version as fallback on colored backgrounds

---

## Tone of Communication

- **Professional yet accessible** — civic, educational, empowering
- **Bilingual** — Spanish primary, English secondary
- **Constructive errors** — error messages should guide users toward resolution

### Example error messages

```
❌  "Error 400"
✅  "No se pudo guardar la escuela. Verifica que el nombre y municipio estén completos."

❌  "Unauthorized"
✅  "Sesión expirada. Por favor, inicia sesión de nuevo para continuar."
```
