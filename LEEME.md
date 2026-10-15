# Essenza — sitio web (HTML estático + Google Sheet)

Sitio sin dependencias: HTML + una hoja de estilos + JavaScript. Se sube tal cual al hosting.
Los datos que cambian seguido (precios, horarios, teléfonos, fechas de la colonia) se editan en una
Google Sheet: la web los lee sola, sin volver a subir archivos.

## Estructura

```
index.html              Home
colonia.html            Colonia de vacaciones (verano e invierno)
planes.html             Planes y aranceles
piscina.html            Fichas de actividad (misma plantilla)
gym.html
domo.html
pilates-studio.html
pilates-reformer.html
revisar.html            Revisión de datos (no está en el menú ni en Google)
css/styles.css          Todos los estilos. Colores de marca como variables en :root
js/datos.js             Lee la Google Sheet. Acá van los 3 enlaces CSV
js/main.js              Animaciones, filtro, pestañas, menú móvil
_planilla/*.csv         Contenido inicial de la planilla (para importar una sola vez)
```

## Puesta en marcha de la planilla (una sola vez, ~10 minutos)

1. Creá una Google Sheet nueva en la cuenta de Juna, llamada "Essenza · datos web".
2. Creá tres pestañas con estos nombres exactos: `precios`, `horarios`, `datos`.
3. En cada pestaña: Archivo › Importar › Subir el CSV correspondiente de `_planilla/` ›
   "Reemplazar la hoja actual".
4. Publicá cada pestaña: Archivo › Compartir › Publicar en la Web › elegí la pestaña ›
   formato "Valores separados por comas (.csv)" › Publicar. Copiá el enlace.
5. Pegá los tres enlaces en `js/datos.js`, en `ESSENZA_HOJAS`, y subí ese archivo al hosting.
6. Abrí `tusitio/revisar.html`: las tres pestañas tienen que figurar como "Conectada".

Recomendado en la planilla: en `datos`, poné listas desplegables (Datos › Validación de datos)
para `modo_precios` (completos / desde / ocultos) y `colonia_temporada` (verano / invierno / ninguna),
y dejá la edición solo para la gente de Juna.

## Cómo se actualiza

- **Precios** (pestaña `precios`): cambiá solo la columna `precio` (número, sin $ ni puntos).
  No toques la columna `id`: es la que conecta cada fila con su lugar en la web.
  El "desde $X" de la home y de las tarjetas se calcula solo con el precio más bajo.
- **Horarios** (pestaña `horarios`): una fila por franja horaria. `actividad` es el nombre de la
  página (piscina, gym, domo, pilates-studio, pilates-reformer). Si una actividad no tiene filas,
  la web muestra los horarios escritos en el HTML. Las celdas que dicen "gratis" se resaltan.
- **Datos generales** (pestaña `datos`): teléfonos, dirección, horario de atención, Instagram,
  fechas de la colonia, modo de precios y temporada de la colonia.
  - `colonia_temporada = verano | invierno` cambia la banda azul de la home y la cinta de la tarjeta.
    Con `ninguna` se oculta la banda y la colonia pasa al final de la grilla
    (usarlo en marzo–abril y agosto–septiembre).
  - Teléfonos: formato 598 + número sin el 0 (ej. 098 177 013 → 59898177013).

Los cambios tardan unos 5 minutos en verse (demora de Google al publicar) y cada visitante
guarda la planilla 10 minutos en su navegador. Para verlos ya, abrí la web en una ventana privada.

**Después de cada cambio, abrí `revisar.html`.** Lee la planilla en el momento y marca:
filas que faltan, precios que no son números, ids mal escritos, teléfonos incompletos,
valores no válidos y textos entre corchetes que siguen pendientes en las páginas.

## Si la planilla falla

La web nunca queda vacía: todos los datos están también escritos en el HTML. Si Google no responde
o una celda está vacía o mal escrita, se muestra lo del HTML. Por eso conviene, cada tanto,
actualizar también el HTML con los valores vigentes.

## Qué NO se edita en la planilla

Textos, títulos, fotos, nuevas actividades o secciones: eso se edita en el HTML.
Si agregás un plan nuevo, tiene que existir en el HTML con su `data-precio="clave.frecuencia"`
y en la planilla con el mismo id.

## Otros ajustes

- **Colores:** variables al principio de `css/styles.css`.
- **Animaciones:** se apagan solas con "reducir movimiento" del sistema.
  `data-reveal="1"` (2, 3 o 4 = con retardo) hace aparecer un bloque al hacer scroll.
  `data-px="0.1"` da parallax (negativo = sentido contrario).

## Pendiente antes de lanzar (revisar.html te los lista)

- WhatsApp general de Essenza (natación 098 177 013 y colonia 092 222 841 ya están cargados).
- Dirección, horario de atención, Instagram, mapa (iframe de Google Maps en el pie, en el HTML).
- Colonia: valores y fechas 2026–2027 de verano; planes, valores, fechas y horarios de invierno.
- Horarios reales de cada actividad.
- Beneficios heredados de Chapoteando (plan familiar 20% e invitados): confirmar que sigan vigentes.
- Fotos reales del predio (las actuales son provisorias). Falta Pilates Studio.
- Logo positivo oficial, idealmente en SVG (el actual es provisorio).
- Precios a confirmar: Reformer ($2.000) más barato que Studio ($2.200); Studio 3 veces ($4.500).
- Favicon, Open Graph (imagen al compartir en WhatsApp/redes) y Google Analytics.
