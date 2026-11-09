# Ejecutar UNA vez desde RStudio (con el .Rproj abierto) para borrar los
# archivos del sitio Jekyll antiguo. Luego puede borrar este script.
viejos <- c("404.html", "allnews.html", "index.html", "CNAME", "citesty.csl",
            "package.json", "update_bootstrap.sh", "LICENSE",
            "acerca de mí", "assets", "blogs", "publications", "research",
            "software", "talks", "teaching", "team", "cv/Chirino_2024.pdf",
            "images/banner.jpg", "images/doe_logo.png", "images/NIH-logo.png",
            "images/nnsa_logo.png", "images/NSF.png", "images/onr_logo.png",
            "images/rock.jpg", "styles/custom.scss")
existe <- viejos[file.exists(viejos)]
print(existe)
unlink(existe, recursive = TRUE)
message("Listo. Ahora: quarto::quarto_render() o Build > Render Website")
