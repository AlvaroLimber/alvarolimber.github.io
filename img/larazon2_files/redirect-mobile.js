function RedirectSmartphone(url){
    if (url && url.length > 0 && IsSmartphone())
    window.location.host = url;
}

function DetectUagent(name){
        var uagent = navigator.userAgent.toLowerCase();
        return (uagent.search(name) > -1)
}       

function getCookieObj() {
	var cookies = document.cookie.split(';'), i, objCook = {}, tmp = "";
	for (i = 0; i < cookies.length; i++) {
		tmp = cookies.pop().toString().trim();
		objCook[tmp.split("=")[0]] = (tmp.split("=")[1]) ? tmp.split("=")[1] : "";
	}
	return objCook;
}

function IsSmartphone(){
	if (DetectUagent("android")) return true;
	else if (DetectUagent("blackberry")) return true;
	else if (DetectUagent("bb10")) return true;
	else if (DetectUagent("iphone")) return true;
    	else if (DetectUagent("opera mini")) return true;
    	else if (DetectUagent("palm")) return true;
    	else if (DetectUagent("windows phone")) return true;
    	else if (DetectUagent("generic")) return true;
    	else if (DetectUagent("ipad")) return true;
    	else if (DetectUagent("ipod")) return true;
	return false;
}	
function redirectToMovile() {
	var cookies = getCookieObj();
	var dat = new Date();
	dat.setTime(dat.getTime() + (3600*1000));
	if (cookies["version_navegacion"]) {
		document.cookie = "version_navegacion=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	}
	document.cookie = "version_navegacion=Movile; expires=" + dat.toGMTString() + ";path=/; domain=la-razon.com;";
	console.log("set cookie to Movile");
	window.location.host = "la-razon.com";
}

var cookies = getCookieObj(), desktopUrl = "la-razon.com", movilUrl = "m.la-razon.com";
var dat = new Date();
dat.setTime(dat.getTime() + (3600*1000));

if (IsSmartphone()) {
	console.log("smartphone mode detected");
	if (cookies["version_navegacion"]) {
		console.log("Cookie detectada:" + cookies["version_navegacion"]);
	 	//document.cookie = "version_navegacion=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"	
		if (cookies["version_navegacion"] == "Desktop") {
			//document.cookie = "version_navegacion=Movile; path=*; domain=la-razon.com";	
			document.cookie = "version_navegacion=; expires=Thu, 01 Jan 1970 00:00:01 GMT;" 
			document.cookie = "version_navegacion=Desktop; expires=" + dat.toGMTString() + "; path=/; domain=la-razon.com;";
			//FUncionalidad DUMY para test
			/*var body   = document.body || document.getElementsByTagName('body')[0];
			var a = document.createElement("A");
			a.href = "#";
			a.id = "link-to-movile";
			a.appendChild(document.createTextNode("Versión de Smartphone"));
			a.onclick = function() { redirectToMovile() };
			a.style.fontSize = "25px";
			a.style.position = "absolute";
			body.insertBefore(a, body.childNodes[0]);*/
			//RedirectSmartphone(desktopURL);	
		} else {
			console.log("reroute");
			document.cookie = "version_navegacion=; expires=Thu, 01 Jan 1970 00:00:01 GMT;" 
			document.cookie = "version_navegacion=Movile; expires=" + dat.toGMTString() + "; path=/; domain=la-razon.com;";
			RedirectSmartphone(movilUrl);
		}
	} else {
		console.log("Cookie no existe, redirigiendo");
		document.cookie = "version_navegacion=Movile; expires=" + dat.toGMTString() + "; path=/; domain=la-razon.com;";
		RedirectSmartphone(movilUrl);
	}
}

