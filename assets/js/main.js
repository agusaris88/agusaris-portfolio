(() => {
  const config = window.SITE_CONFIG || {};
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const toggle = $(".menu-toggle");
  const nav = $(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup navigasi" : "Buka navigasi");
    });
    $$("a", nav).forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  if (config.contactEmail && config.contactEmail.includes("@")) {
    const contact = $("#contact-email");
    if (contact) contact.href = `mailto:${config.contactEmail}?subject=${encodeURIComponent("Kolaborasi riset geospasial")}`;
  }

  const demoData = {
    locations: [
      { id: "demo-weda", name: "Teluk Weda", region: "Halmahera Tengah, Maluku Utara", lat: 0.42, lon: 127.90, topic: "Pemantauan lingkungan pesisir dan kualitas perairan", description: "Wilayah kajian untuk analisis kondisi pesisir, indikator kualitas air, sedimentasi, dan arus. Titik ini merupakan penanda regional perkiraan; perbarui dengan koordinat stasiun yang telah diverifikasi.", year: "2026", status: "Research area", outputs: [] },
      { id: "demo-punaga", name: "Punaga", region: "Takalar, Sulawesi Selatan", lat: -5.56, lon: 119.45, topic: "Pemetaan budidaya rumput laut", description: "Wilayah kajian untuk pemetaan kawasan budidaya dan analisis spasial pesisir. Koordinat bersifat perkiraan regional.", year: "2026", status: "Research area", outputs: [] },
      { id: "demo-polman", name: "Polewali Mandar", region: "Sulawesi Barat", lat: -3.43, lon: 119.34, topic: "Pemetaan kawasan budidaya rumput laut", description: "Wilayah kajian untuk pemetaan distribusi budidaya dan pengembangan informasi spasial. Koordinat bersifat perkiraan regional.", year: "2026", status: "Research area", outputs: [] },
      { id: "demo-tadui", name: "Tadui", region: "Mamuju, Sulawesi Barat", lat: -2.68, lon: 118.89, topic: "Observasi geospasial budidaya rumput laut", description: "Wilayah kajian untuk observasi dan analisis kawasan budidaya. Koordinat bersifat perkiraan regional.", year: "2026", status: "Research area", outputs: [] }
    ],
    publications: [],
    media: [],
    learning: []
  };

  let map;
  let markerLayer;
  let allLocations = [];
  let selectedId = null;
  let supabaseClient = null;
  let refreshTimer = null;

  const safe = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const hasSupabaseConfig = () => Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase);

  function renderEmpty(container, message) {
    if (container) container.innerHTML = `<p class="empty-state">${safe(message)}</p>`;
  }

  function initMap() {
    const element = $("#research-map");
    if (!element || !window.L) return;
    map = L.map(element, { scrollWheelZoom: false }).setView([-2.4, 121.7], 5);
    // Satellite imagery basemap (Esri World Imagery). Attribution is retained on the map.
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri — Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
    }).addTo(map);
    markerLayer = L.featureGroup().addTo(map);
    window.addEventListener("resize", () => map.invalidateSize());
  }

  function outputLinks(outputs) {
    if (!Array.isArray(outputs) || !outputs.length) return "";
    return `<div class="popup-outputs"><strong>Luaran terkait</strong>${outputs.map(o =>
      `<a href="${safe(o.url)}" target="_blank" rel="noopener noreferrer">${safe(o.title || "Buka luaran")} ↗</a>`
    ).join("")}</div>`;
  }

  function selectLocation(id, pan = true) {
    const place = allLocations.find(item => String(item.id) === String(id));
    if (!place) return;
    selectedId = place.id;
    $$(".location-row").forEach(row => row.classList.toggle("is-selected", row.dataset.id === String(id)));
    if (map && pan && Number.isFinite(Number(place.lat)) && Number.isFinite(Number(place.lon))) {
      map.flyTo([Number(place.lat), Number(place.lon)], Math.max(map.getZoom(), 8), { duration: .6 });
      const marker = markerLayer.getLayers().find(layer => String(layer.options.recordId) === String(id));
      if (marker) marker.openPopup();
    }
  }

  function renderLocations(query = "") {
    const list = $("#location-list");
    const count = $("#location-count");
    const sideCount = $("#sidebar-count");
    const q = query.trim().toLocaleLowerCase("id");
    const filtered = allLocations.filter(item => [item.name, item.region, item.topic, item.description, item.year]
      .some(value => String(value || "").toLocaleLowerCase("id").includes(q)));
    if (count) count.textContent = `${allLocations.length} lokasi`;
    if (sideCount) sideCount.textContent = String(filtered.length).padStart(2, "0");
    if (!list) return;
    if (!filtered.length) {
      renderEmpty(list, "Tidak ada lokasi yang cocok dengan pencarian.");
      return;
    }
    list.innerHTML = filtered.map(item => `
      <button class="location-row ${String(item.id) === String(selectedId) ? "is-selected" : ""}" type="button" data-id="${safe(item.id)}">
        <span class="location-row-dot"></span><span class="location-row-copy"><strong>${safe(item.name)}</strong><small>${safe(item.region || "Wilayah belum ditentukan")}</small><em>${safe(item.topic || "Topik penelitian")}</em></span><span class="row-arrow">↗</span>
      </button>`).join("");
    $$(".location-row", list).forEach(row => row.addEventListener("click", () => selectLocation(row.dataset.id)));
  }

  function renderMapMarkers() {
    if (!map || !markerLayer) return;
    markerLayer.clearLayers();
    allLocations.forEach(item => {
      const lat = Number(item.lat), lon = Number(item.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return;
      const marker = L.circleMarker([lat, lon], {
        recordId: String(item.id), radius: 7, color: "#ffffff", weight: 2,
        fillColor: "#477d6b", fillOpacity: 1
      }).addTo(markerLayer);
      marker.options.recordId = String(item.id);
      const links = outputLinks(item.outputs);
      marker.bindPopup(`<div class="research-popup"><span class="popup-kicker">${safe(item.year || "RESEARCH LOCATION")}</span><h3>${safe(item.name)}</h3><p class="popup-region">${safe(item.region || "")}</p><p>${safe(item.description || item.topic || "")}</p>${links}<a class="popup-detail-link" href="#contact">Kontak untuk informasi ↗</a></div>`);
      marker.on("click", () => {
        selectedId = item.id;
        $$(".location-row").forEach(row => row.classList.toggle("is-selected", row.dataset.id === String(item.id)));
      });
    });
    if (markerLayer.getLayers().length > 1) {
      try { map.fitBounds(markerLayer.getBounds().pad(.18), { maxZoom: 7 }); } catch (_) {}
    } else if (markerLayer.getLayers().length === 1) {
      map.setView(markerLayer.getLayers()[0].getLatLng(), 8);
    }
  }

  function renderPublications(items) {
    const target = $("#publication-list");
    if (!items?.length) return renderEmpty(target, "Belum ada publikasi yang ditambahkan. Tambahkan judul, penulis, tahun, nama jurnal, dan tautan DOI atau laman penerbit melalui database.");
    target.innerHTML = items.map((p, i) => `<article class="publication-row"><span class="publication-number">${String(i + 1).padStart(2, "0")}</span><div><span class="pub-year">${safe(p.year || "Tahun belum diisi")} · ${safe(p.type || "Publication")}</span><h3>${safe(p.title)}</h3><p>${safe(p.authors || "")}${p.venue ? ` · <em>${safe(p.venue)}</em>` : ""}</p></div>${p.url ? `<a class="pub-open" href="${safe(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Buka publikasi">↗</a>` : ""}</article>`).join("");
  }

  function renderMedia(items) {
    const target = $("#media-grid");
    if (!items?.length) return renderEmpty(target, "Belum ada media. Tambahkan foto survei, video, poster, presentasi, atau tautan dokumentasi.");
    target.innerHTML = items.map(item => `<article class="media-card">${item.image_url ? `<a class="media-image" href="${safe(item.url || item.image_url)}" target="_blank" rel="noopener noreferrer"><img src="${safe(item.image_url)}" alt="${safe(item.title)}" loading="lazy"></a>` : `<div class="media-placeholder"><span>${safe(item.category || "FIELD NOTE")}</span><b>↗</b></div>`}<div class="media-card-body"><span class="content-kicker">${safe(item.category || "MEDIA")}${item.date ? ` · ${safe(item.date)}` : ""}</span><h3>${safe(item.title)}</h3><p>${safe(item.description || "")}</p>${item.url ? `<a class="text-link" href="${safe(item.url)}" target="_blank" rel="noopener noreferrer">Lihat media <span>↗</span></a>` : ""}</div></article>`).join("");
  }

  function renderLearning(items) {
    const target = $("#learning-grid");
    if (!items?.length) return renderEmpty(target, "Belum ada materi. Tambahkan modul, panduan praktikum, video tutorial, dataset latihan, atau materi kuliah.");
    target.innerHTML = items.map((item, i) => `<article class="learning-card"><span class="learning-number">${String(i + 1).padStart(2, "0")}</span><span class="content-kicker">${safe(item.category || "MATERI PEMBELAJARAN")}</span><h3>${safe(item.title)}</h3><p>${safe(item.description || "")}</p><div class="learning-footer"><span>${safe(item.format || "Resource")}</span>${item.url ? `<a href="${safe(item.url)}" target="_blank" rel="noopener noreferrer">Buka materi ↗</a>` : `<span>Segera tersedia</span>`}</div></article>`).join("");
  }

  async function loadData() {
    let data = demoData;
    let connected = false;
    if (hasSupabaseConfig()) {
      try {
        if (!supabaseClient) supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
        const [locations, publications, media, learning] = await Promise.all([
          supabaseClient.from("research_locations").select("*").order("created_at", { ascending: false }),
          supabaseClient.from("publications").select("*").order("year", { ascending: false }),
          supabaseClient.from("media_items").select("*").order("created_at", { ascending: false }),
          supabaseClient.from("learning_resources").select("*").order("created_at", { ascending: false })
        ]);
        const errors = [locations, publications, media, learning].filter(result => result.error);
        if (errors.length) throw errors[0].error;
        data = {
          locations: locations.data || [],
          publications: publications.data || [],
          media: media.data || [],
          learning: learning.data || []
        };
        connected = true;
      } catch (error) {
        console.error("Could not load live portfolio data:", error);
      }
    }
    allLocations = data.locations || [];
    renderMapMarkers();
    renderLocations($("#location-search")?.value || "");
    renderPublications(data.publications || []);
    renderMedia(data.media || []);
    renderLearning(data.learning || []);
    const status = $("#map-data-status");
    if (status) status.textContent = connected ? "Data database · sinkronisasi aktif" : "Mode demo · database belum dihubungkan";
  }

  const search = $("#location-search");
  if (search) search.addEventListener("input", () => renderLocations(search.value));

  initMap();
  loadData();

  if (hasSupabaseConfig()) {
    const interval = Number(config.refreshIntervalMs) || 60000;
    refreshTimer = window.setInterval(loadData, interval);
    // Realtime subscription is enabled once Supabase is configured and tables are added to Realtime.
    try {
      const client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
      ["research_locations", "publications", "media_items", "learning_resources"].forEach(table => {
        client.channel(`public-${table}`)
          .on("postgres_changes", { event: "*", schema: "public", table }, () => loadData())
          .subscribe();
      });
    } catch (error) {
      console.warn("Realtime subscriptions unavailable; periodic refresh remains enabled.", error);
    }
  }
})();