// Nexus GRC Lion — Traducción de toda la interfaz al inglés (ES/EN).
(function(){
  'use strict';
  var D=window.NEXUS_EN||{},CI=null;
  var TOK=/(MAP-REQ-[A-Za-z0-9.]+-[A-Z]{2,4}-\d+|(?:REQ|CTL)-[A-Za-z0-9]+-[A-Za-z0-9.]+|(?<![A-Za-z0-9.])[A-Z]{2,4}-\d{2}(?![A-Za-z0-9])|(?<![A-Za-z0-9.])\d+(?:[.,]\d+)?(?![A-Za-z0-9])|(?<=“)[^”]+(?=”))/g;
  function isEn(){try{return db&&db.settings&&db.settings.language==='en'}catch(e){return false}}
  function ci(){if(!CI){CI={};for(var k in D)CI[k.toLowerCase()]=D[k]}return CI}
  function fill(t,args){var i=0;return t.replace(/\{\}/g,function(){return i<args.length?args[i++]:''})}
  var RULES=[
    [/^Cubrir (.+) con una capacidad verificable\.$/,function(m){return 'Cover '+m[1]+' with a verifiable capability.'}],
    [/^Necesidad de gestión relacionada con (.+)\.$/,function(m){return 'Management need related to '+low(m[1])+'.'}],
    [/^Establecer una capacidad verificable de (.+) y mantenerla de forma consistente\.$/,function(m){return 'Establish a verifiable capability to '+low(m[1])+' and maintain it consistently.'}]
  ];
  function low(x){var v=ci()[x.toLowerCase()];return v?v.charAt(0).toLowerCase()+v.slice(1):x}
  function core(s){
    if(!s)return s;
    if(Object.prototype.hasOwnProperty.call(D,s))return D[s];
    var args=[],t=s.replace(TOK,function(m){args.push(m);return '{}'});
    if(t!==s&&Object.prototype.hasOwnProperty.call(D,t))return fill(D[t],args);
    for(var i=0;i<RULES.length;i++){var m=RULES[i][0].exec(s);if(m)return RULES[i][1](m)}
    var c=s.indexOf(': ');
    if(c>0&&c<60){var a=s.slice(0,c),b=s.slice(c+2),ta=core(a),tb=core(b);if(ta!==a||tb!==b)return ta+': '+tb}
    if(s.indexOf(' · ')>0){var parts=s.split(' · '),out=parts.map(core);if(out.some(function(x,j){return x!==parts[j]}))return out.join(' · ')}
    return s;
  }
  function tr(s){
    if(typeof s!=='string'||!s)return s;
    var m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s);if(!m||!m[2])return s;
    var r=core(m[2].replace(/\s+/g,' '));
    return r===m[2].replace(/\s+/g,' ')?s:m[1]+r+m[3];
  }
  var ATTRS=['placeholder','title','aria-label','alt'];
  function node(n){
    if(n.nodeType===3){
      var p=n.parentNode;if(p&&(p.nodeName==='SCRIPT'||p.nodeName==='STYLE'))return;
      var v=tr(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v;
    }else if(n.nodeType===1){
      if(n.nodeName==='SCRIPT'||n.nodeName==='STYLE')return;
      for(var i=0;i<ATTRS.length;i++){var a=n.getAttribute(ATTRS[i]);if(a){var t=tr(a);if(t!==a)n.setAttribute(ATTRS[i],t)}}
      if(n.nodeName==='INPUT'&&(n.type==='button'||n.type==='submit')&&n.value){var tv=tr(n.value);if(tv!==n.value)n.value=tv}
      for(var c=n.firstChild;c;c=c.nextSibling)node(c);
    }
  }
  var obs=null,busy=false;
  function run(roots){
    if(!isEn()||busy)return;busy=true;
    try{roots.forEach(function(r){if(r.isConnected!==false)node(r)});
      if(document.title){var t=tr(document.title);if(t!==document.title)document.title=t}
    }finally{busy=false;if(obs)obs.takeRecords()}
  }
  function start(){
    if(typeof MutationObserver==='undefined'||typeof document==='undefined'||!document.body)return;
    obs=new MutationObserver(function(recs){
      if(!isEn())return;var roots=[];
      recs.forEach(function(r){
        if(r.type==='childList')r.addedNodes.forEach(function(n){roots.push(n)});
        else if(r.type==='characterData')roots.push(r.target);
        else if(r.type==='attributes')roots.push(r.target);
      });
      run(roots);
    });
    obs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS});
    run([document.body]);
  }
  ['alert','confirm','prompt'].forEach(function(k){
    var f=window[k];if(typeof f!=='function')return;
    window[k]=function(m){var a=Array.prototype.slice.call(arguments);if(isEn()&&typeof a[0]==='string')a[0]=tr(a[0]);if(isEn()&&k==='prompt'&&typeof a[1]==='string')a[1]=tr(a[1]);return f.apply(window,a)};
  });
  window.nexusTranslate=tr;window.nexusApplyLanguage=function(){run([document.body])};
  if(typeof document!=='undefined'){
    if(document.body)start();else if(document.addEventListener)document.addEventListener('DOMContentLoaded',start);
  }
})();
