(()=>{
  const config=window.SIRIONI_SUPABASE_CONFIG;
  const configured=config?.url&&!config.url.includes("TU-PROYECTO")&&config?.anonKey&&!config.anonKey.includes("TU_CLAVE_PUBLICA");
  const client=configured&&window.supabase?.createClient
    ?window.supabase.createClient(config.url,config.anonKey)
    :null;
  const accountForm=document.getElementById("account-form");
  const accountAccess=document.getElementById("account-access");
  const accountModal=document.getElementById("account-modal");
  const profileMenu=document.getElementById("profile-menu");
  const profileName=document.getElementById("profile-name");
  const profileEmail=document.getElementById("profile-email");
  const profileAvatar=document.getElementById("profile-avatar");
  const profileAvatarInput=document.getElementById("profile-avatar-input");
  const changeProfileAvatar=document.getElementById("change-profile-avatar");
  const phoneInput=accountForm.querySelector('[name="phone"]');
  phoneInput.addEventListener("input",()=>{
    phoneInput.value=phoneInput.value.replace(/[^0-9]/g,"");
  });
  accountModal.addEventListener("click",event=>{
    if(event.target===accountModal||event.target.classList.contains("modal-backdrop")){
      event.stopImmediatePropagation();
    }
  },true);
  const accountState={client,user:null,profile:null};
  window.sirioniAccount=accountState;
  window.sirioniUserRole=null;
  const notifyAuthChange=()=>window.dispatchEvent(new Event("sirioni:auth-change"));
  const toast=(message)=>{
    const node=document.getElementById("toast");
    node.textContent=message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove("show"),4500);
  };
  const closeModal=()=>{
    accountModal.classList.add("hidden");
    accountModal.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
  };
  const renderAvatar=(container,url,name)=>{
    container.replaceChildren();
    container.classList.toggle("profile-avatar-fallback",!url);
    if(url){
      const image=document.createElement("img");
      image.src=url;
      image.alt="";
      image.addEventListener("error",()=>{
        container.textContent=(name||"?").trim().charAt(0).toUpperCase();
        container.classList.add("profile-avatar-fallback");
      },{once:true});
      container.append(image);
      return;
    }
    container.textContent=(name||"?").trim().charAt(0).toUpperCase();
  };
  const renderSignedOut=()=>{
    accountState.user=null;
    accountState.profile=null;
    window.sirioniUserRole=null;
    accountAccess.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5M15 12H3"/></svg>Acceder';
    accountAccess.classList.remove("icon-button","profile-button");
    accountAccess.classList.add("quiet");
    accountAccess.setAttribute("aria-label","Ingresar o crear una cuenta");
    accountAccess.setAttribute("title","Ingresar o crear una cuenta");
    accountAccess.removeAttribute("aria-expanded");
    profileMenu.classList.add("hidden");
    profileMenu.setAttribute("aria-hidden","true");
    notifyAuthChange();
  };
  const renderSignedIn=(user,profile)=>{
    const name=[profile?.nombre,profile?.apellido].filter(Boolean).join(" ")||user.email;
    accountState.user=user;
    accountState.profile=profile;
    const role=String(profile?.role??"").trim().toLowerCase();
    const userType=String(profile?.tipo_usuario??"").trim().toLowerCase();
    window.sirioniUserRole=profile?.role===true||role==="true"||role==="fed"||userType==="fed"?"fed":null;
    accountAccess.classList.remove("quiet");
    accountAccess.classList.add("icon-button","profile-button");
    accountAccess.setAttribute("aria-label","Perfil de "+name);
    accountAccess.setAttribute("title","Perfil de "+name);
    accountAccess.setAttribute("aria-expanded","false");
    profileName.textContent=name;
    profileEmail.textContent=user.email||"";
    renderAvatar(profileAvatar,profile?.avatar_url,name);
    accountAccess.replaceChildren();
    if(profile?.avatar_url){
      const image=document.createElement("img");
      image.className="profile-button-image";
      image.src=profile.avatar_url;
      image.alt="";
      accountAccess.append(image);
    }else{
      accountAccess.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>';
    }
    notifyAuthChange();
  };
  const loadProfile=async(user)=>{
    const {data,error}=await client.from("profiles")
      .select("nombre,apellido,telefono,role,tipo_usuario,avatar_url")
      .eq("id",user.id)
      .maybeSingle();
    if(error)throw error;
    if(!data)throw new Error("No se encontró el perfil. Ejecutá el SQL de supabase/profiles.sql.");
    return data;
  };
  changeProfileAvatar.addEventListener("click",()=>profileAvatarInput.click());
  profileAvatarInput.addEventListener("change",async()=>{
    const file=profileAvatarInput.files?.[0];
    const user=accountState.user;
    if(!file||!user||!client)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){
      toast("Elegí una imagen JPG, PNG o WEBP.");
      profileAvatarInput.value="";
      return;
    }
    if(file.size>2*1024*1024){
      toast("La foto debe pesar 2 MB o menos.");
      profileAvatarInput.value="";
      return;
    }
    changeProfileAvatar.disabled=true;
    try{
      const path=user.id+"/avatar";
      const {error:uploadError}=await client.storage.from("avatars").upload(path,file,{
        cacheControl:"0",
        contentType:file.type,
        upsert:true
      });
      if(uploadError)throw uploadError;
      const {data}=client.storage.from("avatars").getPublicUrl(path);
      const avatarUrl=data.publicUrl;
      const {error:updateError}=await client.from("profiles")
        .update({avatar_url:avatarUrl})
        .eq("id",user.id);
      if(updateError)throw updateError;
      renderSignedIn(user,{...accountState.profile,avatar_url:avatarUrl});
      accountAccess.setAttribute("aria-expanded","true");
      toast("Foto de perfil actualizada.");
    }catch(error){
      console.error("Error al actualizar la foto de perfil:",error);
      toast(error.message||"No se pudo actualizar la foto de perfil.");
    }finally{
      changeProfileAvatar.disabled=false;
      profileAvatarInput.value="";
    }
  });
  accountForm.addEventListener("submit",async(event)=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    if(!client){
      toast(configured
        ?"No se pudo cargar Supabase. Revisá la conexión a internet y recargá la página."
        :"Configurá la URL y la clave pública de Supabase en js/supabase-config.js.");
      return;
    }
    const submit=accountForm.querySelector('[type="submit"]');
    const formData=new FormData(accountForm);
    const mode=accountForm.dataset.mode;
    const email=String(formData.get("email")||"").trim();
    const password=String(formData.get("password")||"");
    submit.disabled=true;
    try{
      if(mode==="signup"){
        const parts=String(formData.get("fullName")||"").trim().split(/\s+/);
        const nombre=parts.shift()||"";
        const apellido=parts.join(" ");
        const {data,error}=await client.auth.signUp({
          email,
          password,
          options:{data:{
            nombre,
            apellido,
            telefono:String(formData.get("phone")||"").trim()||null,
            role:String(formData.get("role")||"")
          }}
        });
        if(error)throw error;
        closeModal();
        accountForm.reset();
        if(data.session){
          const profile=await loadProfile(data.user);
          renderSignedIn(data.user,profile);
          toast("Cuenta creada y perfil guardado.");
        }else{
          toast("Cuenta creada. Revisá tu correo para confirmar el registro.");
        }
      }else{
        const {data,error}=await client.auth.signInWithPassword({email,password});
        if(error)throw error;
        const profile=await loadProfile(data.user);
        renderSignedIn(data.user,profile);
        closeModal();
        accountForm.reset();
        toast("Sesión iniciada.");
      }
    }catch(error){
      console.error("Error de cuenta Supabase:",error);
      toast(error.message||"No se pudo guardar la cuenta. Revisá la configuración de Supabase.");
    }finally{
      submit.disabled=false;
    }
  },true);
  accountAccess.addEventListener("click",event=>{
    if(!client||!client.auth||!profileEmail.textContent)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const open=profileMenu.classList.contains("hidden");
    profileMenu.classList.toggle("hidden",!open);
    profileMenu.setAttribute("aria-hidden",String(!open));
    accountAccess.setAttribute("aria-expanded",String(open));
  },true);
  document.getElementById("logout").addEventListener("click",async(event)=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    if(!client)return;
    const {error}=await client.auth.signOut();
    if(error){
      console.error("Error al cerrar sesión:",error);
      toast(error.message||"No se pudo cerrar la sesión.");
      return;
    }
    profileEmail.textContent="";
    renderSignedOut();
    toast("Sesión cerrada.");
  },true);
  if(client){
    client.auth.getSession().then(async({data,error})=>{
      if(error)throw error;
      if(data.session){
        const profile=await loadProfile(data.session.user);
        renderSignedIn(data.session.user,profile);
      }
    }).catch(error=>{
      console.error("Error al recuperar la sesión de Supabase:",error);
      toast(error.message||"No se pudo recuperar la sesión.");
    });
  }
})();
