(() => {
  const cfg = window.SITE_CONFIG || {};
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const hasConfig = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const setupWarning = $("#setup-warning"), loginPanel = $("#login-panel"), managerPanel = $("#manager-panel");
  if (!hasConfig) setupWarning.hidden = false;
  let client = null, kind = "locations", records = [], editingId = null;

  const schema = {
    locations: { table:"research_locations", title:"Tambah lokasi penelitian", singular:"lokasi", fields:[
      ["name","Nama lokasi","text",true,"Contoh: Teluk Weda"],["region","Wilayah administratif","text",false,"Kabupaten/kota, provinsi"],["lat","Latitude","number",true,"Koordinat lintang desimal"],["lon","Longitude","number",true,"Koordinat bujur desimal"],["topic","Topik penelitian","text",false,"Contoh: kualitas perairan"],["description","Deskripsi","textarea",false,"Ringkasan penelitian di lokasi ini"],["year","Tahun/periode","text",false,"Contoh: 2026"],["outputs","Link luaran (JSON)","textarea",false,'Format: [{"title":"Judul artikel","url":"https://doi.org/..."}]']
    ]},
    publications: { table:"publications", title:"Tambah publikasi", singular:"publikasi", fields:[
      ["title","Judul publikasi","text",true,"Judul sesuai sumber resmi"],["authors","Penulis","text",false,"Urutan penulis sesuai publikasi"],["year","Tahun","number",false,"Tahun terbit"],["venue","Nama jurnal/prosiding","text",false,"Nama sumber"],["type","Jenis luaran","text",false,"Journal article, conference paper, preprint"],["url","URL DOI/penerbit/repositori","url",false,"Tautan yang dapat diakses"]
    ]},
    media: { table:"media_items", title:"Tambah media","singular":"media", fields:[
      ["title","Judul media","text",true,"Judul dokumentasi"],["description","Deskripsi","textarea",false,"Konteks foto/video/poster"],["category","Kategori","text",false,"Fieldwork, presentation, visualization"],["date","Tanggal/periode","text",false,"Opsional"],["image_url","URL gambar","url",false,"URL publik gambar; bisa dikosongkan"],["url","URL media/video","url",false,"Tautan media atau dokumentasi"]
    ]},
    learning: { table:"learning_resources", title:"Tambah materi pembelajaran","singular":"materi", fields:[
      ["title","Judul materi","text",true,"Judul modul atau sumber belajar"],["description","Deskripsi","textarea",false,"Ringkasan materi dan target pembelajaran"],["category","Kategori","text",false,"Remote sensing, GIS, WebGIS, UAV"],["format","Format","text",false,"PDF, PPTX, video, tutorial"],["url","URL materi","url",false,"Tautan file atau halaman materi"]
    ]}
  };
  function el(tag, attrs={}, text=""){const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text)e.textContent=text;return e;}
  function setMessage(id,msg,error=false){const node=$(id);if(node){node.textContent=msg;node.classList.toggle("error",error);}}
  function renderForm(record={}) {
    const form=$("#content-form"); form.innerHTML="";
    schema[kind].fields.forEach(([key,label,type,required,help])=>{
      const wrapper=el("label",{},label+(required?" *":""));
      let input;
      if(type==="textarea"){input=el("textarea",{name:key,id:`field-${key}`,placeholder:help});}
      else {input=el("input",{name:key,id:`field-${key}`,type,placeholder:help});}
      if(required) input.required=true;
      if(type==="number"){input.step=key==="year"?"1":"any";}
      if(key==="outputs") input.value=record[key] ? JSON.stringify(record[key],null,2) : "[]";
      else if(record[key]!==undefined && record[key]!==null) input.value=record[key];
      wrapper.appendChild(input); form.appendChild(wrapper);
    });
  }
  function recordLabel(record){return record.name || record.title || "(tanpa judul)";}
  function renderEntries(query=""){
    const target=$("#entries-list");const q=query.toLowerCase();
    const filtered=records.filter(r=>JSON.stringify(r).toLowerCase().includes(q));
    $("#entry-count").textContent=`${filtered.length} item`;
    if(!filtered.length){target.innerHTML='<p class="empty-state">Belum ada konten pada kategori ini.</p>';return;}
    target.innerHTML=filtered.map(r=>`<article class="entry-card" data-id="${r.id}"><div><strong>${escapeHtml(recordLabel(r))}</strong><small>${escapeHtml(r.region||r.venue||r.category||r.topic||"")} ${r.year?`· ${escapeHtml(r.year)}`:""}</small></div><div class="entry-actions"><button type="button" data-edit="${r.id}">Edit</button><button type="button" class="delete" data-delete="${r.id}">Hapus</button></div></article>`).join("");
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>{const r=records.find(x=>String(x.id)===b.dataset.edit);editingId=r.id;renderForm(r);$("#editor-title").textContent=`Edit ${schema[kind].singular}`;$("#save-form").textContent="Simpan perubahan";setMessage("#save-message","Mode edit aktif.");window.scrollTo({top:300,behavior:"smooth"});}));
    $$("[data-delete]").forEach(b=>b.addEventListener("click",async()=>{const r=records.find(x=>String(x.id)===b.dataset.delete);if(!confirm(`Hapus "${recordLabel(r)}"?`))return;const {error}=await client.from(schema[kind].table).delete().eq("id",r.id);if(error){setMessage("#save-message",error.message,true);return;}await loadRecords();setMessage("#save-message","Konten berhasil dihapus.");}));
  }
  function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  async function loadRecords(){
    if(!client)return;
    const {data,error}=await client.from(schema[kind].table).select("*").order("created_at",{ascending:false});
    if(error){records=[];renderEntries();setMessage("#save-message",error.message,true);return;}
    records=data||[];renderEntries($("#entry-search").value);
  }
  function switchKind(next){
    kind=next;editingId=null;
    $$(".admin-tab").forEach(b=>b.classList.toggle("active",b.dataset.kind===kind));
    $("#editor-title").textContent=schema[kind].title;$("#save-form").textContent="Simpan konten";
    setMessage("#save-message","");renderForm();loadRecords();
  }
  async function handleLogin(event){
    event.preventDefault();if(!client){setMessage("#login-message","Konfigurasi Supabase belum lengkap.",true);return;}
    setMessage("#login-message","Memeriksa akun…");
    const {error}=await client.auth.signInWithPassword({email:$("#login-email").value.trim(),password:$("#login-password").value});
    if(error){setMessage("#login-message","Login gagal. Periksa email, password, dan akun Supabase.",true);return;}
    await showManager();
  }
  async function showManager(){
    const {data}=await client.auth.getUser();
    if(!data.user)return;
    loginPanel.hidden=true;managerPanel.hidden=false;$("#signed-in-as").textContent=`Login sebagai ${data.user.email}`;
    switchKind(kind);
  }
  async function handleSave(event){
    event.preventDefault();if(!client)return;
    const formData=new FormData($("#content-form"));const payload={};
    for(const [key,value] of formData.entries()){
      if(value==="") {payload[key]=null;continue;}
      if(key==="lat"||key==="lon"||key==="year"&&kind==="publications") payload[key]=Number(value);
      else if(key==="outputs"&&kind==="locations"){try{payload[key]=JSON.parse(value||"[]");if(!Array.isArray(payload[key]))throw new Error();}catch(_){setMessage("#save-message",'Format link luaran harus JSON array, contoh [{"title":"Artikel","url":"https://doi.org/..."}].',true);return;}}
      else payload[key]=value;
    }
    setMessage("#save-message","Menyimpan…");
    let result;
    if(editingId) result=await client.from(schema[kind].table).update(payload).eq("id",editingId);
    else result=await client.from(schema[kind].table).insert(payload);
    if(result.error){setMessage("#save-message",`Gagal menyimpan: ${result.error.message}`,true);return;}
    editingId=null;renderForm();$("#editor-title").textContent=schema[kind].title;$("#save-form").textContent="Simpan konten";await loadRecords();setMessage("#save-message","Tersimpan. Website publik akan diperbarui otomatis.");
  }
  if(hasConfig){
    client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    $("#login-form").addEventListener("submit",handleLogin);
    client.auth.getSession().then(({data})=>{if(data.session)showManager();});
    client.auth.onAuthStateChange((_event,session)=>{if(!session){managerPanel.hidden=true;loginPanel.hidden=false;}});
  } else {
    $("#login-form").addEventListener("submit",e=>{e.preventDefault();setMessage("#login-message","Isi konfigurasi Supabase terlebih dahulu.",true);});
  }
  $("#content-form").addEventListener("submit",handleSave);
  $("#reset-form").addEventListener("click",()=>{editingId=null;renderForm();$("#editor-title").textContent=schema[kind].title;$("#save-form").textContent="Simpan konten";setMessage("#save-message","Form dikosongkan.");});
  $("#logout-button").addEventListener("click",async()=>{if(client)await client.auth.signOut();});
  $$(".admin-tab").forEach(b=>b.addEventListener("click",()=>switchKind(b.dataset.kind)));
  $("#entry-search").addEventListener("input",()=>renderEntries($("#entry-search").value));
  renderForm();
})();