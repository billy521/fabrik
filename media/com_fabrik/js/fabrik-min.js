RequestQueue=new Class({queue:{},initialize:function(){this.periodical=this.processQueue.periodical(500,this)},add:function(c){var b=c.options.url+Object.toQueryString(c.options.data)+Math.random();if(!this.queue[b]){this.queue[b]=c}},processQueue:function(){if(Object.keys(this.queue).length===0){return}var c={},b=false;$H(this.queue).each(function(e,d){if(e.isSuccess()){delete (this.queue[d]);b=false}}.bind(this));$H(this.queue).each(function(e,d){if(!e.isRunning()&&!e.isSuccess()&&!b){e.send();b=true}})},empty:function(){return Object.keys(this.queue).length===0}});Request.HTML=new Class({Extends:Request,options:{update:false,append:false,evalScripts:true,filter:false,headers:{Accept:"text/html, application/xml, text/xml, */*"}},success:function(j){var k=this.options,e=this.response;var d=j.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);var g=[];if(typeOf(d)!=="null"){for(var h=0;h<d.length;h++){if(d[h].contains('src="')){var c=d[h].match(/src=\"([\s\S]*?)\"/);if(c[1]){g.push(c[1])}}}var b="head.js('"+g.join("','")+"');\n";Browser.exec(b)}e.html=j.stripScripts(function(l){e.javascript=l});var f=e.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);if(f){e.html=f[1]}var i=new Element("div").set("html",e.html);e.tree=i.childNodes;e.elements=i.getElements("*");if(k.filter){e.tree=e.elements.filter(k.filter)}if(k.update){document.id(k.update).empty().set("html",e.html)}else{if(k.append){document.id(k.append).adopt(i.getChildren())}}if(k.evalScripts){Browser.exec(e.javascript)}this.onSuccess(e.tree,e.elements,e.html,e.javascript)}});Element.implement({keepCenter:function(){this.makeCenter();window.addEvent("scroll",function(){this.makeCenter()}.bind(this));window.addEvent("resize",function(){this.makeCenter()}.bind(this))},makeCenter:function(){var b=window.getWidth()/2-this.getWidth()/2;var c=window.getScrollTop()+(window.getHeight()/2-this.getHeight()/2);this.setStyles({left:b,top:c})}});var Loader=new Class({initialize:function(b){this.spinners={}},getSpinner:function(c,d){d=d?d:Joomla.JText._("COM_FABRIK_LOADING");if(typeOf(document.id(c))==="null"){c=false}c=c?c:false;var b=c?c:document.body;if(!this.spinners[c]){this.spinners[c]=new Spinner(b,{message:d})}return this.spinners[c]},start:function(b,c){this.getSpinner(b,c).position().show()},stop:function(c,e,d){var b=this.getSpinner(c,e);if(Browser.ie&&Browser.version<9){b.clearChain();b.hide()}else{b.destroy()}delete this.spinners[c]}});(function(){if(typeof(Fabrik)==="undefined"){Fabrik={};Fabrik.events={};Fabrik.Windows={};Fabrik.loader=new Loader();Fabrik.blocks={};Fabrik.addBlock=function(b,c){Fabrik.blocks[b]=c;Fabrik.fireEvent("fabrik.block.added",c)};document.addEvent("click:relay(.fabrik_delete a)",function(c,b){if(c.rightClick){return}Fabrik.watchDelete(c,b)});document.addEvent("click:relay(.fabrik_edit a, a.fabrik_edit)",function(c,b){if(c.rightClick){return}Fabrik.watchEdit(c,b)});document.addEvent("click:relay(.fabrik_view a, a.fabrik_view)",function(c,b){if(c.rightClick){return}Fabrik.watchView(c,b)});Fabrik.iconGen=new IconGenerator({scale:0.5});Fabrik.removeEvent=function(d,c){if(Fabrik.events[d]){var b=Fabrik.events[d].indexOf(c);if(b!==-1){delete Fabrik.events[d][b]}}};Fabrik.addEvent=function(c,b){if(!Fabrik.events[c]){Fabrik.events[c]=[]}if(!Fabrik.events[c].contains(b)){Fabrik.events[c].push(b)}};Fabrik.addEvents=function(b){for(var c in b){Fabrik.addEvent(c,b[c])}return this};Fabrik.fireEvent=function(e,c,b){var d=Fabrik.events;this.eventResults=[];if(!d||!d[e]){return this}c=Array.from(c);d[e].each(function(f){if(b){this.eventResults.push(f.delay(b,this,c))}else{this.eventResults.push(f.apply(this,c))}},this);return this};Fabrik.requestQueue=new RequestQueue();Fabrik.cbQueue={google:[]};Fabrik.loadGoogleMap=function(e,b){var f="http://maps.googleapis.com/maps/api/js?sensor="+e+"&callback=Fabrik.mapCb";var d=Array.from(document.scripts).filter(function(g){return g.src===f});if(d.length===0){var c=document.createElement("script");c.type="text/javascript";c.src=f;document.body.appendChild(c);Fabrik.cbQueue.google.push(b)}else{if(Fabrik.googleMap){window[b]()}else{Fabrik.cbQueue.google.push(b)}}};Fabrik.mapCb=function(){Fabrik.googleMap=true;for(var b=0;b<Fabrik.cbQueue.google.length;b++){window[Fabrik.cbQueue.google[b]]()}Fabrik.cbQueue.google=[]};Fabrik.watchDelete=function(g,f){var b,d,c;c=g.target.getParent(".fabrik_row");if(!c){c=Fabrik.activeRow}if(c){var h=c.getElement("input[type=checkbox][name*=id]");if(typeOf(h)!=="null"){h.checked=true}d=c.id.split("_");d=d.splice(0,d.length-2).join("_");b=Fabrik.blocks[d]}else{d=g.target.getParent(".fabrikList");if(typeOf(d)!=="null"){d=d.id;b=Fabrik.blocks[d]}else{d=f.getParent(".floating-tip-wrapper").retrieve("list").id;b=Fabrik.blocks[d];if(b.options.actionMethod==="floating"){b.form.getElements("input[type=checkbox][name*=id], input[type=checkbox][name=checkAll]").each(function(e){e.checked=true})}}}if(!b.submit("list.delete")){g.stop()}};Fabrik.watchEdit=function(h,g){var f=g.get("data-list");var d=Fabrik.blocks[f];var i=d.getActiveRow(h);if(!d.options.ajax_links){return}h.preventDefault();if(!i){return}d.setActive(i);var c=i.id.split("_").getLast();if(d.options.links.edit===""){url=Fabrik.liveSite+"index.php?option=com_fabrik&view=form&formid="+d.options.formid+"&rowid="+c+"&tmpl=component&ajax=1";loadMethod="xhr"}else{if(h.target.get("tag")==="a"){a=h.target}else{a=typeOf(h.target.getElement("a"))!=="null"?h.target.getElement("a"):h.target.getParent("a")}url=a.get("href");loadMethod="iframe"}var b={id:"add."+f,title:d.options.popup_edit_label,loadMethod:loadMethod,contentURL:url,width:d.options.popup_width,height:d.options.popup_height,onClose:function(j){var e="form_"+d.options.formid;Fabrik.blocks[e].destroyElements();Fabrik.blocks[e].formElements=null;Fabrik.blocks[e]=null;delete (Fabrik.blocks[e])}};if(typeOf(d.options.popup_offset_x)!=="null"){b.offset_x=d.options.popup_offset_x}if(typeOf(d.options.popup_offset_y)!=="null"){b.offset_y=d.options.popup_offset_y}$H(Fabrik.Windows).each(function(j,e){j.close()});Fabrik.getWindow(b)};Fabrik.watchView=function(h,g){var f=g.get("data-list");var d=Fabrik.blocks[f];if(!d.options.ajax_links){return}h.preventDefault();var i=d.getActiveRow(h);if(!i){return}d.setActive(i);var c=i.id.split("_").getLast();if(d.options.links.detail===""){url=Fabrik.liveSite+"index.php?option=com_fabrik&view=details&formid="+d.options.formid+"&rowid="+c+"&tmpl=component&ajax=1";loadMethod="xhr"}else{if(h.target.get("tag")==="a"){a=h.target}else{a=typeOf(h.target.getElement("a"))!=="null"?h.target.getElement("a"):h.target.getParent("a")}url=a.get("href");loadMethod="iframe"}var b={id:"view.."+f+"."+c,title:d.options.popup_view_label,loadMethod:loadMethod,contentURL:url,width:d.options.popup_width,height:d.options.popup_height};if(typeOf(d.options.popup_offset_x)!=="null"){b.offset_x=d.options.popup_offset_x}if(typeOf(d.options.popup_offset_y)!=="null"){b.offset_y=d.options.popup_offset_y}Fabrik.getWindow(b)};Fabrik.form=function(d,e,c){var b=new FbForm(e,c);Fabrik.addBlock(d,b);return b};window.fireEvent("fabrik.loaded")}}());