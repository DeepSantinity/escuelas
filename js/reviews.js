(()=>{
  const map=window.sirioniMap;
  if(!map){
    console.error("No se pudieron inicializar las reseñas: falta el mapa.");
    return;
  }

  const escapeHtml=(value)=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const toast=(message)=>{
    const node=document.getElementById("toast");
    node.textContent=message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove("show"),3500);
  };
  const getSchoolId=(properties)=>{
    const id=properties.cueanexo??properties.clave??properties.idserv;
    return id==null||String(id).trim()===""?null:String(id);
  };
  const formatDate=(value)=>{
    const date=new Date(value);
    return Number.isNaN(date.getTime())?"":new Intl.DateTimeFormat("es-AR",{dateStyle:"medium"}).format(date);
  };
  const renderList=(list,reviews)=>{
    list.replaceChildren();
    if(!reviews.length){
      const empty=document.createElement("p");
      empty.className="reviews-empty";
      empty.textContent="Todavía no hay reseñas. ¡Podés dejar la primera!";
      list.append(empty);
      return;
    }
    reviews.forEach(review=>{
      const item=document.createElement("article");
      item.className="review-item";
      const header=document.createElement("div");
      header.className="review-header";
      const identity=document.createElement("div");
      identity.className="review-identity";
      const avatar=document.createElement("span");
      avatar.className="review-avatar review-avatar-fallback";
      const authorName=review.author_name||"Usuario";
      avatar.textContent=authorName.trim().charAt(0).toUpperCase();
      identity.append(avatar);
      const rating=document.createElement("span");
      rating.className="review-rating";
      rating.setAttribute("aria-label",review.rating+" de 5 estrellas");
      rating.textContent="★".repeat(review.rating)+"☆".repeat(5-review.rating);
      header.append(identity,rating);
      item.append(header);
      const content=document.createElement("p");
      content.className="review-content";
      content.textContent=review.content;
      item.append(content);
      const date=formatDate(review.created_at);
      if(date){
        const time=document.createElement("time");
        time.className="review-date";
        time.dateTime=review.created_at;
        time.textContent=date;
        item.append(time);
      }
      list.append(item);
    });
  };
  const loadReviews=async(section,schoolId)=>{
    const list=section.querySelector(".reviews-list");
    const client=window.sirioniAccount?.client;
    if(!client){
      list.textContent="Las reseñas requieren configurar Supabase.";
      return;
    }
    list.textContent="Cargando reseñas...";
    const {data,error}=await client.from("school_reviews")
      .select("author_name,rating,content,created_at")
      .eq("school_id",schoolId)
      .order("created_at",{ascending:false});
    if(error){
      console.error("Error al cargar reseñas:",error);
      list.textContent="No se pudieron cargar las reseñas. Revisá que exista la tabla school_reviews.";
      return;
    }
    renderList(list,data||[]);
  };
  const renderForm=section=>{
    if(!section.isConnected)return;
    const formHost=section.querySelector(".review-form-host");
    if(!formHost)return;
    formHost.replaceChildren();
    const account=window.sirioniAccount;
    if(!account?.client){
      const note=document.createElement("p");
      note.className="reviews-login-note";
      note.textContent="Configurá Supabase para poder publicar reseñas.";
      formHost.append(note);
      return;
    }
    if(!account.user){
      const button=document.createElement("button");
      button.className="review-login";
      button.type="button";
      button.textContent="Iniciá sesión para dejar una reseña";
      button.addEventListener("click",()=>document.getElementById("account-access").click());
      formHost.append(button);
      return;
    }
    const form=document.createElement("form");
    form.className="review-form";
    const label=document.createElement("label");
    label.className="review-rating-label";
    label.textContent="Tu puntuación";
    const select=document.createElement("select");
    select.name="rating";
    select.required=true;
    select.setAttribute("aria-label","Tu puntuación");
    for(let rating=5;rating>=1;rating--){
      const option=document.createElement("option");
      option.value=String(rating);
      option.textContent=rating+" "+(rating===1?"estrella":"estrellas");
      select.append(option);
    }
    label.append(select);
    const textarea=document.createElement("textarea");
    textarea.name="content";
    textarea.required=true;
    textarea.minLength=3;
    textarea.maxLength=1000;
    textarea.placeholder="Escribí tu reseña (máximo 1000 caracteres)";
    textarea.setAttribute("aria-label","Escribí tu reseña");
    const submit=document.createElement("button");
    submit.className="review-submit";
    submit.type="submit";
    submit.textContent="Publicar reseña";
    form.append(label,textarea,submit);
    form.addEventListener("submit",async event=>{
      event.preventDefault();
      if(!navigator.onLine){
        toast("Las reseñas requieren conexión a internet.");
        return;
      }
      const currentAccount=window.sirioniAccount;
      if(!currentAccount?.user){
        renderForm(section);
        toast("Iniciá sesión para publicar una reseña.");
        return;
      }
      const review={
        school_id:section.dataset.schoolId,
        rating:Number(select.value),
        content:textarea.value.trim()
      };
      if(review.content.length<3){
        textarea.setCustomValidity("La reseña debe tener al menos 3 caracteres.");
        textarea.reportValidity();
        return;
      }
      textarea.setCustomValidity("");
      submit.disabled=true;
      try{
        const {error}=await currentAccount.client.from("school_reviews").insert(review);
        if(error)throw error;
        form.reset();
        await loadReviews(section,review.school_id);
        toast("Reseña publicada.");
      }catch(error){
        console.error("Error al publicar reseña:",error);
        toast(error.message||"No se pudo publicar la reseña.");
      }finally{
        submit.disabled=false;
      }
    });
    formHost.append(form);
  };
  const mountReviews=popup=>{
    const card=popup.getElement()?.querySelector(".school-card");
    const properties=popup._source?.feature?.properties;
    if(!card||!properties||card.querySelector(".school-reviews"))return;
    const schoolId=getSchoolId(properties);
    const section=document.createElement("section");
    section.className="school-reviews";
    section.setAttribute("aria-label","Reseñas del establecimiento");
    if(!schoolId){
      section.textContent="Este establecimiento no tiene un identificador para asociar reseñas.";
      const actions=card.querySelector(".school-card-actions");
      if(actions)card.insertBefore(section,actions);
      else card.append(section);
      return;
    }
    section.dataset.schoolId=schoolId;
    const heading=document.createElement("h4");
    heading.className="reviews-title";
    heading.textContent="Reseñas";
    const list=document.createElement("div");
    list.className="reviews-list";
    const formHost=document.createElement("div");
    formHost.className="review-form-host";
    section.append(heading,list,formHost);
    const actions=card.querySelector(".school-card-actions");
    if(actions)card.insertBefore(section,actions);
    else card.append(section);
    renderForm(section);
    loadReviews(section,schoolId).catch(error=>{
      console.error("Error inesperado al cargar reseñas:",error);
      list.textContent="Ocurrió un error al cargar las reseñas.";
    });
  };

  map.on("popupopen",event=>mountReviews(event.popup));
  window.addEventListener("sirioni:auth-change",()=>{
    document.querySelectorAll(".school-reviews").forEach(renderForm);
  });
})();
