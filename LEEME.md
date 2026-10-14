# Essenza — sitio web (HTML estático)

Sitio sin dependencias: HTML + una hoja de estilos + un JavaScript. Se sube tal cual al hosting.

## Estructura

```
index.html              Home
planes.html             Planes y aranceles
piscina.html            Fichas de actividad (misma plantilla)
gym.html
domo.html
pilates-studio.html
pilates-reformer.html
css/styles.css          Todos los estilos. Colores de marca como variables en :root
js/main.js              Animaciones, filtro, pestañas, menú móvil y modo de precios
img/                    Logos y fotos
```

## Cómo cambiar…

- **Colores:** variables al principio de `css/styles.css` (`--verde`, `--turquesa`, `--azul`, etc.).
- **Mostrar u ocultar precios en todo el sitio:** en `js/main.js`, línea `var PRECIOS = null;`
  - `'completos'` todas las tarifas · `'desde'` solo el precio más bajo · `'ocultos'` “Consultá”.
  - Con `null` usa el `data-precios` de cada página (hoy: `completos`).
- **Animaciones:** se apagan solas si el usuario tiene activado “reducir movimiento” en su sistema.
  Para marcar un bloque que aparezca al hacer scroll: `data-reveal="1"` (2, 3 o 4 = con retardo).
  Parallax: `data-px="0.1"` (velocidad; negativo = sentido contrario).

## Pendiente antes de publicar (buscar `[` y `TODO` en los archivos)

- Número de WhatsApp real: reemplazar `598XXXXXXXX` en todos los HTML.
- Dirección, horarios, Instagram, mapa (iframe de Google Maps en el pie).
- Horarios reales de cada actividad (recomendado: leerlos de una planilla publicada).
- Fotos reales del predio (las actuales son provisorias, tomadas del PDF). Faltan Domo y Pilates Studio.
- Logo: `logo-essenza.png` (positivo) es una versión provisoria; reemplazar por la oficial del manual, idealmente en SVG.
- Natación para embarazadas: confirmar si existe (no figura en la grilla).
- Precios a confirmar: Reformer ($2.000) más barato que Studio ($2.200); Studio 3 veces ($4.500).
- Favicon, Open Graph (imagen para compartir en WhatsApp/redes) y Google Analytics.
