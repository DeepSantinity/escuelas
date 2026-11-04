(()=>{
  const map=window.sirioniMap;
  const panel=document.getElementById("tools-content");
  if(!map||!panel){
    console.error("No se pudieron inicializar las herramientas de dibujo: falta el mapa o el panel.");
    return;
  }

  const oldMeasure=document.getElementById("measure");
  const oldClear=document.getElementById("clear");
  const oldHeading=panel.querySelector("h2");
  if(oldMeasure)oldMeasure.closest(".tool-action").remove();
  if(oldClear)oldClear.closest(".tool-action").remove();
  if(oldHeading)oldHeading.remove();

  const markup=`
    <h2 class="drawing-tools-heading">
      <span>Dibujos y medidas</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 20 5-5m2-2 2-2m2-2 5-5M7 7l2 2m-3 7 2 2m7-13 2 2M4 4l2 2"/></svg>
    </h2>
    <div class="drawing-tools-grid">
      <button class="drawing-tool" type="button" data-tool="marker" aria-label="Colocar marcador"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>Marcador</span></button>
      <button class="drawing-tool" type="button" data-tool="text" aria-label="Colocar texto en el mapa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5h16M12 5v14m-4 0h8"/></svg><span>Texto</span></button>
      <button class="drawing-tool" type="button" data-tool="line" aria-label="Dibujar líneas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="18" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="15" r="2"/><path d="m6.2 16.3 4.6-8.5m2.8-.1 4.2 5.8"/></svg><span>Líneas</span></button>
      <button class="drawing-tool" type="button" data-tool="measure-line" aria-label="Medir distancia"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v10h18V7M7 7v4m4-4v2m4-2v4m4-4v2"/></svg><span>Medir líneas</span></button>
      <button class="drawing-tool" type="button" data-tool="measure-area" aria-label="Medir área"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 19 2-14 14 14H4Z"/><path d="M7 15h2m0-3h2m0-3h2"/></svg><span>Medir áreas</span></button>
      <button class="drawing-tool" type="button" data-tool="buffer" aria-label="Medir un buffer"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/></svg><span>Medir buffer</span></button>
    </div>
    <label class="buffer-radius" for="buffer-radius">Radio del buffer (metros)
      <input id="buffer-radius" type="number" min="1" max="100000" step="1" value="500" inputmode="numeric">
    </label>
    <p class="drawing-help" id="drawing-help">Elegí una herramienta y hacé clic en el mapa. Para terminar una línea o área, hacé doble clic. Esc cancela.</p>
    <button class="drawing-clear" type="button" id="clear-drawings">Borrar dibujos y medidas</button>`;
  panel.insertAdjacentHTML("afterbegin",markup);

  const buttons=[...panel.querySelectorAll("[data-tool]")];
  const drawingLayer=L.featureGroup().addTo(map);
  const previewLayer=L.layerGroup().addTo(map);
  const help=document.getElementById("drawing-help");
  const radiusInput=document.getElementById("buffer-radius");
  const toast=(message)=>{
    const node=document.getElementById("toast");
    node.textContent=message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove("show"),3000);
  };
  let mode=null;
  let points=[];
  let preview=null;
  let textToPlace="";
  let previousDoubleClickZoom=true;
  let pathModeActive=false;

  const formatDistance=(meters)=>meters>=1000
    ?(meters/1000).toLocaleString("es-AR",{maximumFractionDigits:2})+" km"
    :Math.round(meters).toLocaleString("es-AR")+" m";
  const formatArea=(squareMeters)=>squareMeters>=1000000
    ?(squareMeters/1000000).toLocaleString("es-AR",{maximumFractionDigits:3})+" km²"
    :squareMeters.toLocaleString("es-AR",{maximumFractionDigits:0})+" m²";
  const polygonArea=(latlngs)=>{
    const earthRadius=6378137;
    const originLat=latlngs.reduce((sum,point)=>sum+point.lat,0)/latlngs.length*Math.PI/180;
    const projected=latlngs.map(point=>({
      x:earthRadius*point.lng*Math.PI/180*Math.cos(originLat),
      y:earthRadius*point.lat*Math.PI/180
    }));
    let area=0;
    for(let index=0;index<projected.length;index++){
      const current=projected[index];
      const next=projected[(index+1)%projected.length];
      area+=current.x*next.y-next.x*current.y;
    }
    return Math.abs(area/2);
  };
  const setMode=(nextMode)=>{
    const nextIsPath=["line","measure-line","measure-area"].includes(nextMode);
    if(nextIsPath&&!pathModeActive){
      previousDoubleClickZoom=map.doubleClickZoom.enabled();
    }else if(!nextIsPath&&pathModeActive){
      if(previousDoubleClickZoom)map.doubleClickZoom.enable();
      else map.doubleClickZoom.disable();
    }
    pathModeActive=nextIsPath;
    mode=nextMode;
    points=[];
    textToPlace="";
    previewLayer.clearLayers();
    preview=null;
    buttons.forEach(button=>button.classList.toggle("active",button.dataset.tool===mode));
    map.getContainer().classList.toggle("drawing-active",Boolean(mode));
    if(pathModeActive)map.doubleClickZoom.disable();
    const messages={
      marker:"Hacé clic en el mapa para colocar un marcador.",
      text:"Hacé clic en el mapa para colocar el texto.",
      line:"Hacé clic para agregar puntos y hacé doble clic para terminar la línea.",
      "measure-line":"Seleccioná dos puntos para medir la distancia.",
      "measure-area":"Hacé clic para marcar los vértices y doble clic para medir el área.",
      buffer:"Hacé clic en el mapa para colocar el centro del buffer."
    };
    help.textContent=messages[mode]||"Elegí una herramienta y hacé clic en el mapa. Para terminar una línea o área, hacé doble clic. Esc cancela.";
    if(mode)toast(messages[mode]);
  };
  const finishPath=()=>{
    if(!mode||!["line","measure-line","measure-area"].includes(mode))return;
    if(points.length>1&&map.distance(points[points.length-1],points[points.length-2])<2){
      points.pop();
    }
    const finishedMode=mode;
    const minimum=finishedMode==="measure-area"?3:2;
    if(points.length<minimum){
      toast(finishedMode==="measure-area"?"Marcá al menos tres puntos para medir el área.":"Marcá al menos dos puntos.");
      return;
    }
    previewLayer.clearLayers();
    preview=null;
    if(finishedMode==="measure-area"){
      const polygon=L.polygon(points,{color:"#286a50",weight:2,fillColor:"#66a77a",fillOpacity:.2}).addTo(drawingLayer);
      const perimeter=points.reduce((sum,point,index)=>sum+map.distance(point,points[(index+1)%points.length]),0);
      toast("Área: "+formatArea(polygonArea(points))+" · Perímetro: "+formatDistance(perimeter));
      polygon.bindPopup("Área: "+formatArea(polygonArea(points))+"<br>Perímetro: "+formatDistance(perimeter));
    }else{
      const line=L.polyline(points,{color:finishedMode==="measure-line"?"#df7459":"#286a50",weight:3,dashArray:finishedMode==="measure-line"?"6 6":null}).addTo(drawingLayer);
      const distance=points.slice(1).reduce((sum,point,index)=>sum+map.distance(points[index],point),0);
      if(finishedMode==="measure-line"){
        toast("Distancia: "+formatDistance(distance));
        line.bindPopup("Distancia: "+formatDistance(distance));
      }else{
        toast("Línea agregada. Longitud: "+formatDistance(distance));
        line.bindPopup("Longitud: "+formatDistance(distance));
      }
    }
    setMode(null);
  };
  const drawPreview=()=>{
    if(preview)previewLayer.removeLayer(preview);
    if(mode==="measure-area"&&points.length>=2){
      preview=L.polygon(points,{color:"#286a50",weight:2,fillColor:"#66a77a",fillOpacity:.12,dashArray:"5 5"}).addTo(previewLayer);
    }else if(points.length>=2){
      preview=L.polyline(points,{color:"#286a50",weight:2,dashArray:"5 5"}).addTo(previewLayer);
    }
  };

  buttons.forEach(button=>button.addEventListener("click",()=>{
    if(button.dataset.tool===mode){
      setMode(null);
      return;
    }
    if(button.dataset.tool==="text"){
      const text=window.prompt("Escribí el texto que querés colocar en el mapa:");
      if(text===null||!text.trim()){
        setMode(null);
        return;
      }
      textToPlace=text.trim();
    }
    if(button.dataset.tool==="buffer"){
      const radius=Number(radiusInput.value);
      if(!Number.isFinite(radius)||radius<1||radius>100000){
        toast("Ingresá un radio entre 1 y 100.000 metros.");
        radiusInput.focus();
        return;
      }
    }
    setMode(button.dataset.tool);
  }));

  map.on("click",event=>{
    if(!mode)return;
    if(mode==="marker"){
      L.marker(event.latlng).addTo(drawingLayer).bindPopup("Marcador");
      toast("Marcador colocado.");
      setMode(null);
    }else if(mode==="text"){
      L.marker(event.latlng,{icon:L.divIcon({
        className:"map-drawing-label",
        html:"<span>"+textToPlace.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))+"</span>",
        iconSize:null
      })}).addTo(drawingLayer);
      toast("Texto colocado.");
      setMode(null);
    }else if(mode==="buffer"){
      const radius=Number(radiusInput.value);
      const area=Math.PI*radius*radius;
      L.circle(event.latlng,{radius,color:"#286a50",weight:2,fillColor:"#66a77a",fillOpacity:.2}).addTo(drawingLayer)
        .bindPopup("Radio: "+formatDistance(radius)+"<br>Área aproximada: "+formatArea(area));
      toast("Buffer de "+formatDistance(radius)+" · Área: "+formatArea(area));
      setMode(null);
    }else{
      points.push(event.latlng);
      L.circleMarker(event.latlng,{radius:4,color:"#fff",weight:2,fillColor:"#286a50",fillOpacity:1}).addTo(previewLayer);
      drawPreview();
      if(mode==="measure-line"&&points.length===2)finishPath();
    }
  });
  map.on("dblclick",finishPath);
  document.getElementById("clear-drawings").addEventListener("click",()=>{
    setMode(null);
    drawingLayer.clearLayers();
    previewLayer.clearLayers();
    toast("Se borraron los dibujos y las medidas.");
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&mode)setMode(null);
  });
})();
