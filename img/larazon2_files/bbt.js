var Namespace = {
    Register : function(_Name)
    {
        var chk = false;
        var cob = "";
        var spc = _Name.split(".");
        for(var i = 0; i<spc.length; i++)
        {
            if(cob!=""){cob+=".";}
            cob+=spc[i];
            chk = this.Exists(cob);
            if(!chk){this.Create(cob);}
        }
        if(chk){ throw "Namespace: " + _Name + " is already defined."; }
    },

    Create : function(_Src)
    {
        eval("window." + _Src + " = new Object();");
    },

    Exists : function(_Src)
    {
        eval("var NE = false; try{if(" + _Src + "){NE = true;}else{NE = false;}}catch(err){NE=false;}");
        return NE;
    }
};

Namespace.Register("BBT");

BBT.getProperty = function (jObj, type) {
	var isJQuery = jObj instanceof jQuery;
	
	if(!isJQuery) { return false; }
	
	if (!jObj.attr("class")) { return false; }
	
	var values = jObj.attr("class").split(" ");
	var ret = null;
	var _regexp = new RegExp("^" + type + "_");
	jQuery.each(values, function(i,data) {  if(data.match(_regexp)) ret = data.replace(_regexp, ""); });	
	return ret;
};

BBT.setFieldValue = function (fieldName, value, jObj) {
	if(jObj == null) {
		jObj = jQuery(document);
	}
	
	
	var field = jObj.find("[name='" + fieldName + "']");
	
	if (field.length == 0) {
		field = jObj.find("[for='" + fieldName + "']");
	}
		
	if (field.length == 0) {
		return false;
	}

	var fieldType = BBT.getProperty(field, "bb-field");

	//BBT.log(fieldName);
	//BBT.log(field);
	//BBT.log(fieldType);
	switch (fieldType) {
	case "input":
	case "hidden":
		field.val(value);
		break;
	case "richtext":
		// TODO: tiny activo
		field.html(value);
		break;
	case "select":
		field.find("option[value='" + value + "']").attr("selected", "selected");
		break;
	case "label":	       
		field.html(value);
		break;
	}
	return true;
};

BBT.getFieldValue = function (fieldName, jObj, notNull) {
	
	if(notNull == null) {
		notNull == false;
	}

	if (jObj == null) {
		jObj = jQuery("body");
	}

	var fieldType = BBT.getProperty(jObj.find("[name='" + fieldName + "']"), "bb-field");
	if(fieldType == false) {
		fieldType = BBT.getProperty(jObj.find(".bb-field-name_" + fieldName), "bb-field");
	}

	var _value = null;

	switch (fieldType) {
	case "checkbox":
		_value = jObj.find("[name='" + fieldName + "']").attr("checked");
		break;
	case "radio":
		_value = jObj.find("[name='" + fieldName + "']:checked").val();		
		break;
	case "calendar":
		_value = jObj.find("[name='" + fieldName + "']").val();
		if (_value != "") {
			var parts = _value.split("/");
			var date = new Date(parts[2], parts[1] - 1, parts[0]);
			_value = Math.ceil(date.getTime() / 1000);
		}
		break;
	case "input":
		_value = jObj.find("[name='" + fieldName + "']").val();
		break;
	case "hidden":
		_value = jObj.find("[name='" + fieldName + "']").val();
		break;
	case "select":
		_value = jObj.find("[name='" + fieldName + "'] option:selected").val();
		break;
	case "textarea":
		_value = jObj.find("[name='" + fieldName + "']").val();
		break;		
	case "file":
		_value = BBT.getFieldValue("hidden_" + fieldName);
		break;
	case "label":
		// TODO: search for attribute for fieldType
		_value = jObj.find("[for='" + fieldName + "']").html();
		break;
	case "richtext":
		// por el momento solo tenemos tinymce
		var _id = jObj.find("[name='" + fieldName + "']").attr("id");
		if(_id == null) {
			_value = null;
		} else {
			try {
				_value = tinyMCE.getInstanceById(_id).getBody().innerHTML;
				// Eliminamos saltos de línea, nos dan problemas
				_value = _value.replace(/\n/g, "");
			} catch(e) {
				// tiny no inicializado, usamos el contenido del div
				_value = jObj.find("[name='" + fieldName + "']").html();
			}


		}
		break;
	case "datetime":
	        var _date = BBT.getFieldValue(fieldName + "_calendar");
	        var _minute = BBT.getFieldValue(fieldName + "_minutes");
		var _hour = BBT.getFieldValue(fieldName + "_hour");
		var _second = BBT.getFieldValue(fieldName + "_second");
		
		if(_minute == null) _minute = 0;
		if(_hour == null) _hour = 0;
		if(_second == null) _second = 0;

		var newDate = "";
		if(_date != null) {
			newDate = new Date((_date + (parseInt(_hour,10) * 60 * 60) + (parseInt(_minute,10) * 60) + parseInt(_second, 10)) * 1000);			
		}
		_value = newDate.getTime() / 1000;

		break;
	default:
		_value = null;
	}

	if(_value == "" || _value == "null") {
		_value = null
	}

	if(_value == null && notNull == true) {
		return "";
	}

	return _value;	
};

BBT.log = function (txt) {
	try {
		console.log(txt);
	} catch(e) {
		// no esta instalado fb
	}		
};

BBT.error = function (txt) {
	alert(txt);
};


BBT.modal = function (html, _params) {
	// BBT.log("Open modal..");
	
	var params = { bgiframe: true,
		       width: 925,
		       height: 550,
		       position: "center",
		       modal: true,
		       draggable: false,
		       zindex: 100,
		       close: function () { jQuery("#bbt-modal").remove(); },					
		       beforeclose: function () { return BBT.closeModal(false); }				
	};

	if(_params != null) {
		jQuery.each(_params, function(i) {
				params[i] = _params[i];
			});
	}
	


	var rnd = Math.round(Math.random() * 10000);
	
	if(jQuery("#bbt-modal").length < 1) {
		jQuery("body").append("<div id='bbt-modal' class='bbt-modal-" + rnd + "'><ul class='modal-tab-container'><li class='modal-tab'>" + html + "</li></ul></div>");
		
		jQuery(".bbt-modal-" + rnd).dialog(params);
	} else {
		jQuery("#bbt-modal ul.modal-tab-container").append("<li class='modal-tab'>" + html + "</li>");
		jQuery("#bbt-modal ul.modal-tab-container li.modal-tab").hide();
		jQuery("#bbt-modal ul.modal-tab-container li.modal-tab:last").show();
		
	}

	jQuery(".ui-widget-overlay").click(function () { BBT.closeModal() });
};

BBT.closeModal = function(forzeClose) {
	if(forzeClose == null) {
		forzeClose = true;
	}
	jQuery("#bbt-modal ul.modal-tab-container li.modal-tab:last").remove();
	jQuery("#bbt-modal ul.modal-tab-container li.modal-tab:last").show();
	
	if(jQuery("#bbt-modal ul.modal-tab-container li.modal-tab").length == 0) {
		if(forzeClose) {
			jQuery("#bbt-modal").remove();
		}
		return true;
	} 
	return false;
	
};

BBT.fixJson = function (jsonString) {
	
	var _response = jsonString;
	if(jsonString.indexOf("<pre>") >= 0) {
	        _response = jsonString.split("<pre>")[1].split("</pre>")[0];	       
	}
	
	try {
		ret = eval("(" + _response + ")");
		return ret;
	} catch (e) {
		BBT.log(e + " " + jsonString);
		return null;
	}
	
}; 

BBT.loading = function (loading_text, modal, jObj) {
	
	if(modal == null) {
		modal = false; 
	}
	
	if (modal == true) {
		BBT.modal(loading_text);
		return true;
	}

	if(loading_text == null) {		
		loading_text = "Loading...";
	}
	
	BBT.message("<img src='/static/BBTCore/images/loading.gif'> " + loading_text, null, jObj);
	
	if(close == true) {
		BBT.message_close();
	}
};

BBT.getLoadingImage = function () {
	return "<img src='/static/BBTContent/images/loading.gif'>";
};

BBT.alert = function (alert_text) {
	alert(alert_text);
};

BBT.cacheUrls = {};

BBT.getUrl = function (className, params) {
	
	var _hash = className;
	jQuery.each(params, function (i) {
			_hash += "_" + i + "_" + params[i];
		});
		    
	var hash = hex_md5(_hash);
 
	if(BBT.cacheUrls[hash] != null) {
		BBT.log("url cached");
		return BBT.cacheUrls[hash];
	}

	var _response = jQuery.ajax({ type: "GET",
				      url: "/bbtdispatch/getUrl/" + className + ".json",
				      async: false,
				      dataType: "json",
				      data: params
				      
		}).responseText;
	
	var response = BBT.fixJson(_response);			
	if(response["error"] == 0) {		
		return response["data"];
	} else {
		return "";
	}
       
};

BBT.generateGETUrl = function (urlPath, params) {
	var ret = [];
	jQuery.each(params, function (i, data) {
			ret[ret.length] = i + "=" + escape(data)
		});
	return urlPath + "?" + ret.join("&");
};

BBT.message_close = function (jObj)  {
	if (jObj == null) {
		jObj = jQuery("#bb-msg-global");
	}

	jObj.slideUp();
	jObj.addClass("bb-hidden");
};

BBT.message = function (message_txt, error, jObj) {
	if (jObj == null) {
		jObj = jQuery("#bb-msg-global");
	}
	// TODO: soportar arbol de divs

	jObj.removeClass("bb-hidden");
	jObj.find("p").html(message_txt);
	jObj.show();
	var _error_id = BBT.getProperty(jObj, "bb-msg");
	jObj.removeClass("bb-msg_" + _error_id);
	if(error != null) {
		jObj.addClass("bb-msg_" + error);
	}
};

BBT.getGETParams = function (s) {
	if ( s == null ) {
		s = window.location.href;
	}

	var a = s.match(/[^&?=]*=[^&?=]*/g);

	if(a == null) {
		return {};
	}
	
	var r = {};
	for (i=0; i<a.length; i++) {
		var _key = a[i].match(/[^&?=]*/)[0];
		var _value = a[i].match(/=([^&?]*)/)[0].replace('=', '');		
		r[_key] = _value;
				       
	}
	return r;
};

Namespace.Register("BBT.hook");

BBT.hook.hooks = {};

BBT.hook.append = function (group, callback) {
	if(BBT.hook.hooks[group] == null) {
		BBT.hook.hooks[group] = [];
	}
	
	params = [];
	if (arguments.length > 2) {
	    for (var x = 2; x < arguments.length; x++) {
	       params[params.length] = arguments[x]; 
	    };
	};
	BBT.hook.hooks[group][BBT.hook.hooks[group].length] = [callback, params];
	
};

BBT.hook.execute = function (group) {
	if(BBT.hook.hooks[group] != null) {
		jQuery.each(BBT.hook.hooks[group], function (i, data) {
			data[0].apply(null, data[1]); 
		});
	}
};


Namespace.Register("BBT.highlight");

BBT.highlight.highlight = function (search_string, _params) {
	var params = { span_class: 'bb-highlight-color',
		       search_block: jQuery(document),
		       search_class: "bb-highlight-field",
		       clear_mat: null
	};

	if(_params != null) {
		jQuery.each(_params, function(i) {
				params[i] = _params[i];
			});
	}

	var search_objs = BBT.highlight.getSearchObjs(params['search_block'], params['search_class']);

	jQuery(search_objs).each(function() {
			BBT.highlight.setHighlight(search_string,jQuery(this), params['span_class'], params['clear_mat']);
		});

	return params;
};

BBT.highlight.getSearchObjs = function (search_block, search_class) {
	var ret = jQuery(search_block).find("." + search_class);
	return ret;
};

BBT.highlight.setHighlight = function (search_string, obj, span_class, clear_mat) {
	jQuery(obj).contents()
	.filter(function() {
			if (this.nodeType == 1) {

				//&& this.childNodes
				//Recursivamente si no es un texto miramos en el nuevo nodo
				return BBT.highlight.setHighlight(search_string, jQuery(this), span_class);

			} else {
				var nodeclone = this.cloneNode(true);

				/* Limpiamos acentos */
				nodeclone.data = BBT.clearString(nodeclone.data, clear_mat);
				search_string = BBT.clearString(search_string, clear_mat);

				var pos = nodeclone.data.indexOf(search_string);

				if (pos >= 0) {

					var span = document.createElement('span'); /*Creamos el nodo span para meter dentro posteriormente el highlight */

					span.className = span_class; /* Le añadimos el class indicado */

					var middle_s = this.splitText(pos);/* Nos quedamos con el nodo cortando hasta la cadena buscada, y el resto en middle_s */

					var end_s = middle_s.splitText(search_string.length); /* Copiamos el nodos desde el fin de la cadena buscada, dejando la palabra a buscar en middle_s */

					var middle_s_clone = middle_s.cloneNode(true); /* Clonamos la cadena central */

					span.appendChild(middle_s_clone); /* A nuestro span le metemos el nodo clonado, (el highlight), para evitar perder middle_s */

					middle_s.parentNode.replaceChild(span, middle_s);  /* Al nodo (div)  en el está la palabra que buscamos le susutituimos la cadena a buscar por el span creado ya con el highlight*/

					return true;
				}

				return false;
			}
		})
};

BBT.mat_clearString = {
	"Á": "A",
	"Ä": "A",
	"É": "E",
	"Ë": "E",
	"Í": "I",
	"Ï": "I",
	"Ó": "O",
	"Ö": "O",
	"Ú": "U",
	"Ü": "U"
};

BBT.clearString = function (string, _mat) {

	var mat = BBT.mat_clearString;

	if(_mat != null) {
		mat = _mat;
	}

	string = string.toUpperCase();

	jQuery.each(mat, function(i) {
			string.replace(/i/, mat[i]);
		});

	return string;
};