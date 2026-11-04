
    (()=>{
      const center=[-34.92,-57.95];
      const layers=[
        {id:"initial",name:"Nivel Inicial",file:"./geojson/2026-10-19/niveles/inicial/estatal/nivel_inicial_gestion_estatal_2026-10-19.geojson",count:0,color:"#d39b32",icon:"school",active:false,favorite:true},
        {id:"initial-private",name:"Nivel Inicial · Privada",file:"./geojson/2026-10-19/niveles/inicial/privada/nivel_inicial_gestion_privada_2026-10-19.geojson",count:0,color:"#b76e18",icon:"school",management:"Privada",active:false,favorite:false},
        {id:"special-initial",name:"Especial · Inicial",file:"./geojson/2026-10-19/modalidades/especial/inicial/estatal/modalidad_especial_inicial_gestion_estatal_2026-10-19.geojson",count:0,color:"#d16b56",icon:"special",active:false,favorite:false},
        {id:"primary",name:"Nivel Primario",file:"./geojson/2026-10-19/niveles/primario/estatal/nivel_primario_gestion_estatal_2026-10-19.geojson",count:0,color:"#286a50",icon:"school",active:false,favorite:true},
        {id:"primary-private",name:"Nivel Primario · Privada",file:"./geojson/2026-10-19/niveles/primario/privada/nivel_primario_gestion_privada_2026-10-19.geojson",count:0,color:"#42866b",icon:"school",management:"Privada",active:false,favorite:false},
        {id:"special-primary",name:"Especial · Primaria",file:"./geojson/2026-10-19/modalidades/especial/primaria/estatal/modalidad_especial_primaria_gestion_estatal_2026-10-19.geojson",count:0,color:"#bd5745",icon:"special",active:false,favorite:false},
        {id:"secondary",name:"Nivel Secundario",file:"./geojson/2026-10-19/niveles/secundario/estatal/nivel_secundario_gestion_estatal_2026-10-19.geojson",count:0,color:"#df7459",icon:"school",active:false,favorite:true},
        {id:"secondary-private",name:"Nivel Secundario · Privada",file:"./geojson/2026-10-19/niveles/secundario/privada/nivel_secundario_gestion_privada_2026-10-19.geojson",count:0,color:"#b95545",icon:"school",management:"Privada",active:false,favorite:false},
        {id:"art-secondary",name:"Artística · Secundaria",file:"./geojson/2026-10-19/modalidades/artistica/secundaria/estatal/modalidad_artistica_secundaria_gestion_estatal_2026-10-19.geojson",count:0,color:"#a14f83",icon:"art",active:false,favorite:false},
        {id:"special-labor",name:"Especial · Formación Laboral",file:"./geojson/2026-10-19/modalidades/especial/formacion-laboral/estatal/modalidad_especial_formacion-laboral_gestion_estatal_2026-10-19.geojson",count:0,color:"#387e83",icon:"special",active:false,favorite:false},
        {id:"special-integral",name:"Especial · Formación Integral",file:"./geojson/2026-10-19/modalidades/especial/formacion-integral/estatal/modalidad_especial_formacion-integral_gestion_estatal_2026-10-19.geojson",count:0,color:"#56738c",icon:"special",active:false,favorite:false},
        {id:"tertiary",name:"Nivel Superior",file:"./geojson/2026-10-19/niveles/superior/estatal/nivel_superior_gestion_estatal_2026-10-19.geojson",count:0,color:"#4b83ac",icon:"school",active:false,favorite:true},
        {id:"tertiary-private",name:"Nivel Superior · Privada",file:"./geojson/2026-10-19/niveles/superior/privada/nivel_superior_gestion_privada_2026-10-19.geojson",count:0,color:"#376b91",icon:"school",management:"Privada",active:false,favorite:false},
        {id:"art-tertiary",name:"Artística · Superior",file:"./geojson/2026-10-19/modalidades/artistica/superior/estatal/modalidad_artistica_superior_gestion_estatal_2026-10-19.geojson",count:0,color:"#7f5c9b",icon:"art",active:false,favorite:false},
        {id:"technical-secondary",name:"Técnica · Secundaria",file:"./geojson/2026-10-19/modalidades/tecnico-profesional/secundaria/estatal/modalidad_tecnico-profesional_secundaria_gestion_estatal_2026-10-19.geojson",count:0,color:"#9a8051",icon:"school",active:false,favorite:false},
        {id:"technical-tertiary",name:"Técnica · Superior",file:"./geojson/2026-10-19/modalidades/tecnico-profesional/superior/estatal/modalidad_tecnico-profesional_superior_gestion_estatal_2026-10-19.geojson",count:0,color:"#826c9c",icon:"tools",active:false,favorite:false}
      ];
      const layerCategories=[
        {id:"levels",name:"Niveles educativos",icon:"school",matches:layer=>!["art-secondary","art-tertiary","special-initial","special-primary","special-labor","special-integral","technical-secondary","technical-tertiary"].includes(layer.id)},
        {id:"artistic",name:"Artística",icon:"art",matches:layer=>layer.id.startsWith("art-")},
        {id:"special",name:"Especial",icon:"special",matches:layer=>layer.id.startsWith("special-")},
        {id:"technical",name:"Técnico-profesional",icon:"tools",matches:layer=>layer.id.startsWith("technical-")}
      ];
      const icons={school:'<path d="M3 10 12 4l9 6v10H3z"/><path d="M8 20v-6h8v6M7 10h.01M12 10h.01M17 10h.01"/>',special:'<path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z"/><path d="M12 10v6M9 13h6"/>',art:'<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.4-3h1.2A3.7 3.7 0 0 0 21 11C21 6.6 17 3 12 3Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="10" cy="6.8" r=".8"/><circle cx="14" cy="6.8" r=".8"/>',tools:'<path d="M14.5 6.5a5 5 0 0 0-6.4 6.4L3 18l3 3 5.1-5.1a5 5 0 0 0 6.4-6.4l-3 3-3-3z"/>',pin:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20"/>',building:'<path d="M4 21V5l8-3 8 3v16M2 21h20M8 8h1M15 8h1M8 12h1M15 12h1M10 21v-5h4v5"/>',work:'<path d="M3 8h18v12H3zM8 8V5h8v3M3 13h18M10 13v2h4v-2"/>',boundary:'<path d="m4 5 6-2 5 3 5-2v15l-5 2-5-3-6 2zM10 3v15M15 6v15"/>'};
      const iconPaths=Object.fromEntries(Object.entries(icons).map(([name,markup])=>[name,[...markup.matchAll(/d="([^"]+)"/g)].map(([,path])=>new Path2D(path))]));
      const IconCanvas=L.Canvas.extend({_updateCircle(layer){L.Canvas.prototype._updateCircle.call(this,layer);if(!this._drawing)return;const paths=iconPaths[layer.options.iconType];if(!paths)return;const context=this._ctx;context.save();context.translate(layer._point.x,layer._point.y);context.scale(.38,.38);context.translate(-12,-12);context.strokeStyle="#fff";context.lineWidth=2.4;context.lineCap="round";context.lineJoin="round";paths.forEach(path=>context.stroke(path));context.restore()}});
      const pointStyle=(layer)=>({renderer:pointsRenderer,iconType:layer.icon,radius:layer.icon==="art"||layer.icon==="special"?8:7,color:layer.management==="Privada"?"#172b2a":"#fff",weight:layer.management==="Privada"?1.5:1.2,dashArray:layer.management==="Privada"?"2 2":null,fillColor:layer.color,fillOpacity:.96});
      const map=L.map("map",{zoomControl:false,preferCanvas:true}).setView(center,11);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,attribution:'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, and the GIS User Community'}).addTo(map);L.control.zoom({position:"bottomright"}).addTo(map);
      let openSchoolLayer=null,openSchoolLatLng=null;
      map.on("popupopen",event=>{
        const source=event.popup._source;
        if(source?.feature){
          openSchoolLayer=source;
          openSchoolLatLng=event.popup.getLatLng();
          if(window.sirioniUserRole==="fed")loadFedAdministrativeDetails(event.popup);
        }
      });
      map.on("popupclose",event=>{
        if(event.popup._source===openSchoolLayer){
          openSchoolLayer=null;
          openSchoolLatLng=null;
        }
      });
      window.addEventListener("sirioni:auth-change",()=>{
        if(!openSchoolLayer||!openSchoolLatLng||!map.hasLayer(openSchoolLayer))return;
        const source=openSchoolLayer;
        const latlng=openSchoolLatLng;
        map.closePopup();
        source.openPopup(latlng);
      });
      const datasets=new Map(),schools=[],pointsRenderer=new IconCanvas({padding:.5});let onlyActive=false,favoritesOnly=false,measuring=false,measurePoints=[],measureLine=null,toastTimer,userLocationMarker=null;const managementExpanded=new Set(["Estatal"]),expandedCategories=new Set(["Estatal:levels"]);
      const toast=(message)=>{const node=document.getElementById("toast");node.textContent=message;node.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),2600)};
      const escapeHtml=(value)=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
      const normalizeSearchText=(value)=>String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es").replace(/[^a-z0-9]+/g," ").trim();
      const schoolSearchIndex=new WeakMap();
      const getSchoolShortName=(school,layerId)=>{const properties=school.properties||school;layerId=layerId||school.layerId;const type=normalizeSearchText(properties.tipo_organizacion);let label;if(layerId.startsWith("special-")||type.includes("educacion especial"))label="Especial";else if(type.includes("jardin de infantes")||layerId==="initial"||layerId==="initial-private")label="Jardín";else if(type.includes("educacion primaria")||layerId.startsWith("primary"))label="Primaria";else if(type.includes("secundaria agraria"))label="Agraria";else if(type.includes("secundaria tecnica")||layerId==="technical-secondary")label="Técnica";else if(type.includes("danzas clasicas"))label="Danzas";else if(type.includes("secundaria especializada en arte")||layerId.startsWith("art-"))label="Artística";else if(type.includes("educacion secundaria")||layerId==="secondary"||layerId==="secondary-private")label="Secundaria";else if(type.includes("instituto superior")||layerId==="tertiary"||layerId==="tertiary-private"||layerId==="technical-tertiary")label="Superior";else label=properties.tipo_organizacion?.replace(/^ESCUELA DE EDUCACIÓN\s*/i,"").replace(/^ESCUELA\s+DE\s*/i,"").trim();const number=String(properties.nro_escuela??"").match(/\d+/)?.[0]||String(properties.nombre??"").match(/\bN[º°]\s*(\d+)/i)?.[1];return label&&number?label+" "+Number(number):null};
      const getSchoolSearchFields=(school)=>{let fields=schoolSearchIndex.get(school);if(!fields){const properties=school.properties,shortName=getSchoolShortName(properties,school.layerId);fields={name:normalizeSearchText(properties.nombre),shortName:normalizeSearchText(shortName),text:normalizeSearchText([properties.nombre,shortName,properties.localidad,properties.distrito,properties.cue,properties.cueanexo,properties.nro_escuela,properties.clave].join(" "))};schoolSearchIndex.set(school,fields)}return fields};
      const loadFedAdministrativeDetails=async popup=>{
        const card=popup.getElement()?.querySelector(".school-card");
        const properties=popup._source?.feature?.properties;
        const schoolId=properties?.cueanexo??properties?.clave??properties?.idserv;
        if(!card||schoolId==null||String(schoolId).trim()==="")return;
        const section=document.createElement("section");
        section.className="fed-administrative-details";
        section.setAttribute("aria-label","Datos administrativos");
        const heading=document.createElement("h4");
        heading.className="reviews-title";
        heading.textContent="Datos administrativos F.E.D.";
        const content=document.createElement("div");
        content.className="fed-administrative-list";
        content.textContent="Cargando datos administrativos...";
        const formHost=document.createElement("div");
        formHost.className="fed-administrative-form-host";
        section.append(heading,content,formHost);
        const actions=card.querySelector(".school-card-actions");
        if(actions)card.insertBefore(section,actions);
        else card.append(section);
        const client=window.sirioniAccount?.client;
        if(!client){
          content.textContent="Iniciá sesión con una cuenta F.E.D. para consultar estos datos.";
          return;
        }
        const renderEntryForm=()=>{
          formHost.replaceChildren();
          const form=document.createElement("form");
          form.className="fed-administrative-form";
          const cargoLabel=document.createElement("label");
          cargoLabel.textContent="Cargo";
          const cargo=document.createElement("select");
          cargo.name="cargo";
          cargo.required=true;
          [
            ["Director","Director"],
            ["Vicedirector","Vicedirector"],
            ["Secretario","Secretario"],
            ["EMATP","EMATP"]
          ].forEach(([value,label])=>{
            const option=document.createElement("option");
            option.value=value;
            option.textContent=label;
            cargo.append(option);
          });
          cargoLabel.append(cargo);
          const fields=[
            ["nombre","Nombre","text"],
            ["apellido","Apellido","text"],
            ["tel","Teléfono","tel"],
            ["dni","DNI","text"],
            ["cuil","CUIL","text"]
          ];
          const controls={};
          form.append(cargoLabel);
          fields.forEach(([name,label,type])=>{
            const fieldLabel=document.createElement("label");
            fieldLabel.textContent=label;
            const input=document.createElement("input");
            input.name=name;
            input.type=type;
            input.autocomplete="off";
            input.maxLength=name==="tel"?18:50;
            input.placeholder=label;
            if(["tel","dni","cuil"].includes(name)){
              input.inputMode="numeric";
              input.pattern="[0-9]*";
              input.addEventListener("input",()=>{input.value=input.value.replace(/[^0-9]/g,"")});
            }
            controls[name]=input;
            fieldLabel.append(input);
            form.append(fieldLabel);
          });
          const submit=document.createElement("button");
          submit.className="review-submit";
          submit.type="submit";
          submit.textContent="Guardar datos administrativos";
          form.append(submit);
          form.addEventListener("submit",async event=>{
            event.preventDefault();
            const values=Object.fromEntries(fields.map(([name])=>[name,controls[name].value.trim()]));
            if(!Object.values(values).some(Boolean)){
              toast("Completá al menos un dato antes de guardar.");
              return;
            }
            submit.disabled=true;
            try{
              const {error}=await client.rpc("save_fed_school_administration",{
                p_school_id:String(schoolId),
                p_cargo:cargo.value,
                p_nombre:values.nombre||null,
                p_apellido:values.apellido||null,
                p_tel:values.tel||null,
                p_dni:values.dni||null,
                p_cuil:values.cuil||null
              });
              if(error)throw error;
              form.reset();
              await loadData();
              toast("Datos administrativos guardados.");
            }catch(error){
              console.error("Error al guardar datos administrativos F.E.D.:",error);
              toast(error.message||"No se pudieron guardar los datos administrativos.");
            }finally{
              submit.disabled=false;
            }
          });
          formHost.append(form);
        };
        const loadData=async()=>{
          content.textContent="Cargando datos administrativos...";
          const {data,error}=await client.rpc("get_fed_school_administration",{p_school_id:String(schoolId)});
          if(error)throw error;
          if(!card.isConnected)return;
          if(!Array.isArray(data))throw new Error("La respuesta de datos administrativos no tiene el formato esperado.");
          content.replaceChildren();
          if(data.length===0){
            content.textContent="Todavía no hay datos asociados. Podés cargarlos en los campos vacíos.";
          }else{
            data.forEach(person=>{
              const item=document.createElement("div");
              item.className="fed-administrative-person";
              const name=document.createElement("strong");
              name.textContent=person.nombre||person.cargo||"Cargo sin asignar";
              item.append(name);
              if(person.cargo&&person.nombre){
                const role=document.createElement("span");
                role.textContent=person.cargo;
                item.append(role);
              }
              const details=[
                person.telefono?`Teléfono: ${person.telefono}`:null,
                person.dni?`DNI: ${person.dni}`:null,
                person.cuil?`CUIL: ${person.cuil}`:null
              ].filter(Boolean);
              if(details.length){
                const info=document.createElement("span");
                info.textContent=details.join(" · ");
                item.append(info);
              }
              content.append(item);
            });
          }
          renderEntryForm();
        };
        try{
          await loadData();
        }catch(error){
          console.error("Error al cargar datos administrativos F.E.D.:",error);
          if(card.isConnected)content.textContent="No se pudieron cargar los datos. Revisá que ejecutaste supabase/fed-administrative-access.sql.";
        }
      };
      const popupContent=(properties,layer,latlng)=>{const canViewFedDetails=window.sirioniUserRole==="fed";if(!canViewFedDetails)properties={...properties,calle:null,nro:null,nro_telefono:null,caracteristica_telefonica:null,administrador:null,director:null};const card=document.createElement("article");card.className="school-card";const address=[properties.calle,properties.nro].filter(value=>value&&value!=="S/N").join(" ");const title=document.createElement("h3");title.className="school-card-title";title.textContent=getSchoolShortName(properties,layer.id)||properties.nombre||"Establecimiento educativo";title.title=properties.nombre||"";const head=document.createElement("header");head.className="school-card-head";const symbol=document.createElement("span");symbol.className="school-card-symbol";symbol.style.color=layer.color;symbol.style.background=layer.color+"19";symbol.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[layer.icon]+'</svg>';const heading=document.createElement("div"),category=document.createElement("div");category.className="school-card-category";category.textContent=[layer.name,properties.sector||layer.management].filter(Boolean).join(" · ");heading.append(category,title);head.append(symbol,heading);card.append(head);const body=document.createElement("div");body.className="school-card-body";const addRow=(path,value,href)=>{if(!value)return;const row=document.createElement("div");row.className="school-card-row";row.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>';const text=document.createElement(href?"a":"span");text.textContent=value;if(href){text.href=href;text.rel="noopener"}row.append(text);body.append(row)};addRow('<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',address);addRow('<path d="M3 9.5 12 4l9 5.5v9.8a.7.7 0 0 1-.7.7H3.7a.7.7 0 0 1-.7-.7z"/><path d="M8 20v-6h8v6M7.5 10h.01M12 10h.01M16.5 10h.01"/>',properties.localidad,properties.distrito);
      addRow('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.7L7.7 9.5a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.7-.6l2.8.5a2 2 0 0 1 1.5 1.8Z"/>',properties.nro_telefono,properties.nro_telefono?"tel:"+String(properties.caracteristica_telefonica||"")+String(properties.nro_telefono).replace(/[^\d+]/g,""):null);addRow('<path d="M4 4h16v16H4zM4 5l8 7 8-7"/>',properties.email,properties.email?"mailto:"+properties.email:null);addRow('<path d="M4 5h16v15H4zM8 9h8M8 13h8M8 17h5"/>',[properties.turnos?"Turnos: "+properties.turnos:null,properties.cueanexo?"CUE anexo: "+properties.cueanexo:null].filter(Boolean).join(" · "));addRow('<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 7v5l3 2"/>',properties.administrador||properties.director);if(properties.matricula||properties.secciones){const stats=document.createElement("div");stats.className="school-card-stats";[["Matrícula",properties.matricula],["Secciones",properties.secciones]].forEach(([label,value])=>{if(value==null)return;const stat=document.createElement("div");stat.className="school-card-stat";const caption=document.createElement("small"),number=document.createElement("strong");caption.textContent=label;number.textContent=Number(value).toLocaleString("es-AR");stat.append(caption,number);stats.append(stat)});body.append(stats)}card.append(body);const actions=document.createElement("footer");actions.className="school-card-actions";const directions=document.createElement("a");directions.className="school-card-action";directions.href="https://www.google.com/maps/dir/?api=1&destination="+latlng.lat+","+latlng.lng;directions.target="_blank";directions.rel="noopener noreferrer";directions.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 21 3l-8 18-2-8zM11 13l5-5"/></svg>Cómo llegar';actions.append(directions);card.append(actions);return card};
      const loadLayers=async()=>{let bundledData;try{bundledData=await window.sirioniGeojsonData}catch(error){console.error("No se pudo cargar el paquete GeoJSON.",error);toast("No se pudo cargar js/geojson-data.js. Volvé a generarlo con el script de construcción.");return}const settled=await Promise.allSettled(layers.map(async layer=>{let geojson=bundledData?.[layer.file];if(!geojson){if(location.protocol==="file:")throw new Error("El GeoJSON no está incluido en js/geojson-data.js");const response=await fetch(encodeURI(layer.file));if(!response.ok)throw new Error("HTTP "+response.status);geojson=await response.json()}layer.count=geojson.features.length;geojson.features.forEach(feature=>schools.push({properties:feature.properties||{},coordinates:feature.geometry?.coordinates||[],layerId:layer.id}));const dataset=L.geoJSON(geojson,{pointToLayer:(feature,latlng)=>L.circleMarker(latlng,pointStyle(layer)),onEachFeature:(feature,featureLayer)=>featureLayer.bindPopup(()=>popupContent(feature.properties||{},layer,featureLayer.getLatLng()),{className:"school-popup",maxWidth:340,autoPanPadding:[24,24]})});datasets.set(layer.id,dataset);if(layer.active)dataset.addTo(map);return layer}));const failed=settled.filter(result=>result.status==="rejected");renderLayers();updateMarkers();const bounds=L.featureGroup([...datasets.values()]).getBounds();if(bounds.isValid())map.fitBounds(bounds.pad(.06),{maxZoom:12});document.getElementById("map-title").textContent="Provincia de Buenos Aires";if(failed.length)toast(location.protocol==="file:"?"No se pudieron cargar "+failed.length+" capas del paquete GeoJSON. Regenerá js/geojson-data.js.":"No se pudieron cargar "+failed.length+" GeoJSON. Abrí la página con Live Server o localhost.");else toast("Se cargaron "+schools.length.toLocaleString("es-AR")+" establecimientos.")};
      const renderLayers=()=>{
        const list=document.getElementById("layer-list");
        const query=document.getElementById("layer-filter").value.trim().toLocaleLowerCase("es");
        const visible=layers.filter(layer=>layer.name.toLocaleLowerCase("es").includes(query)&&(!onlyActive||layer.active)&&(!favoritesOnly||layer.favorite));
        list.innerHTML='<div class="caption">Educación · '+layers.filter(layer=>layer.active).length+' capas activas</div>';
        if(!visible.length){list.insertAdjacentHTML("beforeend",'<div class="no-results">No hay capas que coincidan.</div>');return}
        ["Estatal","Privada"].forEach(management=>{
          const managementLayers=visible.filter(layer=>(layer.management||"Estatal")===management);
          if(!managementLayers.length)return;
          const managementOpen=managementExpanded.has(management);
          const group=document.createElement("section");
          group.className="layer-group layer-management"+(managementOpen?" open":"");
          const groupToggle=document.createElement("button");
          groupToggle.type="button";
          groupToggle.className="layer-group-toggle";
          groupToggle.setAttribute("aria-expanded",String(managementOpen));
          groupToggle.innerHTML='<svg class="layer-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg><span class="layer-group-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons.building+'</svg></span><span class="layer-group-name">Gestión '+management.toLocaleLowerCase("es")+'</span><span class="layer-group-count">'+managementLayers.length+'</span>';
          const managementChildren=document.createElement("div");
          managementChildren.className="layer-group-children";
          groupToggle.addEventListener("click",()=>{if(managementExpanded.has(management))managementExpanded.delete(management);else managementExpanded.add(management);group.classList.toggle("open",managementExpanded.has(management));groupToggle.setAttribute("aria-expanded",String(managementExpanded.has(management)))});
          group.append(groupToggle,managementChildren);
          layerCategories.forEach(category=>{
            const categoryLayers=managementLayers.filter(category.matches);
            if(!categoryLayers.length)return;
            const categoryKey=management+":"+category.id;
            const categoryOpen=expandedCategories.has(categoryKey);
            const subgroup=document.createElement("section");
            subgroup.className="layer-group layer-category"+(categoryOpen?" open":"");
            const subgroupToggle=document.createElement("button");
            subgroupToggle.type="button";
            subgroupToggle.className="layer-group-toggle";
            subgroupToggle.setAttribute("aria-expanded",String(categoryOpen));
            subgroupToggle.innerHTML='<svg class="layer-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg><span class="layer-group-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[category.icon]+'</svg></span><span class="layer-group-name">'+category.name+'</span><span class="layer-group-count">'+categoryLayers.length+'</span>';
            const categoryChildren=document.createElement("div");
            categoryChildren.className="layer-group-children";
            subgroupToggle.addEventListener("click",()=>{if(expandedCategories.has(categoryKey))expandedCategories.delete(categoryKey);else expandedCategories.add(categoryKey);subgroup.classList.toggle("open",expandedCategories.has(categoryKey));subgroupToggle.setAttribute("aria-expanded",String(expandedCategories.has(categoryKey)))});
            subgroup.append(subgroupToggle,categoryChildren);
            categoryLayers.forEach(layer=>{
              const row=document.createElement("div");
              row.className="layer-row";
              row.setAttribute("role","treeitem");
              row.innerHTML='<input class="layer-check" type="checkbox" aria-label="Activar '+escapeHtml(layer.name)+'" '+(layer.active?"checked":"")+'><span class="layer-symbol" style="color:'+layer.color+';background:'+layer.color+'19"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+icons[layer.icon]+'</svg></span><span class="layer-copy"><span class="layer-name">'+escapeHtml(layer.name)+'</span><span class="layer-meta">'+layer.count.toLocaleString("es-AR")+' ubicaciones</span></span><button class="layer-info" type="button" aria-label="Información de '+escapeHtml(layer.name)+'" title="Información de la capa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></button>';
              row.querySelector(".layer-check").addEventListener("change",event=>{layer.active=event.target.checked;updateMarkers();renderLayers()});
              row.querySelector(".layer-info").addEventListener("click",()=>toast(layer.name+" · "+layer.count.toLocaleString("es-AR")+" ubicaciones"));
              categoryChildren.appendChild(row);
            });
            managementChildren.appendChild(subgroup);
          });
          list.appendChild(group);
        });
      };
      const updateMarkers=()=>{let count=0;layers.forEach(layer=>{const dataset=datasets.get(layer.id);if(!dataset)return;if(layer.active){count+=layer.count;if(!map.hasLayer(dataset))dataset.addTo(map)}else if(map.hasLayer(dataset))map.removeLayer(dataset)});document.getElementById("school-count").textContent=count.toLocaleString("es-AR")+(count===1?" establecimiento visible":" establecimientos visibles")};
      const search=(query)=>{const results=document.getElementById("search-results"),normalized=normalizeSearchText(query);if(!normalized){results.classList.remove("open");results.innerHTML="";return}const terms=normalized.split(" "),matches=schools.map(school=>({school,fields:getSchoolSearchFields(school)})).filter(({fields})=>terms.every(term=>fields.text.includes(term))).sort((a,b)=>{const score=({name,shortName})=>shortName===normalized?0:shortName.startsWith(normalized)?1:name===normalized?2:name.startsWith(normalized)?3:name.includes(normalized)?4:5;return score(a.fields)-score(b.fields)}).slice(0,6).map(({school})=>school);results.innerHTML=matches.length?matches.map((school,index)=>{const layer=layers.find(item=>item.id===school.layerId),location=[school.properties.localidad,school.properties.distrito].filter(Boolean).join(" · ");return '<button class="search-result" type="button" role="option" data-result="'+index+'" title="'+escapeHtml(school.properties.nombre||"Establecimiento educativo")+'"><span class="result-mark" style="color:'+layer.color+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[layer.icon]+'</svg></span><span><strong>'+escapeHtml(getSchoolShortName(school)||school.properties.nombre||"Establecimiento educativo")+'</strong><small>'+escapeHtml(location||layer.name)+'</small></span></button>'}).join(""):'<div class="no-results">No encontramos escuelas. Probá con el nombre, localidad o distrito.</div>';results.classList.add("open");results.querySelectorAll("[data-result]").forEach(button=>button.addEventListener("click",()=>{const school=matches[Number(button.dataset.result)],layer=layers.find(item=>item.id===school.layerId),dataset=datasets.get(school.layerId),featureLayer=dataset.getLayers().find(item=>item.feature?.properties===school.properties);if(!layer.active){layer.active=true;renderLayers();updateMarkers()}if(featureLayer){const latlng=featureLayer.getLatLng();map.flyTo(latlng,16,{duration:.8});featureLayer.openPopup()}results.classList.remove("open");document.getElementById("school-search").value=getSchoolShortName(school)||school.properties.nombre||"Establecimiento educativo"}))};
      const locate=()=>{if(!navigator.geolocation){toast("La ubicación no está disponible en este navegador.");return}navigator.geolocation.getCurrentPosition(position=>{const point=[position.coords.latitude,position.coords.longitude];map.flyTo(point,15,{duration:.8});if(userLocationMarker)map.removeLayer(userLocationMarker);userLocationMarker=L.circleMarker(point,{renderer:pointsRenderer,radius:8,color:"#fff",weight:3,fillColor:"#2366b0",fillOpacity:1,interactive:false}).addTo(map)},()=>toast("No se pudo acceder a tu ubicación."),{enableHighAccuracy:true,timeout:8000})};
      renderLayers();document.getElementById("layer-filter").addEventListener("input",renderLayers);document.getElementById("active-filter").addEventListener("click",event=>{onlyActive=!onlyActive;event.currentTarget.classList.toggle("selected",onlyActive);renderLayers()});document.getElementById("favorite-filter").addEventListener("click",event=>{favoritesOnly=!favoritesOnly;event.currentTarget.classList.toggle("selected",favoritesOnly);renderLayers()});document.getElementById("school-search").addEventListener("input",event=>search(event.target.value));document.getElementById("school-search").addEventListener("keydown",event=>{if(event.key==="Escape"){document.getElementById("search-results").classList.remove("open");event.currentTarget.blur()}if(event.key==="Enter")document.querySelector(".search-result")?.click()});document.addEventListener("click",event=>{if(!event.target.closest(".top-search-wrap"))document.getElementById("search-results").classList.remove("open")});
      document.getElementById("home-map").addEventListener("click",()=>{const bounds=L.featureGroup([...datasets.values()]).getBounds();if(bounds.isValid())map.flyToBounds(bounds.pad(.06),{maxZoom:12,duration:.8});else map.flyTo(center,11,{duration:.8})});document.getElementById("locate-map").addEventListener("click",locate);document.getElementById("locate-tool").addEventListener("click",locate);      const accountModal=document.getElementById("account-modal"),accountForm=document.getElementById("account-form"),accountTitle=document.getElementById("account-title"),accountSubmit=document.querySelector(".primary-button"),accountFooter=document.querySelector(".modal-footer"),fullNameField=accountForm.querySelector('[data-field="fullName"]'),roleField=accountForm.querySelector('[data-field="role"]');const closeAccountModal=()=>{accountModal.classList.add("hidden");accountModal.setAttribute("aria-hidden","true");document.body.style.overflow=""};const syncAccountForm=(mode)=>{const isSignup=mode==="signup";accountForm.dataset.mode=mode;fullNameField.style.display=isSignup?"grid":"none";roleField.style.display=isSignup?"grid":"none";fullNameField.querySelector("input").required=isSignup;roleField.querySelector("select").required=isSignup;accountTitle.textContent=isSignup?"Crear cuenta":"Iniciar sesión";accountSubmit.textContent=isSignup?"Crear cuenta":"Ingresar";accountFooter.innerHTML=isSignup?"Ya tenés cuenta? <button type=\"button\" class=\"text-button\" data-close=\"account-modal\" data-switch=\"signin\">Ingresar</button>":"Todavía no tenés cuenta? <button type=\"button\" class=\"text-button\" data-close=\"account-modal\" data-switch=\"signup\">Crear cuenta</button>";accountFooter.querySelector(".text-button").addEventListener("click",event=>{const nextMode=event.currentTarget.dataset.switch;if(nextMode){syncAccountForm(nextMode);}});};const openAccountModal=(mode="signup")=>{syncAccountForm(mode);accountModal.classList.remove("hidden");accountModal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"};const accountAccess=document.getElementById("account-access"),profileMenu=document.getElementById("profile-menu"),profileName=document.getElementById("profile-name"),profileEmail=document.getElementById("profile-email");let signedInUser=null;const closeProfileMenu=()=>{profileMenu.classList.add("hidden");profileMenu.setAttribute("aria-hidden","true");accountAccess.setAttribute("aria-expanded","false")};accountAccess.addEventListener("click",()=>{if(!signedInUser){openAccountModal("signin");return}const open=profileMenu.classList.contains("hidden");profileMenu.classList.toggle("hidden",!open);profileMenu.setAttribute("aria-hidden",String(!open));accountAccess.setAttribute("aria-expanded",String(open))});document.addEventListener("click",event=>{if(!event.target.closest("#profile-menu")&&!event.target.closest("#account-access"))closeProfileMenu()});document.addEventListener("keydown",event=>{if(event.key==="Escape")closeProfileMenu()});document.getElementById("logout").addEventListener("click",()=>{signedInUser=null;closeProfileMenu();accountAccess.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5M15 12H3"/></svg>Acceder';accountAccess.classList.remove("icon-button","profile-button");accountAccess.classList.add("quiet");accountAccess.setAttribute("aria-label","Ingresar o crear una cuenta");accountAccess.setAttribute("title","Ingresar o crear una cuenta");accountAccess.removeAttribute("aria-expanded");toast("Sesión cerrada.")});document.querySelector(".modal-close").addEventListener("click",closeAccountModal);accountModal.addEventListener("click",event=>{if(event.target===accountModal){closeAccountModal();return}if(event.target.dataset.close==="account-modal"&&!event.target.dataset.switch){closeAccountModal();}});accountForm.addEventListener("submit",event=>{event.preventDefault();const formData=new FormData(accountForm);const mode=accountForm.dataset.mode,email=formData.get("email").toString().trim(),fullName=(formData.get("fullName")||"").toString().trim(),name=mode==="signup"?fullName:email.split("@")[0];signedInUser={name,email};profileName.textContent=name;profileEmail.textContent=email;accountAccess.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>';accountAccess.classList.remove("quiet");accountAccess.classList.add("icon-button","profile-button");accountAccess.setAttribute("aria-label","Perfil de "+name);accountAccess.setAttribute("title","Perfil de "+name);accountAccess.setAttribute("aria-expanded","false");closeProfileMenu();toast(mode==="signup"?"Cuenta creada para "+name+".":"Bienvenido/a, "+name+".");closeAccountModal();accountForm.reset()});document.getElementById("help").addEventListener("click",()=>toast("Activá capas y seleccioná un establecimiento para ver sus datos."));      const sidebar=document.getElementById("sidebar"),sidebarToggle=document.getElementById("sidebar-toggle");const setSidebarOpen=(open)=>{const mobile=window.matchMedia("(max-width: 800px)").matches;if(!mobile){sidebar.classList.remove("collapsed","open");if(sidebarToggle)sidebarToggle.setAttribute("aria-expanded","false");return}sidebar.classList.toggle("collapsed",!open);sidebar.classList.toggle("open",open);if(sidebarToggle){sidebarToggle.setAttribute("aria-expanded",String(open));sidebarToggle.setAttribute("aria-label",open?"Cerrar panel de capas":"Abrir panel de capas");}};const syncSidebarState=()=>{if(window.matchMedia("(max-width: 800px)").matches){setSidebarOpen(false);}else{sidebar.classList.remove("collapsed","open");if(sidebarToggle)sidebarToggle.setAttribute("aria-expanded","false");}};if(sidebarToggle){sidebarToggle.addEventListener("click",()=>{if(window.matchMedia("(max-width: 800px)").matches){setSidebarOpen(sidebar.classList.contains("collapsed"))}});document.addEventListener("click",event=>{if(window.matchMedia("(max-width: 800px)").matches&&!event.target.closest(".sidebar")&&!event.target.closest("#sidebar-toggle")){setSidebarOpen(false)}});}window.addEventListener("resize",syncSidebarState);syncSidebarState();loadLayers();const setTab=(tools)=>{document.getElementById("tools-tab").classList.toggle("active",tools);document.getElementById("layers-tab").classList.toggle("active",!tools);document.getElementById("tools-tab").setAttribute("aria-selected",String(tools));document.getElementById("layers-tab").setAttribute("aria-selected",String(!tools));document.getElementById("layer-content").style.display=tools?"none":"block";document.getElementById("tools-content").classList.toggle("show",tools)};            const handleTabClick=(tools)=>{const tab=document.getElementById(tools?"tools-tab":"layers-tab"),wasSelected=tab.classList.contains("active"),wasOpen=sidebar.classList.contains("open");setTab(tools);setSidebarOpen(!(wasSelected&&wasOpen))};document.getElementById("layers-tab").addEventListener("click",()=>handleTabClick(false));document.getElementById("tools-tab").addEventListener("click",()=>handleTabClick(true));
      document.getElementById("measure").addEventListener("click",()=>{measuring=true;measurePoints=[];if(measureLine)map.removeLayer(measureLine);toast("Seleccioná dos puntos en el mapa para medir.");map.getContainer().style.cursor="crosshair"});map.on("click",event=>{if(!measuring)return;measurePoints.push(event.latlng);if(measurePoints.length===2){measuring=false;map.getContainer().style.cursor="";measureLine=L.polyline(measurePoints,{color:"#236b50",weight:3,dashArray:"6 6"}).addTo(map);const distance=map.distance(measurePoints[0],measurePoints[1]);toast("Distancia: "+(distance>=1000?(distance/1000).toFixed(2)+" km":Math.round(distance)+" m"))}});document.getElementById("clear").addEventListener("click",()=>{measuring=false;measurePoints=[];map.getContainer().style.cursor="";if(measureLine){map.removeLayer(measureLine);measureLine=null}toast("Medición eliminada.")});let resizeTimer;window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>map.invalidateSize(),120)});map.whenReady(()=>setTimeout(()=>map.invalidateSize(),120));
      window.sirioniMap=map;
    })();
  