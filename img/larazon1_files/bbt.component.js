Namespace.Register("BBT.component");
Namespace.Register("BBT.component.cardForm");
Namespace.Register("BBT.component.upload");
Namespace.Register("BBT.component.hooks");

BBT.component.cardForm.initForm = function (_jObj) {
	
	var jObj = _jObj; // fix

	if(jObj == null) {
		jObj = jQuery("body");
	}

	jObj.find(".bb-field_calendar").each(function (i, data) {
			jQuery(data).datepicker({ dateFormat: 'dd/mm/yy', firstDay: 1 });
		});

	
	// Upload de ficheros sueltos
	jObj.find(".bb-field_file.bb_autoupdate_1").each(function (i, data) {
			
			var _name = BBT.getProperty(jQuery(data), "bb-field-name");
			new Ajax_upload(jQuery(data), {	
					action: '/bbtfile/upload/' + _name + '.json', 
						name: _name,
						autoSubmit: true,
						
						onSubmit: function(file, extension) { 
						jQuery("." + _name + "_wrap" + " .loading").html("<img src='/static/BBTContent/images/loading.gif'> Subiendo " + file + "...") ;
					},
						
						onComplete: function(file, _response) {
						var response = BBT.fixJson(_response);

						if(response["error"] == 0) {
							jObj.find("[name='" + _name + "']").val(response["data"]);
							
							jQuery("." + _name + "_wrap" + " .loading").html("");
							try {
								BBT.component.upload[_name](response);
							} catch (e) {
								BBT.log("info: no hay hook para upload de " + _name);
							}
						} else {
							BBT.message(response["message"], 2);
						}
					}
			});
		});


	// Upload de ficheros de coleccion
	jObj.find(".bb-form-collectionupload").each(function(i, data) {
			var field_name = BBT.getProperty(jQuery(data), "field-name");
			var collectionId = BBT.getProperty(jQuery(data), "collectionId");
			var config = BBT.getProperty(jQuery(data), "config");
			
			var formLayer = jQuery(data);
			var options = {
				beforeSubmit: function (formData, jqForm, options) { 
					formLayer.find(".fileInfo").html("<img src='/static/BBTContent/images/loading.gif'>");
				},
				success: function (responseText, statusText) { 
					var response = BBT.fixJson(responseText); 
					if(response["error"] == 0) {						
						formLayer.find(".fileInfo").html("<a target='_blank' href='" + response["url"] + "'>" + response["fileId"] + "</a>");
						formLayer.find("input[name='" + field_name + "']").val(response["fileId"]);
						try {
							BBT.component["onChange_" + field_name]();
						} catch(e) {
							// no hay hook
						}
						// DEPRECATED
						try {
							BBT.component[field_name]["onChange"]();
						} catch(e) {
							// no hay hook
						}
					} else {
						alert(response["message"]);
					}
				}
			};
			
			jQuery(data).find("form").ajaxForm(options);
			jQuery(data).find("form input[type='file']").change(function () {
					jQuery(data).find("form").submit();
				});

			jQuery(data).find(".select-collection-file").click(function () {
					try {						
						BBT.component["beforeSelector_" + field_name]();
					} catch(e) {
						BBT.log(e);
						// no hay hook
					}
					var url = BBT.getUrl("BBTFileSelectorJSONPage", {"collectionId": collectionId});
					jQuery.get(url, function (_response) {
							var response = BBT.fixJson(_response);
							if(response["error"] == 0) {
								BBT.modal(response["data"]);
								jQuery("#collection_selector_" + collectionId + " a.delete-image").click(
																	 function () {
																		 var _id = BBT.getProperty(jQuery(this), "fileId");
																		 BBT.component._deleteFileId(_id);
																		 return false;
																		 
																	 });
								jQuery("#collection_selector_" + collectionId + " a.select-image").click(
														       function () {
															       var _id = BBT.getProperty(jQuery(this), "fileId");
															       
															       formLayer.find(".fileInfo").html("<a target='_blank' href='" + _id + "'>" + _id + "</a>");
															       formLayer.find("input[name='" + field_name + "']").val(_id);
															       formLayer.find("input[type='file']").val("");
															       
															       // DEPRECATED
															       try {
															       BBT.component[field_name]["onChange"]();
															       } catch(e) {
																       // no hay hook
															       }
															       BBT.closeModal();

															       try {
																       
																       BBT.component["onChange_" + field_name]();
															       } catch(e) {
																       BBT.log(e);
																       // no hay hook
															       }

															       return false;
														       });
							}
						});
					return false;
				});
			
		});
	
	jObj.find(".bb-field_richtext").click(function () {
			// check initialized
		
			var __name = jQuery(this).attr("name");

			if(jQuery(this).attr("id") == "") {
				jQuery(this).attr("id", jQuery(this).attr("name") + "_" + Math.random().toString().replace(".", ""));
			}

			var id = jQuery(this).attr("id");
	
			if(jQuery("#" + id + "_parent").length > 0) {
				BBT.log("WARNING: ya existe un tiny con este id: " + __name);
			}
			
			if(BBT.getProperty(jQuery(this), "processed") == 1) {
				BBT.log("WARNING: Procesado... " + __name);
				return false;
			}

			jQuery(this).addClass("processed_1");

			if(BBT.getProperty(jQuery(this), "initialized") == 1) {
				if(!tinyMCE.get(id)) {		 
					tinyMCE.execCommand('mceAddControl', false, id);
				}
				return false;
			} else {
				jQuery(this).addClass("initialized_1");
			}
			

			var type = BBT.getProperty(jQuery(this), "rt-type");

			if(type == "" || type == null) {
				type = "advanced";
			}
			BBT.component.cardForm["_tiny" + type](jQuery(this));
		});

	jObj.find(".bb-btn-searchId").wrap("<span class='bb-btn-searchId-wrapper'/>");
	jObj.find(".bb-btn-searchId").click(function () { BBT.component.cardForm._searchId(jQuery(this)); return false });

	jObj.find(".bb-btn-searchId-wrapper").each(function (i, data) {
			jQuery(data).prepend("<img src='/static/BBTCore/images/loading.gif' class='loading-search' style='display:none'>");
		});
	
};

BBT.component._deleteFileId = function (fileId) {
	
	if(confirm("¿Está seguro de querer borrar este archivo?")) {

	var url = BBT.getUrl("BBTFileDeleteJSONPage", {"fileId" : fileId} );
	jQuery.post(url, function (_response) {
			var response = BBT.fixJson(_response);
			if(response["error"] == 0) {	
				
				jQuery("#file_selector_" + fileId.replace(".","-")).remove();
			} else {
				alert(response["message"]);
			}
		});
	}
	return false;
}

BBT.component.cardForm.getFields = function (jObj, notNull) {
	
	if(notNull == null) {
		notNull == false;
	}

	if(jObj == null) {
		jObj = jQuery("body");
	}
	
	var postData = {};
	
	jObj.find(".bb-field").each(function(i, data) {
			var _name = jQuery(data).attr("name");

			if(_name == null) {
				_name = BBT.getProperty(jQuery(this), "bb-field-name");
			}
			
			if(_name != null) {
				var value = BBT.getFieldValue(_name, jObj, notNull);				
				postData[_name] = value;
				
			}
		});
	
	return postData;
	
};


BBT.component.cardForm._tinyadvanced = function (jObj) {
			tinyMCE.init({
					setup : function(ed) {
						ed.onKeyPress.add(function(ed, e) {
								try {
									//BBT.log("onKeyPress");
									BBT.component.onRTChange(jObj.attr("id"));
								} catch(e) {
									// No hay hook para este evento
								}
							}),
						ed.onChange.add(function(ed, l) {
								// Declaramos BBT.component.onRTChange en el lugar donde queramos comprobar si un tiny ha cambaido
								try {
									//BBT.log("onChange");
									BBT.component.onRTChange(jObj.attr("id"));
								} catch(e) {
									// No hay hook para este evento
								}
							});
					},
						mode : "exact",
						theme : "advanced",
						elements : jObj.attr("id"),
						plugins : "paste,searchreplace,bbtimage,fullscreen",				      
						theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,cut,copy,paste,pastetext,pasteword,|,undo,redo,|,search,replace,|,bullist,numlist,|,blockquote,|,link,unlink,anchor,image,bbtimage,|,fullscreen",
						theme_advanced_buttons2 : "",
						theme_advanced_buttons3 : "",
						theme_advanced_resizing : true,
						theme_advanced_statusbar_location : "bottom",
						theme_advanced_toolbar_location : "top",
						theme_advanced_toolbar_align : "left"
						
						});


};


BBT.component.cardForm._tinymedium = function (jObj) {
			tinyMCE.init({
					setup : function(ed) {
						ed.onKeyPress.add(function(ed, e) {
								try {
									//BBT.log("onKeyPress");
									BBT.component.onRTChange(jObj.attr("id"));
								} catch(e) {
									// No hay hook para este evento
								}
							}),
						ed.onChange.add(function(ed, l) {
								// Declaramos BBT.component.onRTChange en el lugar donde queramos comprobar si un tiny ha cambaido
								try {
									BBT.component.onRTChange(jObj.attr("id"));
								} catch(e) {
									// No hay hook para este evento
								}
							});
					},
						mode : "exact",
						theme : "advanced",
						elements : jObj.attr("id"),
						plugins : "paste,searchreplace",
						theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,cut,copy,paste,pastetext,pasteword,|,undo,redo,|,search,replace,|,bullist,numlist,|,link,unlink,anchor,|,fullscreen",
						theme_advanced_buttons2 : "",
						theme_advanced_buttons3 : "",
						theme_advanced_resizing : true,
						theme_advanced_statusbar_location : "bottom",
						theme_advanced_toolbar_location : "top",
						theme_advanced_toolbar_align : "left"
						
						});


};

BBT.component.cardForm._tinybasic = function (jObj) {
			tinyMCE.init({
					setup : function(ed) {
						ed.onKeyPress.add(function(ed, e) {
								try {
									//BBT.log("onKeyPress");
									BBT.component.onRTChange(jObj.attr("id"));
								} catch(e) {
									// No hay hook para este evento
								}
							}),
						ed.onChange.add(function(ed, l) {
								// Declaramos BBT.component.onRTChange en el lugar donde queramos comprobar si un tiny ha cambaido
								try {
									BBT.component.onRTChange(jObj.attr("id"));
								} catch(e) {
									// No hay hook para este evento
								}
							});
					},
						mode : "exact",
						theme : "advanced",
						elements : jObj.attr("id"),
						plugins : "paste,searchreplace",
						theme_advanced_buttons1 : "bold,italic,|,cut,copy,paste,pastetext,pasteword,|,undo,redo",
						theme_advanced_buttons2 : "",
						theme_advanced_buttons3 : "",
						theme_advanced_resizing : true,
						theme_advanced_statusbar_location : "bottom",
						theme_advanced_toolbar_location : "top",
						theme_advanced_toolbar_align : "left"
						
						});


};


BBT.component.cardForm._selectContentId = function (hook, sender_jObj) { 
	jObj = jQuery("#bb-modal-search");
	var hook = hook;
	var sender_jObj = sender_jObj;
	jObj.find(".bb-search-result-item a").click(function () { 			
			var contentId = BBT.getProperty(jQuery(this).parents(".bb-search-result-item:first"), "contentId");
			var contentType = BBT.getProperty(jQuery(this).parents(".bb-search-result-item:first"), "contentType");
			if(contentId != null && contentId != "") {
				try {
					BBT.component.hooks[hook](contentId, contentType, sender_jObj);
					BBT.closeModal();
				} catch(e) {
					return false;
				}
			} else {
				BBT.log("contentId vacio");
			}
			return false; 			   
		}); 
};

BBT.component.cardForm._searchId = function (jObj) {	
	jObj.hide();
	jObj.parents(".bb-btn-searchId-wrapper:first").find(".loading-search").show();

	var hook = BBT.getProperty(jObj, "bbt-hook");

	if (hook == false || hook == "" || hook == null) {
		hook = BBT.getProperty(jObj.parents(".bb-form-btn-search:first") , "bbt-hook");		
	};

	var jObj = jObj;

	var searchParams = {};
	searchParams["module"] = "BBTContentSearchMO";
	searchParams["tpl"] = "bbtcontentsearchmo_selector.tpl";
	BBT.log(jObj.parents(".bb-form-btn-search:first"));	
	var _contentTypes = jObj.parents(".bb-form-btn-search:first").find(".contentTypes").html();

	if (_contentTypes != "" && _contentTypes != null) 
		searchParams["type"] = _contentTypes;

	var _sectionId = jObj.parents(".bb-form-btn-search:first").find(".sectionId").html();
	if(_sectionId != "" && _sectionId != "") {
		searchParams["sectionId"] = _sectionId;
        }

	var url = BBT.getUrl("BBTDispatchRenderModuleJSPage", searchParams);
	
	jQuery.get(url, function (_response) {
			var response = BBT.fixJson(_response);
			jObj.parents(".bb-btn-searchId-wrapper:first").find(".loading-search").hide();
			jObj.show();
			if(response["error"] == 0) {
				BBT.modal('<div id="bb-modal-search">' + response["html"] + '</div>');
				var sr_params = {}; 
				sr_params["ajax_search"] = true;
				sr_params["success"] = function () {
					BBT.component.cardForm._selectContentId(hook, jObj);
				}; 
				BBT.content.search.initForm(jQuery("#bb-modal-search"), sr_params);
			}
		});	
 };

 BBT.component.initSectionSelector = function(jObj) {
	 BBT.component._initSectionSelector(jObj);
	 jObj.find(".btn-select").click(function () {
			 var callback = jObj.find(".bbt-data .callback").html();
			 try {
				 BBT.component.hooks[callback](jObj.find(".bbt-data .sectionId").html(), jObj.find(".bbt-data .sectionName").html());
			 } catch(e) {
				 BBT.log("callback not found: " + callback);
			 }
		 });

	 if(jObj.find(".bbt-data .sectionId").html() == "") {                   
		 jObj.find(".wrapper-btn-select").hide(); 
	 }

	 jObj.find("input[name='search-sectionselector']").bind("keyup", function () {
			 var _value = jQuery(this).val();
			 if(_value == "") {
				 jObj.find("ul.bbt-sectionselector-mainlist li").show();
			 } else {
				 jObj.find("ul.bbt-sectionselector-mainlist li").hide();
				 jObj.find("ul.bbt-sectionselector-mainlist li").each(function () {
						 var val = jQuery(this).html().toLowerCase();
						 var pos = val.toLowerCase().indexOf(_value);
						 if(pos != -1) jQuery(this).show();
					 });
			 }
		 });
 };

BBT.component._initSectionSelector = function(jObj, isBoard) {
       var jObj = jObj;
       jObj.find(".btn-section").click(function () {
            jQuery("input[name='search-sectionselector']").val("");
            jObj.find(".sectionname").html(jQuery(this).html());
             
            jObj.find(".bbt-sectionselector-mainlist").html("<li>Loading...</li>");
            var sectionId = BBT.getProperty(jQuery(this), "sectionId");
	    jObj.find(".bbt-data .sectionId").html(sectionId);
	    jObj.find(".bbt-data .sectionName").html(jQuery(this).html());
	    
            if(sectionId == "0") {
                  jObj.find(".bbt-sectionselector-mainlist").html(jObj.find(".dummy-sections").html());
		  jObj.find(".bbt-sectionselector-breadcrumb").html('<span><a href="#" class="btn-section sectionId_0">Secciones</a> &gt; </span>');
                  BBT.component._initSectionSelector(jObj, isBoard);
                  jObj.find(".wrapper-btn-select").hide();

		  var callback = jObj.find(".bbt-data .onChangeNavigation").html();
		  try {
			  BBT.component.hooks[callback](0,"");
		  } catch(e) {
			  BBT.log("onChangeNavigation not found " + e);
		  }

                  return false;
            } else {
		    jObj.find(".wrapper-btn-select").show();
            } 
	    
	    var topSectionId = BBT.getProperty(jObj, "top-sectionId");

            var url = BBT.getUrl("BBTSectionGetValuesJSONPage", {sectionId: sectionId, fields: "name,formated-children,formated-full-parents"});
                 
		jQuery.get(url, function (_response) {
			var response = BBT.fixJson(_response);
			if (response["error"] == 0) {
                               jObj.find(".bbt-sectionselector-mainlist").html("");
                               jObj.find(".bbt-sectionselector-breadcrumb").html("");

                               var ret = eval(response["formated-children"]);
                               if(ret.length == 0) {
                                       jObj.find(".bbt-sectionselector-mainlist").append('<li>No children</li>');
                               } else { 
                                      jQuery.each(ret, function (i, data) {
                                           jObj.find(".bbt-sectionselector-mainlist").append('<li><a href="#" class="btn-section sectionId_' + data["sectionId"] + '">' + data["sectionName"] + '</a></li>');
                                     });
                               }
  
                               var breadcrumb = eval(response["formated-full-parents"]);
			       if(topSectionId == "") {
				       jObj.find(".bbt-sectionselector-breadcrumb").append('<span><a href="#" class="btn-section sectionId_0">Sections</a> &gt; </span>');
			       } else {
				       jObj.find(".bbt-sectionselector-breadcrumb").append('<span>Sections &gt; </span>');
				       // reescribimos la miga
				       var _bc = breadcrumb;
				       breadcrumb = [];
				       var _isBCData = false;
				       jQuery.each(_bc, function (i, data) {
						       if(data["sectionId"] == topSectionId) {
							       _isBCData = true;
						       }
						       if(_isBCData) {
							       breadcrumb[breadcrumb.length] = data;
						       }
					       });
			       }
			       
			       

                               jQuery.each(breadcrumb, function (i, data) {
                                           jObj.find(".bbt-sectionselector-breadcrumb").append('<span><a href="#" class="btn-section sectionId_' + data["sectionId"] + '">' + data["sectionName"] + '</a> &gt; </span>');
                               });

                               jObj.find(".bbt-sectionselector-breadcrumb").append('<span>' + response["name"] + '</span>');
                               
			       var callback = jObj.find(".bbt-data .onChangeNavigation").html();
			       try {
				       BBT.component.hooks[callback](sectionId, response["name"]);
			       } catch(e) {
				       BBT.log("onChangeNavigation not found " + e);
			       }

			       BBT.component._initSectionSelector(jObj, isBoard);

			} else {
				BBT.error("Error: " + response["message"]);
			}
		});
            return false;
       });
 };








