*! Stata-Syntax for outdat.ado 1.2 
* Change-log
* ----------
* Version 0.1: First draft
version 7.0
program define arudata
syntax anything 
quietly {
clear *
import delimited using http://aru2.ddns.net/datumARU/eh/`anything'.csv, delimiter(";")
do http://aru2.ddns.net/datumARU/eh/`anything'.do
}
		
end
exit

Alvaro Chirino
University of San Andres
faculty of mathematics and natural sciences
+591 70694453
