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

  // Lightweight bilingual interface. User selection is remembered on this browser.
  const translations = {
    id: {
      "a[href='#about']":"Profil", "a[href='#research']":"Riset", "a[href='#locations']":"Lokasi Riset", "a[href='#publications']":"Publikasi", "a[href='#media']":"Media", "a[href='#learning']":"Pembelajaran", "a[href='#contact']":"Kontak <span>↗</span>",
      ".eyebrow":"DOSEN · PENELITI · PRAKTISI GEOSPASIAL",
      "h1":"Memahami bumi melalui <em>data geospasial.</em>",
      ".hero-lead":"Saya Agus Aris, akademisi di bidang Penginderaan Jauh dan Sistem Informasi Geografis. Saya mengeksplorasi pemanfaatan citra satelit, GIS, dan kecerdasan buatan untuk memahami perubahan lingkungan, ekosistem pesisir, dan budidaya rumput laut.",
      ".hero-actions .button":"Jelajahi bidang riset <span>↘</span>",
      ".hero-actions > .text-link:first-of-type":"Diskusi kolaborasi <span>↗</span>",
      ".hero-login-link":"Login untuk memperbarui website <span>↗</span>",
      ".section-about .eyebrow-green":"TENTANG SAYA", ".section-about h2":"Riset yang berangkat dari <em>pertanyaan nyata.</em>",
      ".lead-copy":"Fokus saya adalah mengubah data observasi bumi menjadi informasi spasial yang dapat dipahami, diuji, dan digunakan.",
      ".section-research .section-heading h2":"Empat arah <em>eksplorasi.</em>",
      ".section-research .section-summary":"Tema yang menghubungkan metode geospasial dengan kebutuhan pemantauan lingkungan dan pengambilan keputusan.",
      ".section-locations .section-heading h2":"Riset pada <em>peta.</em>",
      ".section-locations .section-summary":"Peta sebaran lokasi penelitian. Setiap titik dapat memuat nama lokasi, ringkasan studi, dan tautan luaran terkait.",
      "#visitor-stats [data-i18n='visitorEyebrow']":"ANALITIK WEBSITE", "#visitor-stats [data-i18n='visitorTitle']":"Jejak kunjungan <em>global.</em>", "#visitor-stats [data-i18n='visitorDesc']":"Ringkasan kunjungan halaman dan negara asal pengunjung berdasarkan data yang tercatat.", "#visitor-stats [data-i18n='totalVisits']":"Total kunjungan", "#visitor-stats [data-i18n='totalVisitsNote']":"Akumulasi kunjungan yang tercatat", "#visitor-stats [data-i18n='countriesReached']":"Negara terjangkau", "#visitor-stats [data-i18n='countriesNote']":"Negara/wilayah terdeteksi", "#visitor-stats [data-i18n='topCountries']":"Negara asal pengunjung", "#visitor-stats [data-i18n='countryEstimate']":"Estimasi berdasarkan IP", "#visitor-stats [data-i18n='statsLoading']":"Statistik akan muncul setelah database statistik disiapkan.", "#visitor-stats [data-i18n='visitorDisclaimer']":"Statistik bersifat agregat. Negara diperkirakan dari alamat IP dan dapat tidak akurat. Pemblokir iklan, pengaturan privasi, atau gangguan layanan dapat memengaruhi pencatatan."
    },
    en: {
      "a[href='#about']":"About", "a[href='#research']":"Research", "a[href='#locations']":"Research Sites", "a[href='#publications']":"Publications", "a[href='#media']":"Media", "a[href='#learning']":"Learning", "a[href='#contact']":"Contact <span>↗</span>",
      ".eyebrow":"LECTURER · RESEARCHER · GEOSPATIAL PRACTITIONER",
      "h1":"Understanding Earth through <em>geospatial data.</em>",
      ".hero-lead":"I am Agus Aris, an academic in Remote Sensing and Geographic Information Systems. I explore satellite imagery, GIS, and artificial intelligence to understand environmental change, coastal ecosystems, and seaweed aquaculture.",
      ".hero-actions .button":"Explore research <span>↘</span>",
      ".hero-actions > .text-link:first-of-type":"Discuss collaboration <span>↗</span>",
      ".hero-login-link":"Admin login to update this website <span>↗</span>",
      ".section-about .eyebrow-green":"ABOUT ME", ".section-about h2":"Research driven by <em>real questions.</em>",
      ".lead-copy":"My focus is to turn Earth observation data into spatial information that can be understood, tested, and used.",
      ".section-research .section-heading h2":"Four directions of <em>exploration.</em>",
      ".section-research .section-summary":"Themes connecting geospatial methods with environmental monitoring and decision-making needs.",
      ".section-locations .section-heading h2":"Research on the <em>map.</em>",
      ".section-locations .section-summary":"A map of research locations. Each point can include a location name, study summary, and links to related outputs.",
      "#visitor-stats [data-i18n='visitorEyebrow']":"WEBSITE ANALYTICS", "#visitor-stats [data-i18n='visitorTitle']":"A global <em>visitor footprint.</em>", "#visitor-stats [data-i18n='visitorDesc']":"A summary of recorded page visits and the countries visitors come from.", "#visitor-stats [data-i18n='totalVisits']":"Total visits", "#visitor-stats [data-i18n='totalVisitsNote']":"Cumulative recorded visits", "#visitor-stats [data-i18n='countriesReached']":"Countries reached", "#visitor-stats [data-i18n='countriesNote']":"Countries/regions detected", "#visitor-stats [data-i18n='topCountries']":"Visitor countries", "#visitor-stats [data-i18n='countryEstimate']":"Estimated from IP address", "#visitor-stats [data-i18n='statsLoading']":"Statistics will appear after the statistics database is configured.", "#visitor-stats [data-i18n='visitorDisclaimer']":"Statistics are aggregated. Country is estimated from IP address and may be inaccurate. Ad blockers, privacy settings, or service interruptions may affect recording."
    }
  };
  Object.assign(translations.id, {
    ".section-publications .eyebrow-green":"LUARAN ILMIAH", ".section-publications h2":"Publikasi dengan <em>jejak yang jelas.</em>", ".section-publications .section-summary":"Bagian ini akan menampilkan artikel jurnal, prosiding, manuskrip, dataset, atau kode yang memiliki informasi bibliografi dan tautan sumber yang dapat diperiksa.",
    ".section-media .section-heading h2":"Catatan dari <em>lapangan dan layar.</em>", ".section-media .section-summary":"Dokumentasi survei, visualisasi data, presentasi, dan cerita di balik proses penelitian.",
    ".section-learning .section-heading h2":"Berbagi metode, <em>membangun kapasitas.</em>", ".section-learning .section-summary":"Modul, panduan praktik, materi kuliah, dan sumber belajar untuk penginderaan jauh serta sistem informasi geografis.",
    ".section-contact .eyebrow-green":"KOLABORASI & PERTUKARAN ILMIAH", ".section-contact h2":"Ada pertanyaan spasial yang menarik untuk <em>ditelusuri?</em>", ".contact-copy":"Saya terbuka untuk pertukaran akademik dan potensi kolaborasi dalam penginderaan jauh, GIS, pemantauan pesisir, serta aplikasi geospasial.", "#contact-email":"Hubungi melalui email <span>↗</span>",
    ".skip-link":"Lewati ke konten", ".search-label":"Cari lokasi", "#location-search":"Nama lokasi atau topik…", ".map-help":"Pilih titik di peta atau nama lokasi pada daftar untuk melihat detail dan tautan luaran.", ".footer-main p":"Observasi · Analisis · Pemahaman spasial", ".back-top":"KEMBALI KE ATAS ↑"
  });
  Object.assign(translations.en, {
    ".section-publications .eyebrow-green":"RESEARCH OUTPUTS", ".section-publications h2":"Publications with a <em>traceable record.</em>", ".section-publications .section-summary":"This section features journal articles, proceedings, manuscripts, datasets, or code with verifiable bibliographic details and source links.",
    ".section-media .section-heading h2":"Notes from the <em>field and screen.</em>", ".section-media .section-summary":"Survey documentation, data visualizations, presentations, and stories behind the research process.",
    ".section-learning .section-heading h2":"Sharing methods, <em>building capacity.</em>", ".section-learning .section-summary":"Modules, practical guides, course materials, and learning resources for remote sensing and geographic information systems.",
    ".section-contact .eyebrow-green":"COLLABORATION & SCHOLARLY EXCHANGE", ".section-contact h2":"Have an interesting spatial question to <em>explore?</em>", ".contact-copy":"I welcome academic exchange and potential collaboration in remote sensing, GIS, coastal monitoring, and geospatial applications.", "#contact-email":"Contact by email <span>↗</span>",
    ".skip-link":"Skip to content", ".search-label":"Search locations", "#location-search":"Location name or topic…", ".map-help":"Select a map point or a location name in the list to view details and related outputs.", ".footer-main p":"Observation · Analysis · Spatial understanding", ".back-top":"BACK TO TOP ↑"
  });

  const languageButtons = $$("[data-lang]");
  const originalTexts = new Map();
  function setLanguage(lang) {
    const chosen = translations[lang] ? lang : "id";
    document.documentElement.lang = chosen;
    Object.entries(translations[chosen]).forEach(([selector, html]) => {
      const element = $(selector);
      if (!element) return;
      if (selector === "#location-search") { element.placeholder = html; return; }
      if (!originalTexts.has(selector)) originalTexts.set(selector, element.innerHTML);
      element.innerHTML = html;
    });
    languageButtons.forEach(button => {
      const active = button.dataset.lang === chosen;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    try { localStorage.setItem("agusArisLanguage", chosen); } catch (_) {}
  }
  languageButtons.forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
  let savedLanguage = "id";
  try { savedLanguage = localStorage.getItem("agusArisLanguage") || "id"; } catch (_) {}
  setLanguage(savedLanguage);

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

  // Public aggregated visitor counter. Requires the SQL setup in supabase_schema.sql.
  async function updateVisitorStats() {
    const totalEl = $("#visitor-total");
    const countriesEl = $("#visitor-country-count");
    const listEl = $("#visitor-countries");
    if (!hasSupabaseConfig() || !supabaseClient) {
      if (listEl) listEl.innerHTML = '<p class="empty-state">Statistik belum aktif. Jalankan SQL statistik pada panduan setup Supabase.</p>';
      return;
    }
    try {
      // Record one visit per browser tab session. Country is inferred from a public IP geolocation service.
      let recorded = false;
      try { recorded = sessionStorage.getItem("agusArisVisitRecorded") === "1"; } catch (_) {}
      if (!recorded) {
        let country = "Unknown";
        try {
          const response = await fetch("https://ipwho.is/", { cache: "no-store" });
          const geo = await response.json();
          if (geo && geo.success && geo.country) country = String(geo.country).slice(0, 80);
        } catch (_) {}
        const { error: recordError } = await supabaseClient.rpc("record_portfolio_visit", { p_country: country });
        if (recordError) throw recordError;
        try { sessionStorage.setItem("agusArisVisitRecorded", "1"); } catch (_) {}
      }
      const { data, error } = await supabaseClient.from("portfolio_visitor_stats").select("country, visits").order("visits", { ascending: false });
      if (error) throw error;
      const rows = data || [];
      const total = rows.reduce((sum, row) => sum + Number(row.visits || 0), 0);
      if (totalEl) totalEl.textContent = total.toLocaleString(document.documentElement.lang === "en" ? "en-US" : "id-ID");
      if (countriesEl) countriesEl.textContent = String(rows.filter(row => row.country !== "Unknown").length);
      if (listEl) {
        const top = rows.filter(row => row.country && row.country !== "Unknown").slice(0, 9);
        listEl.innerHTML = top.length ? top.map(row => `<div class="visitor-country"><span>${safe(row.country)}</span><strong>${Number(row.visits || 0).toLocaleString()}</strong></div>`).join("") : '<p class="empty-state">Belum ada data negara yang tercatat.</p>';
      }
    } catch (error) {
      console.warn("Visitor statistics are not configured yet:", error);
      if (listEl) listEl.innerHTML = '<p class="empty-state">Statistik belum tersedia. Pastikan SQL statistik sudah dijalankan di Supabase.</p>';
    }
  }

  initMap();
  loadData();
  if (hasSupabaseConfig()) {
    if (!supabaseClient) supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    updateVisitorStats();
  }

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
