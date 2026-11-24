(()=>{
  const tab=document.getElementById("users-tab");
  const tabs=document.getElementById("workspace-tabs");
  const content=document.getElementById("users-content");
  const list=document.getElementById("fed-accounts-list");
  const status=document.getElementById("fed-accounts-status");
  const createButton=document.getElementById("create-fed-account");
  const createForm=document.getElementById("create-fed-account-form");
  const refreshButton=document.getElementById("refresh-fed-accounts");
  const account=window.sirioniAccount;
  let loading=false;

  const toast=message=>{
    const node=document.getElementById("toast");
    node.textContent=message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove("show"),4500);
  };
  const callAdminFunction=async(action,values={})=>{
    const client=account?.client;
    if(!client)throw new Error("No hay conexión con Supabase.");

    const {data,error}=await client.functions.invoke("manage-fed-accounts",{
      body:{action,...values}
    });

    if(error){
      const response=error.context;
      if(response instanceof Response){
        let payload;
        try{
          payload=await response.clone().json();
        }catch(parseError){
          if(!(parseError instanceof SyntaxError))throw parseError;
        }
        const message=payload?.error||payload?.message;
        if(typeof message==="string"&&message.trim())throw new Error(message);
      }
      throw error;
    }
    if(data?.error)throw new Error(data.error);
    return data;
  };
  const renderAccounts=accounts=>{
    list.replaceChildren();
    if(!accounts.length){
      status.textContent="Todavía no hay cuentas F.E.D. registradas.";
      return;
    }
    const active=accounts.length;
    status.textContent=active+" "+(active===1?"cuenta F.E.D.":"cuentas F.E.D.")+" registradas";
    accounts.forEach(user=>{
      const row=document.createElement("article");
      row.className="fed-account-row";
      const identity=document.createElement("div");
      identity.className="fed-account-identity";
      const name=document.createElement("strong");
      name.textContent=[user.nombre,user.apellido].filter(Boolean).join(" ")||"Cuenta F.E.D.";
      const email=document.createElement("span");
      email.textContent=user.email||"Sin correo";
      const action=document.createElement("button");
      action.type="button";
      action.className="fed-account-delete";
      action.dataset.userId=user.id;
      action.dataset.action="delete";
      action.textContent="Eliminar";
      action.setAttribute("aria-label",action.textContent+" la cuenta de "+(user.email||name.textContent));
      identity.append(name,email);
      row.append(identity,action);
      list.append(row);
    });
  };
  const refreshAccounts=async()=>{
    if(loading||window.sirioniUserRole!=="admin")return;
    loading=true;
    refreshButton.disabled=true;
    status.textContent="Cargando cuentas...";
    try{
      const result=await callAdminFunction("list");
      if(!Array.isArray(result.accounts))throw new Error("La respuesta de cuentas no tiene el formato esperado.");
      renderAccounts(result.accounts);
    }catch(error){
      console.error("Error al cargar las cuentas F.E.D.:",error);
      status.textContent=error.message||"No se pudieron cargar las cuentas.";
    }finally{
      loading=false;
      refreshButton.disabled=false;
    }
  };
  const setAdminTab=()=>{
    document.getElementById("layers-tab").classList.remove("active");
    document.getElementById("tools-tab").classList.remove("active");
    document.getElementById("layers-tab").setAttribute("aria-selected","false");
    document.getElementById("tools-tab").setAttribute("aria-selected","false");
    document.getElementById("tools-content").classList.remove("show");
    document.getElementById("layer-content").style.display="none";
    tab.classList.add("active");
    tab.setAttribute("aria-selected","true");
    content.classList.add("active");
  };
  const hideAdminTab=()=>{
    if(!content.classList.contains("active"))return;
    content.classList.remove("active");
    tab.classList.remove("active");
    tab.setAttribute("aria-selected","false");
    document.getElementById("layers-tab").classList.add("active");
    document.getElementById("layers-tab").setAttribute("aria-selected","true");
    document.getElementById("layer-content").style.display="";
    document.getElementById("tools-content").classList.remove("show");
  };
  const syncAdminAccess=()=>{
    const isAdmin=window.sirioniUserRole==="admin";
    tabs.classList.toggle("admin-visible",isAdmin);
    if(!isAdmin)hideAdminTab();
    if(isAdmin)refreshAccounts();
  };

  tab.addEventListener("click",()=>{
    if(window.sirioniUserRole!=="admin")return;
    setAdminTab();
    refreshAccounts();
  });
  ["layers-tab","tools-tab"].forEach(id=>{
    document.getElementById(id).addEventListener("click",()=>{
      if(content.classList.contains("active"))hideAdminTab();
    });
  });
  refreshButton.addEventListener("click",refreshAccounts);
  createButton.addEventListener("click",()=>{
    createForm.hidden=!createForm.hidden;
    if(!createForm.hidden)createForm.querySelector('[name="nombre"]').focus();
  });
  document.getElementById("cancel-create-fed-account").addEventListener("click",()=>{
    createForm.reset();
    createForm.hidden=true;
  });
  createForm.addEventListener("submit",async event=>{
    event.preventDefault();
    if(window.sirioniUserRole!=="admin")return;
    const submit=createForm.querySelector('[type="submit"]');
    const values=Object.fromEntries(new FormData(createForm));
    submit.disabled=true;
    try{
      await callAdminFunction("create",{
        nombre:String(values.nombre).trim(),
        apellido:String(values.apellido).trim(),
        mail:String(values.email).trim(),
        contraseña:String(values.contraseña||"")
      });
      createForm.reset();
      createForm.hidden=true;
      toast("Cuenta F.E.D. creada.");
      await refreshAccounts();
    }catch(error){
      console.error("Error al crear la cuenta F.E.D.:",error);
      toast(error.message||"No se pudo crear la cuenta F.E.D.");
    }finally{
      submit.disabled=false;
    }
  });
  list.addEventListener("click",async event=>{
    const button=event.target.closest(".fed-account-delete");
    if(!button||window.sirioniUserRole!=="admin")return;
    const action=button.dataset.action;
    const userId=button.dataset.userId;
    if(!window.confirm("¿Eliminar permanentemente esta cuenta F.E.D.? Se eliminarán su perfil y sus reseñas asociadas. Los datos administrativos de escuelas se conservarán. Esta acción no se puede deshacer."))return;
    button.disabled=true;
    try{
      await callAdminFunction(action,{userId});
      toast("Cuenta F.E.D. eliminada.");
      await refreshAccounts();
    }catch(error){
      console.error("Error al eliminar la cuenta F.E.D.:",error);
      toast(error.message||"No se pudo eliminar la cuenta F.E.D.");
      button.disabled=false;
    }
  });
  window.addEventListener("sirioni:auth-change",syncAdminAccess);
  syncAdminAccess();
})();
