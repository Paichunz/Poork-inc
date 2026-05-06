# DESIGN.md — POORK INC.

## Color System

### La Agencia (modo serio)
- Background: oklch(10% 0.006 30) — casi negro con temperatura cálida
- Foreground: oklch(94% 0.008 60) — crema cálida
- Accent: oklch(72% 0.12 78) — dorado (#c9a84c)
- Border: oklch(14% 0.004 30)

### Lo Que Sea — 8 estilos con sus propios sistemas
Cada estilo tiene --irr-bg, --irr-fg, --irr-accent, --irr-font-display, --irr-font-body

| Estilo | BG | FG | Accent | Font Display |
|---|---|---|---|---|
| Minimalism | #fafafa | #111 | #bbb | Raleway 100 |
| Popping Colors | #f7f700 | #0a0aff | #ff0080 | Unbounded 900 |
| Y2K | #000 | #00ff88 | #00ff88 | Press Start 2P |
| Font Mixing | #fff | #000 | #c8102e | Abril Fatface |
| Romantasy | #1a0e24 | #f0e6d0 | #d4a0c0 | Cormorant Garamond 300i |
| Neoclásico | #f9f5ec | #1a1108 | #8b6914 | IM Fell English |
| Cottagecore | #f5ede0 | #2d2416 | #6b8c42 | Fraunces 300i |
| Brutalism | #fff | #000 | #ff0000 | Unbounded 900 |

## Typography

### La Agencia
- Display: Playfair Display 700 / italic 400
- Body: DM Sans 300 / 400 / 700
- Mono: Space Mono 400

### Lo Que Sea
Varía por estilo (ver tabla arriba). Sistema de 8 estilos con fuentes distintas.

## Drop Pages — patrón de diseño

Cada landing de drop es autónoma con su propia identidad. Elementos comunes:
- Hero con gráfica de producto CSS/SVG de alta calidad (no stock)
- Pirámide de producto / notas / características
- Pricing en CLP
- Testimonios ficticios pero verosímiles
- CTA que al hacer click muestra alert irónico
- Footer que enlaza a poork-inc.vercel.app

## Gráficas de producto (CSS art)

Los productos visualizados en CSS puro:
- Frascos/botellas: border-radius + gradientes + etiquetas
- Cajas de medicamentos: grid de paneles con tipografía apilada
- Velas: cilindro CSS con llama animada
- Perfumes: botella rectangular con cap y etiqueta
- Hovercrafts: vista lateral con skirt y propulsores

## Spacing system
- Base: 8px
- Scale: 8, 16, 24, 32, 48, 64, 80, 96, 120, 160
- Secciones hero: min-height 90–100vh
- Padding de sección: 80–120px vertical / 40–60px horizontal

## Component patterns
- Tarjetas de drop: no cards genéricas — usar layouts de tabla, listas o grids asimétricos
- CTAs: siempre con peso fuerte, letra espaciada
- Testimonios: comillas con tipografía display, cita-autor formato editorial
- Precios: tipografía display grande, tachados con opacity 0.4
