// Style manager for standalone.io Web OS.
// Central inventory of theme / layout tokens and their metadata.

window.STANDALONE_OS = window.STANDALONE_OS || {};

(function () {
  const OS = window.STANDALONE_OS;
  OS.style = OS.style || {};
  // STANDALONE.IO CSS-MANAGER
  /*
  #1  This file defines all the variables for all the styles.
      For efficiency and consitency, mode permutations (dsk(desktop),mbl(mobile),tab(tablet)) are generated in realtime ad well as the final id.
  #2  Actual desktop, mobile and tablet css files will be there as real files and hardcoded, but a vast majority of values must be coming from
      the variables comgin from the tokens. SO THIS FILE EXCLUSIVELY DEALS WITH VARIABLES.
  #3  The final token ids accessible via OS.style.tokens ([]) and OS.style.tokensById ({}) 
      and therefore name of the css variables, are in the formnat:
        --os-MODE[dsk,mbl,tab]-group-originaltokenid
      for example
        --os-dsk-system-primary-buttonstyle
        --os-dsk-system-contentcolor
  */
  const globalThemeTokens = [
    {group:'theme',id:'--oss-theme-titles-font',type:'css-font',label:'Titles font'},
    {group:'theme',id:'--oss-theme-content-font',type:'css-font',label:'Content font'},
    {group:'theme',id:'--oss-theme-primary-color',type:'css-color',label:'Primary color'},
    {group:'theme',id:'--oss-theme-secondary-color',type:'css-color',label:'Secondary color'},
    // Extra theme-only knobs
    {id:'theme-text-size-sm',group:'Extra',type:'css-size',label:'Text size (small)'},
    {id:'theme-text-size-md',group:'Extra',type:'css-size',label:'Text size (medium)'},
    {id:'theme-text-size-lg',group:'Extra',type:'css-size',label:'Text size (large)'}
  ];
  const modeDependantTokensTemplate = [
    // Shell layout
    {group:'shell',id:'direction',type:'css-enum',label:'Desktop direction',
      options:['row','column']},
    {group:'shell',id:'align',type:'css-enum',label:'Desktop align'},
    {group:'shell',id:'justify',type:'css-enum',label:'Desktop justify',
      options:['stretch','flex-start','center','flex-end','space-between']},
    {group:'shell',id:'gap',type:'css-size',label:'Desktop gap'},
    {group:'shell',id:'sidebar-width',type:'css-size',label:'Sidebar width'},
    {group:'shell',id:'shell-padding',type:'css-size',label:'Shell padding'},
    {group:'shell',id:'shell-gap',type:'css-size',label:'Shell gap'},

    // Workspace switcher (left bar) layout
    {group:'switcher',id:'collapsed-width',type:'css-size',label:'Workspace switcher width'},
    {group:'switcher',id:'shadow',type:'css-shadow',label:'Workspace switcher docklet shadow'},
    // Corner radii
    {id:'radius-lg',group:'Radius',type:'css-size',label:'Radius large'},
    {id:'radius-md',group:'Radius',type:'css-size',label:'Radius medium'},
    {id:'radius-pill',group:'Radius',type:'css-size',label:'Radius pill'},
    
    // Launcher layout (right bar) 
    {group:'launcher',id:'collapsed-width',type:'css-size',label:'Launcher width'},
    {group:'launcher',id:'shadow',type:'css-shadow',label:'Launcher docklet shadow'},
    {group:'launcher',id:'icon-size',type:'css-size',label:'Launcher icon size'},
    {group:'launcher',id:'icon-shadow',type:'css-shadow',label:'Launcher icon shadow'},
    {group:'launcher',id:'icon-font',type:'css-font',label:'Launcher icon text'},

    // Windows layout
    {group:'win',id:'shadow',type:'css-shadow',label:'Windows shadows.'},
    {group:'win',id:'font',type:'css-font',label:'css-font expression for text.'},

    // Surface colors
    {id:'surface-bg',group:'Surfaces',type:'css-color',label:'Background'},
    {id:'surface-bg-alt',group:'Surfaces',type:'css-color',label:'Background (alt)'},

    // Accent + text colors
    {id:'accent',group:'Colors',type:'css-color',label:'Accent'},
    {id:'accent-soft',group:'Colors',type:'css-color',label:'Accent (soft)'},
    {id:'text',group:'Colors',type:'css-color',label:'Text'},
    {id:'text-muted',group:'Colors',type:'css-color',label:'Text (muted)'},
    {id:'border-subtle',group:'Colors',type:'css-color',label:'Border (subtle)'},

  ];
  const tokensDsk=[];const tokensMbl=[];const tokensTab=[];const tokensById = {};
  modeDependantTokensTemplate.forEach((t) => {
    tokensDsk.push({id:'--os-dsk-'+t.group+'-'+t.id,mode:'dsk',group:t.group,type:t.type,label:t.label,});
    tokensMbl.push({id:'--os-dsk-'+t.group+'-'+t.id,mode:'mbl',group:t.group,type:t.type,label:t.label,});
    tokensTab.push({id:'--os-dsk-'+t.group+'-'+t.id,mode:'tab',group:t.group,type:t.type,label:t.label,});
  });
  OS.style.tokens = globalThemeTokens.concat(tokensDsk.concat(tokensMbl.concat(tokensTab)));
  OS.style.tokens.forEach((t) => { 
    if (tokensById[t.id]) {console.warn('[os-style-manager] duplicate token id', t.id);}
    tokensById[t.id] = t; });
  OS.style.tokensById = tokensById;
  OS.style.listTokens = function listTokens() {
    return tokens.slice();
  };
  OS.style.getToken = function getToken(id) {
    return tokensById[id] || null;
  };
})();
