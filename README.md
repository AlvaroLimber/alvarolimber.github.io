# alvarolimber.github.io

Web personal de Alvaro Chirino, hecha con [Quarto](https://quarto.org).

## Trabajar desde RStudio

1. Abrir `alvarolimber.github.io.Rproj`.
2. Previsualizar: pestaña **Build → Render Website**, o en la consola:
   `quarto::quarto_preview()` (o en Terminal: `quarto preview`).
3. Publicar: `quarto render` y luego commit + push. GitHub Pages sirve la carpeta `docs/`.

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Menú, redes, tema, pie de página | `_quarto.yml`, `_includes/footer.html` |
| Colores y estilo | `styles/common.scss` (reglas), `styles/dark.scss` y `styles/light.scss` (colores de cada tema; el oscuro es el predeterminado) |
| Inicio | `index.qmd` |
| Sobre mí (formación, experiencia, proyectos) | `sobre-mi.qmd` |
| Publicaciones | `publicaciones.bib` (BibTeX; `datos/publicaciones.yml` se genera solo al renderizar) |
| Charlas | `datos/charlas.yml` |
| Cursos actuales, apuntes en línea, tesis | `docencia/index.qmd`, `datos/tesis.yml` |
| Página de un curso | `docencia/cursos/NOMBRE.qmd` (copiar uno existente) |
| Entrada de blog | `blog/posts/AAAA-MM-DD-titulo/index.qmd` |
| CV (web + PDF) | `cv.qmd`: al renderizar genera `cv.html` y `cv.pdf` (Typst, sin LaTeX). Las publicaciones salen de `publicaciones.bib` en formato APA |
| PDFs de artículos / programas / plantillas | `papers/`, `files/programas/`, `files/plantillas/` |

Las entradas de blog pueden incluir código R (chunks ```` ```{r} ````); con `freeze: auto` solo se re-ejecutan cuando cambian.

Las URLs antiguas (`/talks/2024/02/01/EST133-I2024.html`, `/publications/`, etc.) redirigen a las nuevas mediante `aliases:`.

## Publicaciones (BibTeX)

`publicaciones.bib` es la fuente única. Antes de cada render, `R/bib2yml.R` lo convierte en `datos/publicaciones.yml` (no edite ese archivo a mano). Requiere los paquetes `jsonlite` y `yaml`.

Campos extra que usa la web: `file = {x.pdf}` (PDF en `papers/`), `keywords = {Artículo con referato}` (categoría del filtro), `abstract`, `doi`, `url`.

Para agregar desde Google Scholar: en su perfil, marque el artículo → **Exportar → BibTeX**, pegue la entrada en `publicaciones.bib` y agregue `file`/`keywords` si corresponde.
