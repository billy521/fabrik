RequestQueue=new Class({queue:{},initialize:function(){this.periodical=this.processQueue.periodical(500,this)},add:function(c){var b=c.options.url+Object.toQueryString(c.options.data)+Math.random();if(!this.queue[b]){this.queue[b]=c}},processQueue:function(){if(Object.keys(this.queue).length===0){return}var c={},b=false;$H(this.queue).each(function(e,d){if(e.isSuccess()){delete (this.queue[d]);b=false}}.bind(this));$H(this.queue).each(function(e,d){if(!e.isRunning()&&!e.isSuccess()&&!b){e.send();b=true}})},empty:function(){return Object.keys(this.queue).length===0}});Request.HTML=new Class({Extends:Request,options:{update:false,append:false,evalScripts:true,filter:false,headers:{Accept:"text/html, application/xml, text/xml, */*"}},success:function(g){var f=this.options,d=this.response;d.html=g.stripScripts(function(i){d.javascript=i});var e=d.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);if(e){d.html=e[1]}var c=new Element("div").set("html",d.html);d.tree=c.childNodes;d.elements=c.getElements(f.filter||"*");if(f.filter){d.tree=d.elements}if(f.update){var h=document.id(f.update).empty();if(f.filter){h.adopt(d.elements)}else{h.set("html",d.html)}}else{if(f.append){var b=document.id(f.append);if(f.filter){d.elements.reverse().inject(b)}else{b.adopt(c.getChildren())}}}if(f.evalScripts){Browser.exec(d.javascript)}this.onSuccess(d.tree,d.elements,d.html,d.javascript)}});Element.implement({keepCenter:function(){this.makeCenter();window.addEvent("scroll",function(){this.makeCenter()}.bind(this));window.addEvent("resize",function(){this.makeCenter()}.bind(this))},makeCenter:function(){var b=window.getWidth()/2-this.getWidth()/2;var c=window.getScrollTop()+(window.getHeight()/2-this.getHeight()/2);this.setStyles({left:b,top:c})}});var Loader=new Class({initialize:function(b){this.spinners={}},getSpinner:function(c,d){d=d?d:Joomla.JText._("COM_FABRIK_LOADING");if(typeOf(document.id(c))==="null"){c=false}c=c?c:false;var b=c?c:document.body;if(!this.spinners[c]){this.spinners[c]=new Spinner(b,{message:d})}return this.spinners[c]},start:function(b,c){this.getSpinner(b,c).position().show()},stop:function(c,e,d){var b=this.getSpinner(c,e);if(Browser.ie&&Browser.version<9){b.clearChain();b.hide()}else{b.destroy()}delete this.spinners[c]}});if(typeof(Fabrik)==="undefined"){if(typeof(jQuery)!=="undefined"){document.addEvent("click:relay(.popover button.close)",function(b,d){var c="#"+d.get("data-popover");var e=document.getElement(c);jQuery(c).popover("hide");if(typeOf(e)!=="null"&&e.get("tag")==="input"){e.checked=false}})}Fabrik={};Fabrik.events={};Fabrik.Windows={};Fabrik.loader=new Loader();Fabrik.blocks={};Fabrik.addBlock=function(b,c){Fabrik.blocks[b]=c;Fabrik.fireEvent("fabrik.block.added",[c,b])};document.addEvent("click:relay(.fabrik_delete a, .fabrik_action a.delete, .btn.delete)",function(c,b){if(c.rightClick){return}Fabrik.watchDelete(c,b)});document.addEvent("click:relay(.fabrik_edit a, a.fabrik_edit)",function(c,b){if(c.rightClick){return}Fabrik.watchEdit(c,b)});document.addEvent("click:relay(.fabrik_view a, a.fabrik_view)",function(c,b){if(c.rightClick){return}Fabrik.watchView(c,b)});Fabrik.removeEvent=function(d,c){if(Fabrik.events[d]){var b=Fabrik.events[d].indexOf(c);if(b!==-1){delete Fabrik.events[d][b]}}};Fabrik.addEvent=function(c,b){if(!Fabrik.events[c]){Fabrik.events[c]=[]}if(!Fabrik.events[c].contains(b)){Fabrik.events[c].push(b)}};Fabrik.addEvents=function(b){for(var c in b){Fabrik.addEvent(c,b[c])}return this};Fabrik.fireEvent=function(e,c,b){var d=Fabrik.events;this.eventResults=[];if(!d||!d[e]){return this}c=Array.from(c);d[e].each(function(f){if(b){this.eventResults.push(f.delay(b,this,c))}else{this.eventResults.push(f.apply(this,c))}},this);return this};Fabrik.requestQueue=new RequestQueue();Fabrik.cbQueue={google:[]};Fabrik.loadGoogleMap=function(e,b){var f=document.location.protocol==="https:"?"https:":"http:";var g=f+"//maps.googleapis.com/maps/api/js?&sensor="+e+"&callback=Fabrik.mapCb";var d=Array.from(document.scripts).filter(function(h){return h.src===g});if(d.length===0){var c=document.createElement("script");c.type="text/javascript";c.src=g;document.body.appendChild(c);Fabrik.cbQueue.google.push(b)}else{if(Fabrik.googleMap){window[b]()}else{Fabrik.cbQueue.google.push(b)}}};Fabrik.mapCb=function(){Fabrik.googleMap=true;for(var b=0;b<Fabrik.cbQueue.google.length;b++){window[Fabrik.cbQueue.google[b]]()}Fabrik.cbQueue.google=[]};Fabrik.watchDelete=function(h,g){var b,f,d;d=h.target.getParent(".fabrik_row");if(!d){d=Fabrik.activeRow}if(d){var j=d.getElement("input[type=checkbox][name*=id]");if(typeOf(j)!=="null"){j.checked=true}f=d.id.split("_");f=f.splice(0,f.length-2).join("_");b=Fabrik.blocks[f]}else{f=h.target.getParent(".fabrikList");if(typeOf(f)!=="null"){f=f.id;b=Fabrik.blocks[f]}else{var i=g.getParent(".floating-tip-wrapper");if(i){var c=i.retrieve("list");f=c.id}else{f=g.get("data-listRef")}b=Fabrik.blocks[f];if(b.options.actionMethod==="floating"&&!this.bootstrapped){b.form.getElements("input[type=checkbox][name*=id], input[type=checkbox][name=checkAll]").each(function(e){e.checked=true})}}}if(!b.submit("list.delete")){h.stop()}};Fabrik.watchEdit=function(h,g){var f=g.get("data-list");var d=Fabrik.blocks[f];var i=d.getActiveRow(h);if(!d.options.ajax_links){return}h.preventDefault();if(!i){return}d.setActive(i);var c=i.id.split("_").getLast();if(d.options.links.edit===""){url=Fabrik.liveSite+"index.php?option=com_fabrik&view=form&formid="+d.options.formid+"&rowid="+c+"&tmpl=component&ajax=1";loadMethod="xhr"}else{if(h.target.get("tag")==="a"){a=h.target}else{a=typeOf(h.target.getElement("a"))!=="null"?h.target.getElement("a"):h.target.getParent("a")}url=a.get("href");loadMethod="iframe"}$H(Fabrik.Windows).each(function(j,e){j.close()});var b={id:"add."+f+"."+c,title:d.options.popup_edit_label,loadMethod:loadMethod,contentURL:url,width:d.options.popup_width,height:d.options.popup_height,onClose:function(m){try{var j="form_"+d.options.formid+"_"+c;Fabrik.blocks[j].destroyElements();Fabrik.blocks[j].formElements=null;Fabrik.blocks[j]=null;delete (Fabrik.blocks[j])}catch(l){}}};if(typeOf(d.options.popup_offset_x)!=="null"){b.offset_x=d.options.popup_offset_x}if(typeOf(d.options.popup_offset_y)!=="null"){b.offset_y=d.options.popup_offset_y}Fabrik.getWindow(b)};Fabrik.watchView=function(h,g){var f=g.get("data-list");var d=Fabrik.blocks[f];if(!d.options.ajax_links){return}h.preventDefault();var i=d.getActiveRow(h);if(!i){return}d.setActive(i);var c=i.id.split("_").getLast();if(d.options.links.detail===""){url=Fabrik.liveSite+"index.php?option=com_fabrik&view=details&formid="+d.options.formid+"&rowid="+c+"&tmpl=component&ajax=1";loadMethod="xhr"}else{if(h.target.get("tag")==="a"){a=h.target}else{a=typeOf(h.target.getElement("a"))!=="null"?h.target.getElement("a"):h.target.getParent("a")}url=a.get("href");loadMethod="iframe"}$H(Fabrik.Windows).each(function(j,e){j.close()});var b={id:"view.."+f+"."+c,title:d.options.popup_view_label,loadMethod:loadMethod,contentURL:url,width:d.options.popup_width,height:d.options.popup_height,onClose:function(m){var j="details_"+d.options.formid+"_"+c;try{Fabrik.blocks[j].destroyElements();Fabrik.blocks[j].formElements=null;Fabrik.blocks[j]=null;delete (Fabrik.blocks[j])}catch(l){console.log(l)}}};if(typeOf(d.options.popup_offset_x)!=="null"){b.offset_x=d.options.popup_offset_x}if(typeOf(d.options.popup_offset_y)!=="null"){b.offset_y=d.options.popup_offset_y}Fabrik.getWindow(b)};Fabrik.form=function(d,e,c){var b=new FbForm(e,c);Fabrik.addBlock(d,b);return b};window.fireEvent("fabrik.loaded")};