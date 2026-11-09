# Convierte publicaciones.bib -> datos/publicaciones.yml
# Se ejecuta solo antes de cada render (pre-render en _quarto.yml).
# Requiere los paquetes jsonlite y yaml.

bib_file <- "publicaciones.bib"
out_file <- "datos/publicaciones.yml"

# 1. Entradas crudas (para mostrar el BibTeX tal cual y leer 'file')
txt <- enc2utf8(paste(readLines(bib_file, encoding = "UTF-8", warn = FALSE), collapse = "\n"))
txt <- gsub("(?m)^%.*$", "", txt, perl = TRUE)                 # quita comentarios
starts <- gregexpr("@[A-Za-z]+\\s*\\{", txt)[[1]]
ends <- c(starts[-1] - 1, nchar(txt))
raw <- trimws(substring(txt, starts, ends))
key_of <- function(e) trimws(sub("^@[A-Za-z]+\\s*\\{\\s*([^,]+),.*$", "\\1", e))
field_of <- function(e, f) {
  m <- regmatches(e, regexec(paste0("(?i)\\b", f, "\\s*=\\s*[{\"]([^}\"]*)[}\"]"), e, perl = TRUE))[[1]]
  if (length(m) > 1) trimws(m[2]) else NA_character_
}
raw_by_key <- setNames(raw, vapply(raw, key_of, ""))

# 2. Parseo robusto (acentos LaTeX, etc.) con el pandoc que trae Quarto
bin <- Sys.getenv("QUARTO_BIN_PATH")
cand <- if (nzchar(bin)) file.path(bin, c("quarto.exe", "quarto.cmd", "quarto")) else character()
quarto <- c(cand[file.exists(cand)], "quarto")[1]
json <- system2(quarto, c("pandoc", shQuote(bib_file), "-f", "bibtex", "-t", "csljson"),
                stdout = TRUE)
Encoding(json) <- "UTF-8"
refs <- jsonlite::fromJSON(paste(json, collapse = "\n"), simplifyVector = FALSE)

tipo <- c("article-journal" = "Artículo",
          "paper-conference" = "Memorias de congreso",
          "chapter" = "Capítulo de libro", "book" = "Libro",
          "thesis" = "Tesis", "report" = "Documento de trabajo",
          "manuscript" = "Documento de trabajo")

`%||%` <- function(a, b) if (is.null(a)) b else a
g <- function(r, f) r[[f, exact = TRUE]]

fmt_autor <- function(a) {
  if (!is.null(a$literal)) return(if (a$literal == "others") "et al." else a$literal)
  ini <- paste0(substr(strsplit(a$given %||% "", " ")[[1]], 1, 1), ".", collapse = " ")
  paste0(a$family, ", ", ini)
}

items <- lapply(refs, function(r) {
  k <- g(r, "id"); e <- raw_by_key[[k]]
  au <- vapply(g(r, "author") %||% list(), fmt_autor, "")
  au <- if (length(au) > 1 && au[length(au)] == "et al.") paste(paste(au[-length(au)], collapse = ", "), "et al.")
        else if (length(au) > 1) paste(paste(au[-length(au)], collapse = ", "), "y", au[length(au)])
        else au
  venue <- ""
  csl_de <- c(journal = "container-title", booktitle = "container-title",
              institution = "publisher", publisher = "publisher",
              school = "publisher", note = "note")
  for (f in names(csl_de)) {
    v <- field_of(e, f)
    if (!is.na(v)) {
      venue <- if (!grepl("[\\\\{]", v)) v else (g(r, csl_de[[f]]) %||% "")
      break
    }
  }
  if (!is.null(g(r, "volume"))) {
    venue <- paste0(venue, ", ", if (is.null(g(r, "issue"))) "Vol. " else "",
                    g(r, "volume"), if (!is.null(g(r, "issue"))) paste0("(", g(r, "issue"), ")") else "")
  } else if (!is.null(g(r, "issue"))) venue <- paste0(venue, ", Nro. ", g(r, "issue"))
  if (!is.null(g(r, "chapter-number"))) venue <- paste0("Cap. ", g(r, "chapter-number"), " en ", venue)
  if (!is.null(g(r, "page"))) venue <- paste0(venue, ", ", g(r, "page"))
  if (!is.null(g(r, "publisher-place"))) venue <- paste0(venue, ", ", g(r, "publisher-place"))
  titulo <- field_of(e, "title")
  if (is.na(titulo) || grepl("[\\\\{]", titulo)) titulo <- g(r, "title")
  cat <- g(r, "keyword") %||% (if (g(r, "type") %in% names(tipo)) unname(tipo[g(r, "type")])) %||% "Otro"
  pdf <- field_of(e, "file")
  list(title = titulo, authors = au,
       year = as.integer(g(r, "issued")[["date-parts"]][[1]][[1]]),
       venue = venue, categories = list(strsplit(cat, "\\s*[,;]\\s*")[[1]][1]),
       pdf = if (!is.na(pdf)) file.path("papers", basename(pdf)) else NULL,
       url = g(r, "URL"), doi = g(r, "DOI"), abstract = g(r, "abstract"), key = k, bibtex = e)
})
items <- lapply(items, function(x) Filter(Negate(is.null), x))
items <- items[order(-vapply(items, `[[`, 0L, "year"))]
dir.create(dirname(out_file), showWarnings = FALSE)
con <- file(out_file, open = "wb")
writeLines(enc2utf8(yaml::as.yaml(items)), con, useBytes = TRUE)
close(con)
message("bib2yml: ", length(items), " publicaciones -> ", out_file)
