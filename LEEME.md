# Essenza — sitio web (HTML estático)

Sitio sin dependencias: HTML + una hoja de estilos + un JavaScript. Se sube tal cual al hosting.

## Estructura

```
index.html              Home
colonia.html            Colonia de vacaciones (página propia)
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

- WhatsApp: Natación usa 098 177 013 y Colonia 092 222 841 (datos de los materiales de Chapoteando).
  Falta el número general de Essenza: reemplazar `598XXXXXXXX` en el resto de los botones.
- Colonia: valores 2026–2027 y fechas de la temporada (hoy muestra los de 2025–2026 como referencia).
  La colonia tiene dos ediciones: verano (inscripciones oct–feb) e invierno (vacaciones de julio, inscripciones may–jul).
  Cambiar el texto de la banda azul de la home (comentario TEMPORADA) según la edición abierta; quitarla en mar–abr y ago–sep.
  Completar planes, valores, fechas y horarios de la colonia de invierno (hoy con [—]).
- Beneficios heredados de Chapoteando (plan familiar 20% e invitados): confirmar que sigan vigentes.
- Dirección, horarios, Instagram, mapa (iframe de Google Maps en el pie).
- Horarios reales de cada actividad (recomendado: leerlos de una planilla publicada).
- Fotos reales del predio (las actuales son provisorias, tomadas del PDF). Faltan Domo y Pilates Studio.
- Logo: `logo-essenza.png` (positivo) es una versión provisoria; reemplazar por la oficial del manual, idealmente en SVG.
- Precios a confirmar: Reformer ($2.000) más barato que Studio ($2.200); Studio 3 veces ($4.500).
- Favicon, Open Graph (imagen para compartir en WhatsApp/redes) y Google Analytics.
