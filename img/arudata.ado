*! Stata-Syntax for outdat.ado 1.2 
* Change-log
* ----------
* Version 0.1: First draft
version 7.0
program define arudata
syntax anything 
cd "/Users/iMac6/Desktop/_ARU2018/8_arudata/eh"
quietly {
clear *
import delimited using `anything'.csv, delimiter(";")
do `anything'.do
}
		
end
exit

Alvaro Chirino
University of San Andres
faculty of mathematics and natural sciences
+591 70694453
