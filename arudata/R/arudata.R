#' @title Cargar base de datos
#' @description Esta función permite cargar las bases de datos alojadas en los servidores de Fundación Aru.
#' @param id Es el identificador de la base de datos
#' @param pass Es la contraseña para acceder a la base de datos definida en id
#' @details Versión piloto
#' @examples
#' arudata(id="cs76v",pass=9876)
#' @export
arudata<-function(id="cs76v",pass=9876){
  aux<-read.csv("https://udata-aru.github.io/img/pass.csv")
  if(max(aux==pass)==1){
    data(indexaru)
    if(max(indexaru$id==id)){
      bd<-read.csv(paste0("http://aru2.ddns.net:8080/datumARU/data/",id,".csv"),sep=";")
      return(bd)
      cat("Vas bien...",fill=T)
    } else {
      cat("Identificador de la base de datos incorrecto, revise con <<aru_repo()>> las bases disponibles",fill=T)
    }
  } else {
   cat("Contraseña incorrecta o ausente, introduzca la contraseña en la opción pass=...",fill=T)
  }
}

#' @title Listado de bases de datos disponibles
#' @description Esta función desplega las bases de datos disponibles
#' @details Versión piloto
#' @examples
#' aru_repo()
#' @export
aru_repo<-function(){
  data(indexaru)
  print(indexaru[,1:2])
}

