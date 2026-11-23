/* Waterloo Hydrogeologic product pages, rebuilt from waterloohydrogeologic.com/products/<id>/ (fetched 11 Nov 2026).
   Loaded only by software-details.html, before script.js. script.js calls WaterlooPages(L) and renders the result.
   Text is bilingual: t(en, id). Images live in assets/images/software/waterloo/ (IMG() lowercases and kebab-cases the name). Info links (readme, tech sheets,
   supported engines) still point to Waterloo; sales buttons (buy, trial, support) are built by script.js and go to Lenusa. */
window.WaterlooPages = (t) => {
  const WH = "https://www.waterloohydrogeologic.com";
  const IMG = (n) => `assets/images/software/waterloo/${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.webp`;
  const ul = (...items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  const p = (...x) => x.map((s) => `<p>${s}</p>`).join("");
  const h4 = (s) => `<h4>${s}</h4>`;
  const h3 = (s) => `<h3>${s}</h3>`;
  const a = (href, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  const img = (n, alt = "") => `<img src="${IMG(n)}" alt="${alt}" loading="lazy">`;
  const sheet = (file) => [`${WH}/wp-content/uploads/2026/05/${file}`, t("Download the Technical Data Sheet", "Unduh Technical Data Sheet")];

  /* shared release notes (AquaChem 15.0 and HGA 14.0 list the same items) */
  const robust = t(
    "<strong>Robust processing:</strong> Bulk import smartly rejects incompatible and incorrectly formatted data, speeding up data management workflows and simplifying QA/QC",
    "<strong>Pemrosesan yang andal:</strong> Impor massal otomatis menolak data yang tidak kompatibel atau formatnya salah, sehingga workflow manajemen data lebih cepat dan QA/QC lebih sederhana"
  );
  const usability3 = [
    t("Data associated with stations can now be compared and moved/copied between stations using the new Compare tool", "Data yang terkait dengan stasiun kini dapat dibandingkan dan dipindah/disalin antarstasiun dengan alat Compare yang baru"),
    t("Lists in the List Editor module can now be filtered (like other tables can)", "Daftar di modul List Editor kini dapat difilter (seperti tabel lainnya)"),
    t("Improved interface for assigning values to DateTime data in tables", "Antarmuka yang lebih baik untuk mengisi nilai data DateTime di tabel"),
  ];

  /* HGA vs HGA+ module table. marks: HGA 32-bit, HGA 64-bit, HGA+ 32-bit, HGA+ 64-bit */
  const hgaTable = (groups) => {
    const dot = `<span class="wh-dot" role="img" aria-label="${t("Included", "Tersedia")}"></span>`;
    const head = `<thead>
      <tr><th rowspan="2" scope="col">${t("Module/Feature", "Modul/Fitur")}</th><th rowspan="2"><span class="ar-sr">${t("Icon", "Ikon")}</span></th><th colspan="2" scope="colgroup">HGA (Standard)</th><th colspan="2" scope="colgroup">HGA+</th></tr>
      <tr><th scope="col">32-Bit</th><th scope="col">64-Bit</th><th scope="col">32-Bit</th><th scope="col">64-Bit</th></tr>
    </thead>`;
    const rows = groups.map(([g, list, marks]) =>
      `<tr class="wh-table__group"><th colspan="6" scope="rowgroup">${g}</th></tr>` +
      list.map(([name, icon]) =>
        `<tr><th scope="row">${name}</th><td>${img(icon)}</td>${[...marks].map((m) => `<td>${m === "1" ? dot : ""}</td>`).join("")}</tr>`
      ).join("")
    ).join("");
    return `<div class="wh-table-wrap"><table class="wh-table wh-table--hga">${head}<tbody>${rows}</tbody></table></div>`;
  };

  /* AquiferTest vs AquiferTest Pro table. pro-only rows have std = 0 */
  const aqtTable = (rows) => {
    const tick = `<span class="wh-tick" role="img" aria-label="${t("Included", "Tersedia")}"></span>`;
    return `<h4>${t("AquiferTest Feature Comparison", "Perbandingan Fitur AquiferTest")}</h4>
      <div class="wh-table-wrap"><table class="wh-table">
        <thead><tr><th scope="col"><span class="ar-sr">${t("Feature", "Fitur")}</span></th><th scope="col">Standard</th><th scope="col">Pro</th></tr></thead>
        <tbody>${rows.map(([name, std]) => `<tr><th scope="row">${name}</th><td>${std ? tick : ""}</td><td>${tick}</td></tr>`).join("")}</tbody>
      </table></div>`;
  };

  return {
    /* ===================================================================== Visual MODFLOW Flex */
    "visual-modflow-flex": {
      hero: IMG("water-particles"),
      blocks: [
        { t: "intro", h: t("Groundwater Flow &amp; Contaminant Transport Modeling Software", "Software Pemodelan Aliran Airtanah dan Transport Kontaminan"),
          body: p(t("Visual MODFLOW Flex brings together industry-standard codes for groundwater flow and contaminant transport, essential analysis and calibration tools, and stunning 3D visualization capabilities in a single environment.",
                    "Visual MODFLOW Flex menyatukan kode standar industri untuk aliran airtanah dan transport kontaminan, alat analisis dan kalibrasi yang penting, serta visualisasi 3D yang memukau dalam satu lingkungan kerja.")) },
        { t: "new", icon: IMG("VisualModflow-icon"), h: t("What’s New in Visual MODFLOW Flex 12.0", "Yang Baru di Visual MODFLOW Flex 12.0"),
          body: p(t("Experience the new version release of Visual MODFLOW Flex 12.0", "Coba rilis versi terbaru Visual MODFLOW Flex 12.0"),
                  t(`For a complete version history, see the Visual MODFLOW Flex ${a(`${WH}/visual-modflow-flex-readme/`, "readme file")}.`, `Riwayat versi lengkap ada di ${a(`${WH}/visual-modflow-flex-readme/`, "file readme")} Visual MODFLOW Flex.`)),
          items: [
            ["MT3D-USGS",
              p(t("The MT3D-USGS solute transport engine is an upgrade of MT3DMS, expanding its capabilities while retaining its familiar input format.", "Engine transport zat terlarut MT3D-USGS adalah pengembangan dari MT3DMS: kemampuannya bertambah, sementara format input-nya tetap sama.")) +
              ul(
                t("<strong>Parent/daughter reactions:</strong> Simulate arbitrary reactions where decaying parent species produce other species", "<strong>Reaksi parent/daughter:</strong> Simulasikan reaksi apa pun saat spesies induk yang meluruh menghasilkan spesies lain"),
                t("<strong>Redox reactions:</strong> Full support of MT3D’s redox (electron donor/electron acceptor) reaction models, allowing for the simulation of instantaneous reactions involving two species or kinetic reactions involving an arbitrary number of electron donors and electron acceptors", "<strong>Reaksi redoks:</strong> Dukungan penuh untuk model reaksi redoks MT3D (electron donor/electron acceptor), sehingga dapat mensimulasikan reaksi instan yang melibatkan dua spesies atau reaksi kinetik dengan jumlah electron donor dan electron acceptor berapa pun"),
                t("<strong>MODFLOW-6 integration:</strong> MT3D can be run with MODFLOW-6 flow simulations on structured grids, allowing users to combine MT3DMS-like transport modeling with MODFLOW-6’s robust flow engine", "<strong>Integrasi MODFLOW-6:</strong> MT3D dapat dijalankan bersama simulasi aliran MODFLOW-6 pada structured grid, sehingga pemodelan transport ala MT3DMS bisa digabung dengan engine aliran MODFLOW-6 yang andal"),
                t("<strong>Extended dual-domain simulations:</strong> Expanded retardation model allowing for the simulation of dual-domain mass transfer with different linear sorption parameters in the mobile and immobile domain", "<strong>Simulasi dual-domain yang diperluas:</strong> Model retardasi yang diperluas memungkinkan simulasi transfer massa dual-domain dengan parameter sorpsi linear yang berbeda pada domain mobile dan immobile")
              )],
            ["MODFLOW-USG Transport",
              p(t("The MODFLOW-USG Transport engine is now supported, giving users access to its unique capabilities:", "Engine MODFLOW-USG Transport kini didukung, sehingga Anda dapat memakai kemampuan khasnya:")) +
              ul(
                t("<strong>Transport modeling with MODFLOW-USG:</strong> For the first time in Flex, users can perform transport modeling using the MODFLOW-USG flow engine", "<strong>Pemodelan transport dengan MODFLOW-USG:</strong> Untuk pertama kalinya di Flex, pemodelan transport dapat dilakukan dengan engine aliran MODFLOW-USG"),
                t("<strong>Time-variant material properties:</strong> Change hydraulic conductivity and storage parameters with time, with cell-by-cell precision", "<strong>Properti material yang berubah terhadap waktu:</strong> Ubah konduktivitas hidraulik dan parameter storage seiring waktu, dengan presisi per sel"),
                t("<strong>Chain decay reactions:</strong> Specify arbitrary parent/daughter reactions, allowing for the simulation of scenarios such as the degradation of chlorinated solvents", "<strong>Reaksi peluruhan berantai:</strong> Tentukan reaksi parent/daughter apa pun untuk mensimulasikan skenario seperti degradasi pelarut terklorinasi")
              )],
            [t("Engine updates and upgrades", "Pembaruan dan peningkatan engine"),
              h4("MODFLOW-6 Particle Tracking Model (PRT)") +
              p(t("Visual MODFLOW Flex now supports the PRT particle tracking model for MODFLOW-6:", "Visual MODFLOW Flex kini mendukung model particle tracking PRT untuk MODFLOW-6:")) +
              ul(
                t("<strong>Full capabilities:</strong> The familiar Flex workflows can be used to create MODFLOW-6 forwards and backwards particle tracking models that are as capable as the previously-supported engines", "<strong>Kemampuan penuh:</strong> Workflow Flex yang sudah dikenal dapat dipakai untuk membuat model particle tracking MODFLOW-6 maju dan mundur, dengan kemampuan setara engine yang didukung sebelumnya"),
                t("<strong>Any grid, out of the box:</strong> PRT can be run on any structured or unstructured grid in Flex, without requiring third-party tools", "<strong>Semua grid, langsung siap:</strong> PRT dapat dijalankan pada structured maupun unstructured grid di Flex tanpa alat pihak ketiga"),
                t("<strong>The full MODFLOW-6 workflow:</strong> With the addition of PRT, all major parts of the numerical modeling workflow (flow simulation, transport simulation, automated calibration, subregional water budget analysis, and particle tracking) can now be performed with MODFLOW-6 in Flex", "<strong>Workflow MODFLOW-6 lengkap:</strong> Dengan tambahan PRT, seluruh bagian utama workflow pemodelan numerik (simulasi aliran, simulasi transport, kalibrasi otomatis, analisis water budget subregional, dan particle tracking) kini dapat dikerjakan dengan MODFLOW-6 di Flex")
              ) +
              h4(t("MODFLOW-6 flow engine updates", "Pembaruan engine aliran MODFLOW-6")) +
              p(t("The included version of MODFLOW-6 has been upgraded from version 6.4.1 to 6.7.0:", "Versi MODFLOW-6 yang disertakan naik dari 6.4.1 ke 6.7.0:")) +
              ul(
                t("<strong>Improved multi-domain simulations:</strong> For models with one or more immobile domains, users now explicitly specify the volume fraction of each immobile domain", "<strong>Simulasi multi-domain yang lebih baik:</strong> Untuk model dengan satu atau lebih domain immobile, fraksi volume setiap domain immobile kini ditentukan secara eksplisit"),
                t("<strong>Seamless upgrade:</strong> Existing projects will be automatically upgraded to the new parameterization", "<strong>Upgrade mulus:</strong> Proyek yang sudah ada otomatis diperbarui ke parameterisasi baru")
              ) +
              h4("MODPATH 7.2") +
              p(t("Users now have the option of using MODPATH 7.2 as the particle tracking engine.", "MODPATH 7.2 kini dapat dipilih sebagai engine particle tracking."),
                t("<strong>Quadtree grid particle tracking:</strong> MODPATH 7.2 can be used as a first-party particle tracking engine for flow simulations on Q-grids run using MODFLOW-6 or MODFLOW-USG", "<strong>Particle tracking pada quadtree grid:</strong> MODPATH 7.2 dapat dipakai sebagai engine particle tracking bawaan untuk simulasi aliran pada Q-grid yang dijalankan dengan MODFLOW-6 atau MODFLOW-USG"))],
            [t("Performance and usability enhancements", "Peningkatan performa dan kemudahan pakai"),
              p(t("Visual MODFLOW Flex includes the following improvements for working with your models:", "Visual MODFLOW Flex membawa perbaikan berikut untuk pekerjaan model Anda:")) +
              h4(t("Performance:", "Performa:")) +
              p(t("Algorithm improvements have greatly decreased runtimes when", "Perbaikan algoritma memangkas runtime secara signifikan saat")) +
              ul(
                t("Generating model horizons", "Membuat horizon model"),
                t("Saving recharge and evapotranspiration boundary conditions which have many stress periods", "Menyimpan boundary condition recharge dan evapotranspirasi dengan banyak stress period"),
                t("Editing and saving recharge and evapotranspiration boundary conditions on structured grids with many grid cells", "Mengedit dan menyimpan boundary condition recharge dan evapotranspirasi pada structured grid dengan banyak sel"),
                t("Assigning properties or boundary conditions using complex polyline data objects", "Menetapkan properti atau boundary condition dengan objek data polyline yang kompleks"),
                t("Moving between workflow steps when using Q-grids with many cells", "Berpindah antartahap workflow pada Q-grid dengan banyak sel")
              ) +
              h4(t("Usability:", "Kemudahan pakai:")) +
              ul(
                t("Initial concentrations can now be defined using .UCN output files in the Translate workflow step for MT3D, MT3DMS, and RT3D simulations, similar to the existing implementation for MODFLOW-6", "Konsentrasi awal kini dapat ditentukan dari file output .UCN pada tahap workflow Translate untuk simulasi MT3D, MT3DMS, dan RT3D, sama seperti yang sudah ada untuk MODFLOW-6"),
                t("When the transport model is changed, irrelevant parameters are now removed from the Model Explorer", "Saat model transport diganti, parameter yang tidak relevan kini dihapus dari Model Explorer"),
                t("Added a keyboard shortcut to navigate between workflow steps (Ctrl + Page Up/Page Down)", "Shortcut keyboard baru untuk berpindah antartahap workflow (Ctrl + Page Up/Page Down)")
              )],
          ] },
        { t: "apps", bg: IMG("VMOD-feature-products"), h: t("Visual MODFLOW Flex Applications include", "Aplikasi Visual MODFLOW Flex meliputi"),
          items: [
            t("Delineate well capture zones for domestic water supply development", "Menentukan capture zone sumur untuk pengembangan pasokan air domestik"),
            t("Design and optimize pumping well locations for mine dewatering projects", "Merancang dan mengoptimalkan lokasi sumur pompa untuk proyek dewatering tambang"),
            t("Determine contaminant fate and exposure pathways for risk assessment", "Menentukan fate kontaminan dan jalur paparan untuk penilaian risiko"),
            t("Simulate surface water-groundwater interactions", "Mensimulasikan interaksi air permukaan dan airtanah"),
            t("Watershed scale/regional groundwater modeling, and aquifer storage and recovery (ASR)", "Pemodelan airtanah skala DAS/regional, serta aquifer storage and recovery (ASR)"),
            t("Evaluate groundwater remediation systems (pump and treat, funnel and gate etc)", "Mengevaluasi sistem remediasi airtanah (pump and treat, funnel and gate, dll.)"),
            t("Evaluate saltwater intrusion", "Mengevaluasi intrusi air laut"),
          ] },
        { t: "why", h: t("Why Choose Visual MODFLOW Flex?", "Mengapa Memilih Visual MODFLOW Flex?"), img: IMG("VMOD-hero-800"), alt: "Visual MODFLOW Flex",
          body:
            h4(t("Build models faster and more efficiently", "Bangun model lebih cepat dan efisien")) +
            ul(
              t("Model inputs and grid design can be updated at any point in the modeling process as modeling objectives change, more data are collected and a better understanding of the sub-surface is achieved.", "Input model dan desain grid dapat diperbarui kapan saja selama proses pemodelan, seiring berubahnya tujuan pemodelan, bertambahnya data, dan makin baiknya pemahaman bawah permukaan."),
              t("Modeling steps are conveniently presented in an intuitive, workflow-driven graphical user interface: see current and completed steps, and steps you need to finish.", "Tahap pemodelan disajikan dalam antarmuka grafis berbasis workflow yang intuitif: lihat tahap yang sedang berjalan, yang sudah selesai, dan yang masih perlu diselesaikan."),
              t("GIS-based 3D conceptual modeling and numerical modeling all within a single integrated software environment. This reduces costly 3rd party pre-processing tools, and eliminates transfer errors.", "Pemodelan konseptual 3D berbasis GIS dan pemodelan numerik dalam satu lingkungan software terintegrasi. Kebutuhan alat preprocessing pihak ketiga yang mahal berkurang, dan kesalahan transfer data hilang.")
            ) +
            h4(t("Build larger, more complex credible models", "Bangun model yang lebih besar, kompleks, dan kredibel")) +
            ul(
              t("Equipped to handle vast quantities of detailed, high resolution data. Simulate large and complex regional-scale groundwater systems.", "Mampu menangani data rinci beresolusi tinggi dalam jumlah besar. Simulasikan sistem airtanah skala regional yang luas dan kompleks."),
              t("Model inputs and outputs can be easily visualized alongside raw GIS field data in 3D, allowing credibility by demonstrating numerical model data generation (model layers, flow parameters, recharge data) from conceptual data (borehole logs, GIS data).", "Input dan output model dapat ditampilkan bersama data lapangan GIS mentah dalam 3D. Kredibilitas model terlihat karena data model numerik (layer model, parameter aliran, data recharge) dapat ditelusuri ke data konseptual (borehole log, data GIS)."),
              t("Unique design permits easy side-by-side comparisons of multiple models allowing you to assess alternative modeling scenarios, grid discretizations and hydro-geologic interpretations.", "Desainnya memudahkan perbandingan beberapa model secara berdampingan untuk menilai skenario pemodelan alternatif, diskretisasi grid, dan interpretasi hidrogeologi.")
            ) },
        { t: "feat", img: IMG("VMOD-screen-2"),
          body: h3(t("Powerful Data Visualization", "Visualisasi Data yang Andal")) +
            p(t("Built and designed on the latest in 3D visualization technology, Visual MODFLOW Flex allows you to effectively present and communicate your data to colleagues and stakeholders with impressive visual renderings of your hydrogeologic model.", "Dibangun di atas teknologi visualisasi 3D terkini, Visual MODFLOW Flex membantu Anda menyajikan dan mengomunikasikan data kepada rekan kerja dan pemangku kepentingan lewat tampilan visual model hidrogeologi yang mengesankan.")) +
            ul(
              t("Visualize all data, including conceptual objects, numerical grids, input data (property zones, boundary condition cells) and output data (calculated heads, pathlines, water table) in state-of-the-art 2D, 3D and multi-view (FlexViewer) displays.", "Tampilkan semua data, termasuk objek konseptual, grid numerik, data input (zona properti, sel boundary condition), dan data output (calculated heads, pathlines, water table) dalam tampilan 2D, 3D, dan multi-view (FlexViewer) mutakhir."),
              t("Create cut-away and cross-sectional views that allow you to see inside your model.", "Buat tampilan cut-away dan penampang untuk melihat bagian dalam model."),
              t("Generate 3D animations and movies for reports or the web, and optimized OpenGL graphics for enhanced hardware rendering.", "Hasilkan animasi dan video 3D untuk laporan atau web, dengan grafis OpenGL yang dioptimalkan untuk rendering hardware yang lebih baik."),
              t("Add isolines, contours, pathlines and color shading to viewers.", "Tambahkan isoline, kontur, pathline, dan color shading ke viewer."),
              t("Drape raster images (site maps, satellite imagery) over 3D surfaces to show relief", "Bentangkan gambar raster (peta lokasi, citra satelit) di atas permukaan 3D untuk menampilkan relief")
            ) },
        { t: "feat", img: IMG("business-woman-in-front-of-screen"),
          body: h3(t("Efficiently Manage Multiple Models", "Kelola Banyak Model dengan Efisien")) +
            p(t("Most modeling projects involve several scenarios/versions, e.g., steady-state vs transient, different properties, inputs and grid types. Visual MODFLOW Flex allows you to assess uncertainty and improve model credibility through comparisons and analysis of multiple modeling scenarios, all within a single project.", "Sebagian besar proyek pemodelan melibatkan beberapa skenario atau versi, misalnya steady-state vs transient, serta properti, input, dan tipe grid yang berbeda. Visual MODFLOW Flex membantu Anda menilai ketidakpastian dan meningkatkan kredibilitas model lewat perbandingan dan analisis beberapa skenario pemodelan, semuanya dalam satu proyek.")) +
            ul(
              t("Manage multiple model scenarios in a single project, and make direct visual and numerical comparisons between different modeling scenarios.", "Kelola beberapa skenario model dalam satu proyek, lalu bandingkan langsung secara visual dan numerik."),
              t("Easily generate multiple models in parallel for evaluating alternative hydrogeologic interpretations and hypotheses.", "Buat beberapa model secara paralel untuk mengevaluasi interpretasi dan hipotesis hidrogeologi alternatif."),
              t("Calculate head differences between multiple model runs, with the same or different grid size.", "Hitung selisih head antar-run model, dengan ukuran grid yang sama atau berbeda."),
              t("Compare and analyze multiple modeling scenarios for selecting the best, most realistic model.", "Bandingkan dan analisis beberapa skenario pemodelan untuk memilih model terbaik dan paling realistis.")
            ) },
        { t: "feat", img: IMG("VMOD-screen-3"),
          body: h3(t("Full GIS Integration", "Integrasi GIS Penuh")) +
            p(t("Easily construct your grid-independent hydrogeologic conceptual model in minutes using existing GIS data sets.", "Susun model konseptual hidrogeologi yang tidak bergantung pada grid dalam hitungan menit, memakai data GIS yang sudah ada.")) +
            ul(
              t("Quick and easy data importing of all common file types and formats.", "Impor data cepat dan mudah untuk semua tipe dan format file umum."),
              t("Automatic coordinate system and units conversion on import, and automatic data validation and intelligent error checking on import.", "Konversi sistem koordinat dan satuan otomatis saat impor, disertai validasi data otomatis dan pengecekan kesalahan yang cerdas."),
              t("Define model boundaries, property zones, boundary conditions and attributes from imported GIS data.", "Tentukan batas model, zona properti, boundary condition, dan atribut dari data GIS yang diimpor.")
            ),
          links: [[`${WH}/visual-modflow-flex-supported-packages-and-engines/#supported-file-type`, t("View All Supported File Types", "Lihat Semua Tipe File yang Didukung")]] },
        { t: "feat", img: IMG("woman-in-front-of-screen"), alt: t("woman in front of screen", "perempuan di depan layar"),
          body: h3(t("Integrated 3D Conceptual and Numerical Groundwater Modeling", "Pemodelan Airtanah Konseptual 3D dan Numerik yang Terintegrasi")) +
            p(t("Visual MODFLOW Flex provides a seamless transition from raw data through conceptualization to the numerical model all within a single intuitive modeling environment.", "Visual MODFLOW Flex menghubungkan data mentah, konseptualisasi, hingga model numerik secara mulus dalam satu lingkungan pemodelan yang intuitif.")) +
            ul(
              t("Define complex geology and model layers using borehole log data and cross-sections", "Tentukan geologi kompleks dan layer model dari data borehole log dan penampang"),
              t("Interpret GIS data to define hydrogeologic properties and boundaries independent of the grid", "Interpretasikan data GIS untuk menentukan properti dan batas hidrogeologi tanpa bergantung pada grid"),
              t("Run, analyze, and validate model results with raw data in 2D, 3D, and cross-section views", "Jalankan, analisis, dan validasi hasil model terhadap data mentah dalam tampilan 2D, 3D, dan penampang"),
              t("Easily create multiple conceptualizations; generate numerous grids and model scenarios in parallel all in a single project", "Buat beberapa konseptualisasi; hasilkan banyak grid dan skenario model secara paralel dalam satu proyek"),
              t("Assess uncertainty though comparing heads from multiple model runs in 2D, 3D or chart views", "Nilai ketidakpastian dengan membandingkan head dari beberapa run model dalam tampilan 2D, 3D, atau grafik")
            ),
          links: [[`${WH}/visual-modflow-flex-supported-packages-and-engines/`, t("View All Supported Engines &amp; MODFLOW Packages", "Lihat Semua Engine dan Paket MODFLOW yang Didukung")]] },
        { t: "feat", img: IMG("VMOD-screen-4"),
          body: h3(t("Flexible Grid Options", "Pilihan Grid yang Fleksibel")) +
            p(t("Visual MODFLOW Flex provides various grid types from which you can generate your numerical model. Easily experiment with different grid types and choose the one that gives you the best, most stable model.", "Visual MODFLOW Flex menyediakan berbagai tipe grid untuk membangun model numerik. Coba beberapa tipe grid, lalu pilih yang menghasilkan model terbaik dan paling stabil.")) +
            ul(
              t("Choose from various structured and unstructured grid types to accommodate a wide range of applications and geologic conditions (e.g., pinch outs, discontinuities).", "Pilih dari berbagai tipe structured dan unstructured grid untuk beragam aplikasi dan kondisi geologi (misalnya pinch-out dan diskontinuitas)."),
              t(`Improve simulation accuracy, reduce runtimes and increase model stability with ${a(`${WH}/2016/04/29/modflow-usg-unstructured-grids-a-game-changer-for-groundwater-modeling/`, "unstructured grid types (MODFLOW-USG)")}`, `Tingkatkan akurasi simulasi, kurangi runtime, dan tingkatkan stabilitas model dengan ${a(`${WH}/2016/04/29/modflow-usg-unstructured-grids-a-game-changer-for-groundwater-modeling/`, "tipe unstructured grid (MODFLOW-USG)")}`),
              t("Easily generate multiple grids within the same project and compare side-by-side in 2D or 3D", "Buat beberapa grid dalam proyek yang sama dan bandingkan berdampingan dalam 2D atau 3D"),
              t("Perform grid refinement around areas of interest", "Lakukan grid refinement di sekitar area yang menjadi fokus"),
              t("Create faster more stable models with nested child grids that contain local horizontal and vertical refinement (MODFLOW-LGR)", "Buat model yang lebih cepat dan stabil dengan nested child grid yang memiliki refinement horizontal dan vertikal lokal (MODFLOW-LGR)"),
              a(`${WH}/visual-modflow-flex-supported-packages-and-engines/`, t("View all supported grid types", "Lihat semua tipe grid yang didukung"))
            ),
          links: [sheet("WH-Tech-Sheet-VMOD-May-2026.pdf")] },
        { t: "cta", h: t("Get Started With Visual MODFLOW Flex", "Mulai dengan Visual MODFLOW Flex") },
      ],
    },

    /* ===================================================================== Hydro GeoAnalyst */
    "hydro-geoanalyst": {
      hero: IMG("BG-computer-code"),
      blocks: [
        { t: "intro", h: t("Environmental Data Management &amp; Visualization", "Manajemen dan Visualisasi Data Lingkungan"),
          body: p(
            t("Hydro GeoAnalyst (HGA) is Waterloo Hydrogeologic’s comprehensive and easy-to-use environmental data management system. HGA integrates customizable database structures used around the world with state-of-the-art tools for data interpretation, statistical analysis, Geographical Information System (GIS) mapping, data charting, and visualizations in two or three dimensions.", "Hydro GeoAnalyst (HGA) adalah sistem manajemen data lingkungan dari Waterloo Hydrogeologic yang lengkap dan mudah digunakan. HGA memadukan struktur database yang dapat disesuaikan, yang dipakai di seluruh dunia, dengan alat mutakhir untuk interpretasi data, analisis statistik, pemetaan Sistem Informasi Geografis (GIS), pembuatan grafik, serta visualisasi dua dan tiga dimensi."),
            t("The new Hydro GeoAnalyst Plus (HGA+) integrates geochemistry features of AquaChem into the data management and extensibility capabilities of HGA.", "Hydro GeoAnalyst Plus (HGA+) yang baru memadukan fitur geokimia AquaChem dengan kemampuan manajemen data dan perluasan HGA.")
          ) },
        { t: "why", h: t("Why Choose Hydro GeoAnalyst?", "Mengapa Memilih Hydro GeoAnalyst?"), img: IMG("HGA-hero-product-image-1"), alt: t("Hydro GeoAnalyst (HGA) Software Interface", "Antarmuka software Hydro GeoAnalyst (HGA)"),
          body: p(
            t("With Hydro GeoAnalyst, environmental professionals, geoscientists and government agencies have all the tools required to effectively and efficiently manage large volumes of data, and make informed decisions about environmental and water resources.", "Dengan Hydro GeoAnalyst, profesional lingkungan, geoscientist, dan lembaga pemerintah memiliki semua alat yang dibutuhkan untuk mengelola data dalam jumlah besar secara efektif dan efisien, lalu mengambil keputusan berbasis data tentang lingkungan dan sumber daya air."),
            t("HGA consists of an application that connects to an SQL Server database and facilitates data management, analysis and interpretation, and collaboration through various purpose-built modules. HGA helps you work with large volumes of environmental data without requiring in-depth knowledge of SQL. HGA+ extends these capabilities by adding modules specifically designed to work with geochemical data and a console for using R to get even more out of your data.", "HGA terdiri dari aplikasi yang terhubung ke database SQL Server dan mendukung manajemen data, analisis dan interpretasi, serta kolaborasi melalui berbagai modul khusus. HGA membantu Anda mengolah data lingkungan dalam jumlah besar tanpa perlu pengetahuan SQL yang mendalam. HGA+ memperluas kemampuan ini dengan modul khusus untuk data geokimia dan konsol R agar data Anda bisa diolah lebih jauh.")
          ) },
        { t: "acc", items: [[t("What modules are included in HGA vs HGA+?", "Modul apa saja yang ada di HGA dan HGA+?"), hgaTable([
          [t("DATA MANAGEMENT", "MANAJEMEN DATA"), [["Template Manager", "template-manager-icon-150x150-1"], ["Data Import", "data_into-150x150-1"], ["Data Viewers", "pin2_blue-150x150-1"], ["Query Builder/Viewer", "data_copy-150x150-1"], ["Lab QA/QC", "document_ok"], ["Interval Validator", "intervals_ok_256"], ["List Editor", "ListEditor"], ["Material Specification Editor", "MaterialSpecificationEditor"]], "1111"],
          [t("ANALYSIS/INTERPRETATION", "ANALISIS/INTERPRETASI"), [["Plot Collections", "Plot-Collections"], ["Map Viewer", "map_viewer"], ["Well Profile", "wellprofile128"], ["Cross-Section Editor", "Cross-Section-Viewer-Icon-WHG"], ["Scene Viewer", "scene-viewer-icon"], ["3D Interpolation", "3d-interpolation"], [t("Link to AquiferTest", "Tautan ke AquiferTest"), "10x10_AQT_logo-150x150-1"]], "1111"],
          [t("COLLABORATION", "KOLABORASI"), [["User Management", "User-Management"], ["Event Planner", "calendar_31-150x150-1"], ["Online Share", "environment-150x150-1"], ["Mobile EDD", "HGA_mobile-150x150-1"], ["Quick Checker", "check-150x150-1"], ["Print-To-Office Reporting", "print_to-150x150-1"]], "1111"],
          [t("LEGACY (32-Bit only)", "LEGACY (hanya 32-bit)"), [["Map Manager", "earth-150x150-1"], ["Cross-Section Editor", "CrossSectionEditor"], ["Report Editor", "Report-Editor"]], "1010"],
          ["Hydro GeoAnalyst Plus", [["Sample List", "Sample-List"], ["Parameter Editor", "cube_molecule-150x150-1"], ["Water Quality Standards", "clipboard-150x150-1"], ["Functions", "calculator-150x150-1"], ["Sample Reports", "folder2_blue-150x150-1"], ["PHREEQC", "PHREEQC-300x300"], ["R-Console", "R-Console"], ["Trend Analysis", "chart_trend_recreation_512-300x300"], ["(Extended) Plot Collections", "Plot-Collections"], ["(Extended) Map Viewer", "map_viewer"]], "0011"],
        ])]] },
        { t: "feat", img: IMG("HGA-screen-3"), alt: t("Hydro GeoAnalyst (HGA) Software Interface on Computer", "Antarmuka Hydro GeoAnalyst (HGA) di komputer"),
          body: h3(t("Improved Data Quality", "Kualitas Data yang Lebih Baik")) +
            p(t("Hydro GeoAnalyst standardizes your organization and intelligently validates all data upon import, ensuring it meets quality requirements for reliable analyses and informed decision making.", "Hydro GeoAnalyst menstandarkan data organisasi Anda dan memvalidasi semua data secara cerdas saat impor, sehingga data memenuhi syarat mutu untuk analisis yang andal dan keputusan yang tepat.")) +
            ul(
              t("Hydro GeoAnalyst helps you kick start your project by providing an environmental database template that consists of tables and fields for common environmental data types, common well profile templates and report templates.", "Hydro GeoAnalyst mempercepat awal proyek Anda dengan template database lingkungan berisi tabel dan field untuk tipe data lingkungan umum, template well profile umum, dan template laporan."),
              t("Increase efficiency and achieve cost savings with streamlined and automated data collection, data import, analysis and reporting workflows.", "Tingkatkan efisiensi dan hemat biaya lewat workflow pengumpulan data, impor data, analisis, dan pelaporan yang ringkas dan otomatis."),
              t("Unlike other commercial environmental data management software packages, Hydro GeoAnalyst gives you complete control over your database, allowing you to fully customize the database structure to accommodate project needs and scale your database as data volumes grow.", "Berbeda dari software manajemen data lingkungan komersial lainnya, Hydro GeoAnalyst memberi Anda kendali penuh atas database: strukturnya dapat disesuaikan sepenuhnya dengan kebutuhan proyek dan diperbesar seiring bertambahnya data.")
            ) },
        { t: "feat", img: IMG("woman-in-front-of-screen"), alt: t("woman in front of screen", "perempuan di depan layar"),
          body: h3(t("Vital Information at Your Fingertips", "Informasi Penting dalam Jangkauan")) +
            ul(t("The Query Builder is a powerful tool that helps you create, save and recall simple to complex data queries without having to know complicated SQL syntax. Easily define the conditions of your query by dragging and dropping database fields, and choosing the desired logical operators (AND, OR, LIKE and IS).", "Query Builder membantu Anda membuat, menyimpan, dan memanggil kembali query data sederhana hingga kompleks tanpa perlu menguasai sintaks SQL yang rumit. Tentukan kondisi query dengan menyeret dan melepas field database, lalu pilih operator logika yang diinginkan (AND, OR, LIKE, dan IS).")) +
            h4(t("Gain critical insight", "Dapatkan wawasan penting")) +
            ul(
              t("Gain greater insight into your environmental data with a suite of integrated analysis, interpretation and visualization tools including Map Manager, Cross Section Editor, Well Profile, Time Series Charts, Scene Viewer and more.", "Pahami data lingkungan lebih dalam dengan rangkaian alat analisis, interpretasi, dan visualisasi terintegrasi, termasuk Map Manager, Cross Section Editor, Well Profile, Time Series Charts, Scene Viewer, dan lainnya."),
              t("The analysis tools included with Hydro GeoAnalyst are developed solely by Waterloo Hydrogeologic which saves you money, guarantees interoperability, and simplifies procurement and license management.", "Alat analisis di Hydro GeoAnalyst dikembangkan sepenuhnya oleh Waterloo Hydrogeologic, sehingga lebih hemat biaya, interoperabilitas terjamin, serta pengadaan dan manajemen lisensi lebih sederhana.")
            ),
          links: [[`${WH}/hga-module-guide/`, t("View Module Categorization for Hydro GeoAnalyst", "Lihat Kategori Modul Hydro GeoAnalyst")]] },
        { t: "feat", img: IMG("HGA-screen-4"), alt: t("HGA screen on computer", "Tampilan HGA di komputer"),
          body: h3(t("Collaborate and Communicate Efficiently", "Kolaborasi dan Komunikasi yang Efisien")) +
            p(t("Hydro GeoAnalyst stores all your data in a single, centralized database that can be accessed securely by multiple users across a network. Well Profiles, maps, cross-section diagrams, time-series charts and reports can be easily retrieved by team members and key decision makers.", "Hydro GeoAnalyst menyimpan semua data Anda dalam satu database terpusat yang dapat diakses dengan aman oleh banyak pengguna di jaringan. Well profile, peta, diagram penampang, grafik time series, dan laporan mudah diambil oleh anggota tim maupun pengambil keputusan.")) +
            ul(t("Hydro GeoAnalyst streamlines field data collection with easy-to-use planning tools and support for mobile electronic data deliverables. Easily plan and schedule your field trips, and then conveniently collect your data using your Apple or Android mobile device.", "Hydro GeoAnalyst menyederhanakan pengumpulan data lapangan dengan alat perencanaan yang mudah dipakai dan dukungan electronic data deliverable (EDD) mobile. Rencanakan dan jadwalkan kunjungan lapangan, lalu kumpulkan data dengan perangkat mobile Apple atau Android.")) },
        { t: "new", icon: IMG("HGA_logo-1"), h: t("What’s New in Hydro GeoAnalyst 14.0 &amp; Hydro GeoAnalyst PLUS", "Yang Baru di Hydro GeoAnalyst 14.0 dan Hydro GeoAnalyst PLUS"),
          items: [
            [t("Cloud databases", "Database cloud"),
              p(t("New HGA projects can now store their project database in the cloud:", "Proyek HGA baru kini dapat menyimpan database proyek di cloud:")) +
              ul(
                t("<strong>Collaborate anywhere:</strong> Cloud databases can be accessed by any of your team members with an internet connection and HGA installed", "<strong>Kolaborasi dari mana saja:</strong> Database cloud dapat diakses oleh anggota tim mana pun yang memiliki koneksi internet dan HGA terpasang"),
                t("<strong>Seamless setup:</strong> Simply specify host details and provide credentials; your HGA workflows are otherwise exactly the same", "<strong>Pengaturan mudah:</strong> Cukup isi detail host dan kredensial; selebihnya workflow HGA Anda tetap sama"),
                t("<strong>Highly compatible:</strong> Projects can use managed database services such as AWS, Azure, and Google Cloud, or your own web servers", "<strong>Kompatibel luas:</strong> Proyek dapat memakai layanan database terkelola seperti AWS, Azure, dan Google Cloud, atau server web Anda sendiri")
              )],
            [t("Bulk data import", "Impor data massal"),
              p(t("Multiple data sources can now be imported at once using the same mapping:", "Beberapa sumber data kini dapat diimpor sekaligus dengan mapping yang sama:")) +
              ul(
                t("<strong>General bulk data import:</strong> Simultaneously import many spreadsheets of single-table data, such as lithology data or sample data", "<strong>Impor data massal umum:</strong> Impor banyak spreadsheet data satu tabel sekaligus, misalnya data litologi atau data sampel"),
                t("<strong>EDD bulk import</strong>", "<strong>Impor EDD massal</strong>"),
                robust
              ) + img("Bulk-data-import", t("Bulk data import", "Impor data massal"))],
            [t("Plotting", "Plotting"),
              p(t("Plots have received numerous upgrades:", "Plot mendapat banyak peningkatan:")) +
              ul(
                t("<strong>Linear regression lines:</strong> Linear regression lines may now be automatically calculated and plotted on Scatter and Time Series plots in the Lines tab", "<strong>Garis regresi linear:</strong> Garis regresi linear kini dapat dihitung dan diplot otomatis pada plot Scatter dan Time Series di tab Lines"),
                t("<strong>Faster symbology changes:</strong> The applied symbol group can now be changed directly from the plot settings window in the new Symbols tab", "<strong>Ganti simbologi lebih cepat:</strong> Grup simbol kini dapat diganti langsung dari jendela pengaturan plot di tab Symbols yang baru"),
                t("<strong>Labeled lines:</strong> Lines can be given arbitrary labels or take label data from calculated linear regression lines", "<strong>Garis berlabel:</strong> Garis dapat diberi label bebas atau mengambil label dari garis regresi linear yang dihitung"),
                t("<strong>Configurable legend locations:</strong> The location of the legend can now be customized", "<strong>Posisi legenda yang dapat diatur:</strong> Letak legenda kini dapat disesuaikan")
              ) + img("Plotting", "Plotting")],
            [t("Usability and Other Enhancements (HGA)", "Kemudahan pakai dan peningkatan lain (HGA)"),
              p(t("HGA and HGA+ include the following additional enhancements:", "HGA dan HGA+ membawa peningkatan tambahan berikut:")) +
              ul(...usability3, t("HGA modules now use a more efficient architecture for storing data, reducing the likelihood of SQL object limit errors", "Modul HGA kini memakai arsitektur penyimpanan data yang lebih efisien, sehingga kemungkinan error batas objek SQL berkurang"))],
            [t("Trend Analysis module (HGA+ only)", "Modul Trend Analysis (khusus HGA+)"),
              p(t("The new Trend Analysis module has been added, allowing you to perform statistical analyses on time series data", "Modul Trend Analysis yang baru memungkinkan analisis statistik pada data time series")) +
              ul(
                t("Tests and analyses supported:", "Uji dan analisis yang didukung:") + ul(t("Linear regression", "Regresi linear"), "Sen’s slope estimator", t("Spearman rank correlation", "Korelasi peringkat Spearman"), t("Mann-Kendall test", "Uji Mann-Kendall"), t("Seasonal Mann-Kendall test", "Uji Seasonal Mann-Kendall")),
                t("Trend analyses may be exported as spreadsheets or automatically plotted in time series graphs", "Hasil trend analysis dapat diekspor sebagai spreadsheet atau diplot otomatis dalam grafik time series")
              )],
            [t("Usability and Other Enhancements (HGA+)", "Kemudahan pakai dan peningkatan lain (HGA+)"),
              p(t("HGA+ includes the following additional enhancements:", "HGA+ membawa peningkatan tambahan berikut:")) +
              ul(
                t("Modeled and Calculated parameter results may now be exported from the Sample Report module", "Hasil parameter Modeled dan Calculated kini dapat diekspor dari modul Sample Report"),
                t("Sample analysis result metadata (such as precision, result comments, etc.) may now be exported from the Sample Report module", "Metadata hasil analisis sampel (seperti presisi, komentar hasil, dll.) kini dapat diekspor dari modul Sample Report"),
                t("Water quality standards may now be exported", "Standar kualitas air kini dapat diekspor"),
                t("The Sample Analysis Viewer module is now sortable", "Modul Sample Analysis Viewer kini dapat diurutkan"),
                t("Newly created parameters can now be updated from the Parameter Calculator by default", "Parameter baru kini dapat diperbarui dari Parameter Calculator secara default"),
                t("Durov/Piper diagram titles no longer list all parameters by default", "Judul diagram Durov/Piper tidak lagi mencantumkan semua parameter secara default"),
                t("Box-and-Whisker plots can now be labeled with the number of samples and non-detects in each data series", "Plot Box-and-Whisker kini dapat diberi label jumlah sampel dan non-detect pada setiap seri data")
              )],
            [t("Previously Released Features", "Fitur yang dirilis sebelumnya"),
              p(
                t(`See what’s new in Hydro GeoAnalyst 14.0 (${a(`${WH}/wp-content/uploads/2026/08/Whats-New-in-Hydro-GeoAnalyst-HGA-14.0.pdf`, "Download feature sheet")})`, `Lihat yang baru di Hydro GeoAnalyst 14.0 (${a(`${WH}/wp-content/uploads/2026/08/Whats-New-in-Hydro-GeoAnalyst-HGA-14.0.pdf`, "unduh feature sheet")})`),
                ...[["13.0", "2026/04/HGA-13-Product-Release.pdf"], ["12.0", "2024/08/HGA-12-Product-Feature-Release.pdf"], ["11.0", "2022/09/HGA-11-New-Feature-List.pdf"], ["10.0", "2022/09/HGA-Product-Release_v10.pdf"]].map(([v, f]) =>
                  t(`See what was included in Hydro GeoAnalyst ${v} (${a(`${WH}/wp-content/uploads/${f}`, "Download feature sheet")})`, `Lihat isi rilis Hydro GeoAnalyst ${v} (${a(`${WH}/wp-content/uploads/${f}`, "unduh feature sheet")})`)),
                t(`For a complete version history, see the ${a(`${WH}/hydro-geoanalyst-readme/`, "Hydro GeoAnalyst readme file")}`, `Riwayat versi lengkap ada di ${a(`${WH}/hydro-geoanalyst-readme/`, "file readme Hydro GeoAnalyst")}`)
              )],
          ] },
        { t: "apps", bg: IMG("HGA-feature-products"), h: t("Hydro GeoAnalyst Applications include", "Aplikasi Hydro GeoAnalyst meliputi"),
          items: [
            t("Manage data for local, state and federal groundwater monitoring networks", "Mengelola data jaringan pemantauan airtanah tingkat lokal, provinsi, dan nasional"),
            t("Analyze borehole data acquired for mineral exploration", "Menganalisis data borehole dari eksplorasi mineral"),
            t("Manage well construction details and registration information", "Mengelola detail konstruksi sumur dan informasi registrasinya"),
            t("Manage data associated with remediation projects", "Mengelola data proyek remediasi"),
            t("Store and report landfill monitoring data, groundwater vulnerability assessment and protection planning", "Menyimpan dan melaporkan data pemantauan landfill, penilaian kerentanan airtanah, dan perencanaan perlindungannya"),
            t("Mapping and reporting of aquifer extents and geologic formations", "Memetakan dan melaporkan sebaran akuifer dan formasi geologi"),
            t("Evaluate and report the spatial distribution of water quality parameters", "Mengevaluasi dan melaporkan sebaran spasial parameter kualitas air"),
          ] },
        { t: "cta", h: t("Get Started With Hydro GeoAnalyst", "Mulai dengan Hydro GeoAnalyst") },
      ],
    },

    /* ===================================================================== AquaChem */
    "aquachem": {
      hero: IMG("water-drops-1"),
      blocks: [
        { t: "intro", h: t("Water Quality Data Analysis and Reporting Software", "Software Analisis dan Pelaporan Data Kualitas Air"),
          body: p(t("AquaChem’s analysis tools cover a range of functions and calculations including unit transformations, charge balances, and statistics. These powerful analytical capabilities are complemented by an extensive selection of commonly used geochemical plots to represent the chemical characteristics of water quality data.", "Alat analisis AquaChem mencakup beragam fungsi dan perhitungan, termasuk konversi satuan, charge balance, dan statistik. Kemampuan analisis ini dilengkapi pilihan geochemical plot yang umum dipakai untuk menggambarkan karakteristik kimia data kualitas air.")) },
        { t: "new", icon: IMG("AquaChem-Logo"), h: t("What’s New in AquaChem 15.0", "Yang Baru di AquaChem 15.0"),
          items: [
            [t("Import improvements", "Peningkatan impor"),
              p(t("Importing data is now easier than ever:", "Impor data kini lebih mudah:")) +
              ul(
                t("<strong>Smart mapping:</strong> Source data column names can now be automatically mapped to project fields using fuzzy (inexact) matching", "<strong>Smart mapping:</strong> Nama kolom data sumber kini dapat dipetakan otomatis ke field proyek dengan fuzzy matching (pencocokan tidak persis)"),
                t("<strong>Chemical list import:</strong> Matched chemical parameters can now be imported from the master chemical database with just one click", "<strong>Impor daftar kimia:</strong> Parameter kimia yang cocok kini dapat diimpor dari master chemical database dengan satu klik")
              ) + img("AquaChem-15-import_smart_mapping", "AquaChem 15 smart mapping")],
            [t("QC reports", "Laporan QC"),
              p(t("The brand-new QC report module has been added, allowing out-of-the-box capability to detect and report common quality control issues in sample data.", "Modul laporan QC yang baru dapat langsung mendeteksi dan melaporkan masalah quality control yang umum pada data sampel.")) +
              ul(
                t("<strong>Define parameter holding times:</strong> Chemical parameters can now have holding times defined, allowing for sampling violations to be automatically documented", "<strong>Tentukan holding time parameter:</strong> Parameter kimia kini dapat diberi holding time, sehingga pelanggaran waktu sampling terdokumentasi otomatis"),
                t("<strong>Instant sample summaries:</strong> Easily report summary data, major ion composition, parameters which exceeded the maximum holding time, measurements below the MDL, and parameters outside of their defined natural occurrence range", "<strong>Ringkasan sampel instan:</strong> Laporkan data ringkasan, komposisi ion mayor, parameter yang melewati holding time maksimum, pengukuran di bawah MDL, dan parameter di luar rentang kemunculan alaminya"),
                t("<strong>Reliability tests:</strong> Flag samples with unacceptable calculated electroneutrality, TDS-to-conductivity ratios, major ion ratios, and more", "<strong>Uji keandalan:</strong> Tandai sampel dengan electroneutrality hasil hitung, rasio TDS terhadap konduktivitas, rasio ion mayor, dan nilai lain yang tidak dapat diterima"),
                t("<strong>Fully configurable:</strong> The contents of the QC report are fully configurable, allowing you to enable and disable report sections, add parameters, and set the attention level for the reliability tests", "<strong>Dapat diatur sepenuhnya:</strong> Isi laporan QC dapat diatur penuh; aktifkan atau nonaktifkan bagian laporan, tambahkan parameter, dan tetapkan tingkat perhatian untuk uji keandalan")
              )],
            [t("Bulk data import", "Impor data massal"),
              p(t("Multiple data sources can now be imported at once using the same mapping", "Beberapa sumber data kini dapat diimpor sekaligus dengan mapping yang sama")) +
              ul(t("<strong>General bulk import:</strong> Simultaneously import many spreadsheets of data that have the same formatting, such as sample data or station data", "<strong>Impor massal umum:</strong> Impor sekaligus banyak spreadsheet dengan format yang sama, misalnya data sampel atau data stasiun"), robust)],
            [t("Usability", "Kemudahan pakai"), ul(...usability3)],
            [t("Previously Released Features", "Fitur yang dirilis sebelumnya"),
              p(
                t(`View the enhancements released in ${a(`${WH}/aquachem-14-0-product-release/`, "AquaChem 14.0 feature sheet")}`, `Lihat peningkatan yang dirilis di ${a(`${WH}/aquachem-14-0-product-release/`, "feature sheet AquaChem 14.0")}`),
                t(`View the enhancements released in ${a(`${WH}/wp-content/uploads/2025/11/AquaChem-13-Product-Release.pdf`, "AquaChem 13.0 feature sheet")}`, `Lihat peningkatan yang dirilis di ${a(`${WH}/wp-content/uploads/2025/11/AquaChem-13-Product-Release.pdf`, "feature sheet AquaChem 13.0")}`),
                t(`For complete version history, see the ${a(`${WH}/aquachem-readme/`, "AquaChem readme file")}`, `Riwayat versi lengkap ada di ${a(`${WH}/aquachem-readme/`, "file readme AquaChem")}`)
              )],
          ] },
        { t: "why", h: t("Why Choose AquaChem?", "Mengapa Memilih AquaChem?"), img: IMG("Copy-of-Untitled-Design-1"), alt: t("AquaChem data points on a computer", "Titik data AquaChem di komputer"),
          body: p(t("AquaChem’s analysis tools cover a range of functions and calculations including unit transformations, charge balances, and statistics. These powerful analytical capabilities are complemented by an extensive selection of commonly used geochemical plots to represent the chemical characteristics of water quality data.", "Alat analisis AquaChem mencakup beragam fungsi dan perhitungan, termasuk konversi satuan, charge balance, dan statistik. Kemampuan analisis ini dilengkapi pilihan geochemical plot yang umum dipakai untuk menggambarkan karakteristik kimia data kualitas air.")) +
            ul(
              t("Simple and easy analysis of water quality data", "Analisis data kualitas air yang sederhana dan mudah"),
              t("Effortless and flexible data importing and exporting", "Impor dan ekspor data yang mudah dan fleksibel"),
              t("Over 20 essential geochemical plots and graphing techniques including Piper, Schoeller, scatter, box and whisker, Stiff", "Lebih dari 20 geochemical plot dan teknik grafik penting, termasuk Piper, Schoeller, scatter, box and whisker, dan Stiff"),
              t("Automatic geochemical calculations of water type, sum of anions, sum of cations, ion balance, TDS, hardness and more", "Perhitungan geokimia otomatis untuk water type, jumlah anion, jumlah kation, ion balance, TDS, hardness, dan lainnya"),
              t("Water quality exceedance reports for multiple water quality standards", "Laporan exceedance terhadap beberapa standar kualitas air"),
              t("Automatic ready-made reports", "Laporan siap pakai yang dibuat otomatis"),
              t("Integrated geochemical modelling with PHREEQC (available from the USGS)", "Pemodelan geokimia terintegrasi dengan PHREEQC (tersedia dari USGS)")
            ) },
        { t: "feat", img: IMG("people-working"), alt: t("People reviewing data on a computer", "Orang meninjau data di komputer"),
          body: h3(t("Effortless Data Management &amp; QA/QC", "Manajemen Data dan QA/QC yang Mudah")) +
            ul(
              t("Easily import data from various file types (.txt, .csv, .xls, .xlsx, .mdb, and .accdb) and file formats (samples as rows, samples as columns, one analyzed value for each row)", "Impor data dari berbagai tipe file (.txt, .csv, .xls, .xlsx, .mdb, dan .accdb) dan format file (sampel sebagai baris, sampel sebagai kolom, satu nilai analisis per baris)"),
              t("Export stations, analysis data and geochemical plots to multiple formats, including text files, spreadsheets, images, and print-ready Office documents.", "Ekspor stasiun, data analisis, dan geochemical plot ke berbagai format, termasuk file teks, spreadsheet, gambar, dan dokumen Office siap cetak."),
              t("Create simple to complex data queries and easily extract vital information about your water quality data.", "Buat query data sederhana hingga kompleks dan ambil informasi penting dari data kualitas air Anda.")
            ) },
        { t: "feat", img: IMG("Waterloo-Hydrogeologic-"), alt: t("AquaChem plots", "Plot AquaChem"),
          body: h3(t("Interactive GeoChemical and Statistical Plots", "Plot Geokimia dan Statistik yang Interaktif")) +
            p(t("AquaChem allows you to create multiple plots for the same dataset and view these plots simultaneously side-by-side. All plots are interactive: click on a data point and its corresponding sample is highlighted in the sample list. This is useful for identifying outliers.", "AquaChem memungkinkan Anda membuat beberapa plot dari dataset yang sama dan melihatnya berdampingan. Semua plot interaktif: klik satu titik data, dan sampel terkait langsung disorot di daftar sampel. Fitur ini membantu mengenali outlier.")) +
            ul(
              t("<strong>Geochemical plots:</strong> Piper, Stiff, Durov, Schoeller, Wilcox, Giggenbach, Meteoric Water Line, Ludwig-Langelier, Ternary", "<strong>Plot geokimia:</strong> Piper, Stiff, Durov, Schoeller, Wilcox, Giggenbach, Meteoric Water Line, Ludwig-Langelier, Ternary"),
              t("<strong>Statistical Plots:</strong> Box and Whisker, Histogram, Probability, Quantile, Detection Summary", "<strong>Plot statistik:</strong> Box and Whisker, Histogram, Probability, Quantile, Detection Summary"),
              t("<strong>General Plots:</strong> Scatter, Pie, Stacked Bars, Radial, Time Series", "<strong>Plot umum:</strong> Scatter, Pie, Stacked Bars, Radial, Time Series")
            ) },
        { t: "feat", img: IMG("Copy-of-Untitled-Design"), alt: t("AquaChem water quality data analysis on laptop", "Analisis data kualitas air AquaChem di laptop"),
          body: h3(t("Water Quality Data Analysis", "Analisis Data Kualitas Air")) +
            p(t("AquaChem comes with comprehensive calculators and converters that allow you to perform quick, on-the-fly analyses on your water quality data.", "AquaChem dilengkapi kalkulator dan konverter lengkap untuk menganalisis data kualitas air dengan cepat dan langsung.")) +
            ul(
              t("<strong>Unit Conversion:</strong> AquaChem manages measurement and concentration units for you; switch between mass-, molar-, and equivalent-based concentrations on the fly.", "<strong>Konversi satuan:</strong> AquaChem mengelola satuan pengukuran dan konsentrasi untuk Anda; beralih antara konsentrasi berbasis massa, molar, dan ekuivalen secara langsung."),
              t("<strong>Ionic Functions:</strong> Water Type, Electroneutrality/Ion Balance, Sum of Anions, Sum of Cations, TDS, Hardness, Alkalinity.", "<strong>Fungsi ionik:</strong> Water Type, Electroneutrality/Ion Balance, jumlah anion, jumlah kation, TDS, hardness, alkalinity."),
              t("<strong>General:</strong> Date functions, Exceedance counts, Total Organic Carbon, Total Organic Halogens.", "<strong>Umum:</strong> Fungsi tanggal, jumlah exceedance, Total Organic Carbon, Total Organic Halogens."),
              t("<strong>Corrosion and Scaling Indices:</strong> Langelier Saturation, Ryznar Stability, Puckorius Scaling, and Larson-Skold.", "<strong>Indeks korosi dan scaling:</strong> Langelier Saturation, Ryznar Stability, Puckorius Scaling, dan Larson-Skold."),
              t("<strong>Agricultural/Irrigation Metrics:</strong> Sodium Absorption Ratio, Magnesium Hazard, Residual Sodium Carbonate.", "<strong>Metrik pertanian/irigasi:</strong> Sodium Absorption Ratio, Magnesium Hazard, Residual Sodium Carbonate."),
              t("<strong>Enthalpy:</strong> Enthalpy of water (liquid or vapor) based on temperature or dissolved silica.", "<strong>Entalpi:</strong> Entalpi air (cair atau uap) berdasarkan suhu atau silika terlarut."),
              t("<strong>Isotopes:</strong> Estimates of infiltration elevation and temperature based on Oxygen-18 and Deuterium isotopic fractionation.", "<strong>Isotop:</strong> Estimasi elevasi dan suhu infiltrasi berdasarkan fraksinasi isotop Oxygen-18 dan Deuterium.")
            ) },
        { t: "feat", img: IMG("workspace"),
          body: h3(t("Automatic Reports", "Laporan Otomatis")) +
            p(t("In just a few clicks, AquaChem delivers ready-made reports that contain key information about your water quality data. Fully customized layouts using the Report Designer:", "Hanya dengan beberapa klik, AquaChem menghasilkan laporan siap pakai berisi informasi penting dari data kualitas air Anda. Tata letaknya dapat disesuaikan penuh dengan Report Designer:")) +
            ul(
              t("<strong>Sample Report:</strong> Generates a report for selected parameters that includes comparisons to water quality standards and summary statistics for selected samples.", "<strong>Sample Report:</strong> Membuat laporan untuk parameter terpilih, lengkap dengan perbandingan terhadap standar kualitas air dan statistik ringkasan untuk sampel terpilih."),
              t("<strong>Station List &amp; Sample List Reports:</strong> Generates a table of selected sampling stations, and generates a table of selected samples", "<strong>Laporan Station List dan Sample List:</strong> Membuat tabel stasiun sampling terpilih dan tabel sampel terpilih"),
              t("<strong>Sample Result Report:</strong> Generates table of selected results for the active sample", "<strong>Sample Result Report:</strong> Membuat tabel hasil terpilih untuk sampel aktif")
            ) +
            h3("R-Console") +
            ul(t("AquaChem includes a console that allows you to run scripts in the R scripting language and leverage the thousands of available libraries that facilitate data analyses, visualization, categorization and much more.", "AquaChem menyertakan konsol untuk menjalankan script bahasa R dan memanfaatkan ribuan library yang tersedia untuk analisis data, visualisasi, kategorisasi, dan banyak lagi.")) },
        { t: "feat", img: IMG("Lithium_Operation"),
          body: h3(t("Geochemical Modeling (Using PHREEQC)", "Pemodelan Geokimia (dengan PHREEQC)")) +
            p(t("AquaChem includes features that integrate the functionality of PHREEQC and PHREEQCi to facilitate geochemical modelling:", "AquaChem memiliki fitur yang mengintegrasikan fungsi PHREEQC dan PHREEQCi untuk mendukung pemodelan geokimia:")) +
            ul(
              t("<strong>Thermodynamic Databases:</strong> manage thermodynamic databases directly in the project for improved collaboration, consistency, and project portability", "<strong>Database termodinamika:</strong> kelola database termodinamika langsung di dalam proyek untuk kolaborasi, konsistensi, dan portabilitas proyek yang lebih baik"),
              t("<strong>Calculate Saturation Indices and Activities:</strong> seamlessly calculate saturation indices for specified mineral/gas phases and log activities for batches of samples in a few mouse clicks and store the results directly in your project database", "<strong>Hitung saturation index dan activity:</strong> hitung saturation index untuk fase mineral/gas tertentu dan log activity untuk sekumpulan sampel dengan beberapa klik, lalu simpan hasilnya langsung di database proyek"),
              t("<strong>Basic Geochemical Modeling using PHREEQC:</strong> develop basic PHREEQC models using a fully integrated and intuitive interface", "<strong>Pemodelan geokimia dasar dengan PHREEQC:</strong> susun model PHREEQC dasar lewat antarmuka yang terintegrasi penuh dan intuitif"),
              t("<strong>Advanced Geochemical Modeling using PHREEQCi:</strong> send a selected set of samples to a new session of PHREEQCi preloaded with relevant data", "<strong>Pemodelan geokimia lanjutan dengan PHREEQCi:</strong> kirim sampel terpilih ke sesi PHREEQCi baru yang sudah memuat data terkait")
            ),
          links: [sheet("WH-Tech-Sheet-AQUACHEM-May-2026.pdf")] },
        { t: "apps", bg: IMG("ACH-feature-products"), h: t("AquaChem Applications include", "Aplikasi AquaChem meliputi"),
          items: [
            t("Analyze &amp; report aqueous geochemistry of supply wells", "Menganalisis dan melaporkan geokimia air dari sumur pasokan"),
            t("Analytical lab results of samples from contaminated sites", "Mengolah hasil analisis laboratorium sampel dari lokasi terkontaminasi"),
            t("Manage water quality data from sanitary landfills", "Mengelola data kualitas air dari sanitary landfill"),
            t("Identify mineralization trends for mining exploration", "Mengidentifikasi tren mineralisasi untuk eksplorasi tambang"),
            t("Analyze, interpret and plot water quality data", "Menganalisis, menginterpretasi, dan memplot data kualitas air"),
            t("Regulatory compliance with trend analyses reports", "Memenuhi kepatuhan regulasi dengan laporan trend analysis"),
            t("Identify and report water quality guideline exceedances", "Mengidentifikasi dan melaporkan pelampauan baku mutu kualitas air"),
          ] },
        { t: "cta", h: t("Get Started With AquaChem!", "Mulai dengan AquaChem!") },
      ],
    },

    /* ===================================================================== AquiferTest */
    "aquifertest": {
      hero: IMG("beakers"),
      blocks: [
        { t: "intro", h: t("Pumping &amp; Slug Test Analysis, Interpretation &amp; Visualization Software", "Software Analisis, Interpretasi, dan Visualisasi Pumping Test dan Slug Test"),
          body: p(t("AquiferTest is an easy-to-use software package for analyzing, interpreting and visualizing pumping and slug test data. AquiferTest offers all the tools needed to accurately interpret data from all types of aquifers in all types of test conditions.", "AquiferTest adalah paket software yang mudah dipakai untuk menganalisis, menginterpretasi, dan memvisualisasikan data pumping test dan slug test. AquiferTest menyediakan semua alat untuk menginterpretasi data secara akurat dari semua jenis akuifer dan kondisi pengujian.")) },
        { t: "why", h: t("Why Choose AquiferTest?", "Mengapa Memilih AquiferTest?"), img: IMG("Aquifertest-product-page-main-hero"), alt: "AquiferTest",
          body: p(t("Built for hydrogeologists by hydrogeologists, AquiferTest offers an easy-to-use graphical interface:", "Dibuat oleh hydrogeologist untuk hydrogeologist, AquiferTest menawarkan antarmuka grafis yang mudah dipakai:")) +
            ul(
              t("Analyze test data from pumping tests, slug tests and Lugeon tests via seamless integration with water level instrumentation.", "Analisis data pumping test, slug test, dan Lugeon test lewat integrasi mulus dengan instrumen water level."),
              t("A comprehensive suite of analysis methods and solutions suitable for all types of aquifers including confined, unconfined, leaky and fractured aquifers.", "Rangkaian metode dan solusi analisis yang lengkap untuk semua jenis akuifer, termasuk confined, unconfined, leaky, dan fractured."),
              t("Easily account for various well conditions including wellbore storage, horizontal wells, and single well analyses.", "Perhitungkan berbagai kondisi sumur, termasuk wellbore storage, sumur horizontal, dan analisis sumur tunggal."),
              t("Predictive water table drawdown at planned well locations, and customizable professional-quality analysis reports.", "Prediksi drawdown muka airtanah di lokasi sumur yang direncanakan, serta laporan analisis berkualitas profesional yang dapat disesuaikan."),
              t("Print-ready reports of your data and analyses are automatically generated for you!", "Laporan siap cetak dari data dan analisis Anda dibuat otomatis.")
            ) +
            p(t("AquiferTest Pro provides additional features:", "AquiferTest Pro menyediakan fitur tambahan:")) +
            ul(
              t("Advanced pre-processing tools for barometric compensation and trend correction.", "Alat preprocessing lanjutan untuk kompensasi barometrik dan koreksi tren."),
              t("Diagnostic plots and derivative analysis for identifying aquifer conditions from test data.", "Diagnostic plot dan derivative analysis untuk mengenali kondisi akuifer dari data uji."),
              t("Simplified contour plots and streamlines of drawdown solutions, and automatic type curve matching.", "Contour plot dan streamline solusi drawdown yang ringkas, serta type curve matching otomatis.")
            ) },
        { t: "new", icon: IMG("AquaferTest-Logo-1"), h: t("What’s New in AquiferTest 15.0", "Yang Baru di AquiferTest 15.0"),
          body: p(t(`For a full version history, see the AquiferTest readme file at: ${a(`${WH}/aquifertest-readme/`, "AquiferTest Readme")}`, `Riwayat versi lengkap ada di file readme AquiferTest: ${a(`${WH}/aquifertest-readme/`, "AquiferTest Readme")}`)),
          items: [
            [t("Usability", "Kemudahan pakai"),
              ul(
                t("<strong>Reporting:</strong> Test parameters for Bouwer-Rice and Dagan slug tests can now be reported.", "<strong>Pelaporan:</strong> Parameter uji untuk slug test Bouwer-Rice dan Dagan kini dapat dilaporkan."),
                t("<strong>Interface:</strong> The well table can now be sorted by field, and pumping and slug test frames can be sorted by name or date.", "<strong>Antarmuka:</strong> Tabel sumur kini dapat diurutkan per field, dan frame pumping test serta slug test dapat diurutkan berdasarkan nama atau tanggal.")
              ) +
              p(t(`For a full version history, see the ${a(`${WH}/aquifertest-readme/`, "AquiferTest readme file")}.`, `Riwayat versi lengkap ada di ${a(`${WH}/aquifertest-readme/`, "file readme AquiferTest")}.`))],
          ] },
        { t: "acc", items: [[t("What modules are included in AquiferTest vs AquiferTest Pro?", "Modul apa saja yang ada di AquiferTest dan AquiferTest Pro?"), aqtTable([
          [t("Standard Pumping Test Solutions", "Solusi pumping test standar"), 1],
          [t("Pumping Test Recovery Analyses", "Analisis recovery pumping test"), 1],
          [t("Standard Slug Test Solutions", "Solusi slug test standar"), 1],
          [t("Lugeon Test (Packer Test)", "Lugeon test (packer test)"), 0],
          [t("Fully or Partially Penetrating Wells", "Sumur penetrasi penuh atau sebagian"), 1],
          [t("Single or Multiple Pumping Wells", "Satu atau beberapa sumur pompa"), 1],
          [t("Constant or Variable Pumping Rates", "Debit pemompaan konstan atau bervariasi"), 1],
          [t("Aquifer Bounded by Barrier or Recharge Boundary", "Akuifer dengan batas barrier atau recharge"), 1],
          [t("Isotropic or Anisotropic Aquifer", "Akuifer isotropik atau anisotropik"), 1],
          [t("Well Effects (well bore storage)", "Efek sumur (wellbore storage)"), 1],
          [t("Fracture Flow Solution (Moench, Warren-Root)", "Solusi aliran rekahan (Moench, Warren-Root)"), 1],
          [t("Well Performance Solutions (Specific Capacity, Hantush-Bierschenk)", "Solusi performa sumur (Specific Capacity, Hantush-Bierschenk)"), 1],
          [t("Plotting Wells on a Site Map", "Plot sumur pada peta lokasi"), 1],
          [t("Derivative Smoothing", "Derivative smoothing"), 0],
          [t("Horizontal Wells (Clonts &amp; Ramey)", "Sumur horizontal (Clonts &amp; Ramey)"), 0],
          [t("Well Skin effects (Agarwal)", "Efek skin sumur (Agarwal)"), 0],
          [t("Plotting/Contouring Drawdown on a Site Map", "Plot/kontur drawdown pada peta lokasi"), 0],
          [t("Trend Effects / Barometric Correction", "Efek tren / koreksi barometrik"), 0],
          [t("Multi-Layered Aquifer Analysis", "Analisis akuifer berlapis"), 0],
        ])]] },
        { t: "h", h: t("More AquiferTest Features", "Fitur AquiferTest Lainnya") },
        { t: "feat", img: IMG("people-working"), alt: t("People reviewing data on a computer", "Orang meninjau data di komputer"),
          body: h3(t("Easy and Flexible Data Importing", "Impor Data yang Mudah dan Fleksibel")) +
            p(t("Save time and go straight to the analysis with flexible data import options. Quickly import field data from common file formats and virtually any groundwater datalogger on the market.", "Hemat waktu dan langsung masuk ke analisis dengan opsi impor data yang fleksibel. Impor data lapangan dari format file umum dan hampir semua datalogger airtanah di pasaran.")) +
            ul("Text (.TXT)", "Excel (XLSX)", "ASCII Datalogger (.ASC, .TDxt)", "Level Logger (.LEV)", "Diver Datalogger (.MON)") +
            h3(t("Automatic type curve fitting", "Type curve fitting otomatis")) +
            p(t("Show type curve families on analysis graphs for enhanced visual curve matching of complex aquifer conditions arising from variable pumping rates, aquitard storage and boundary effects.", "Tampilkan keluarga type curve pada grafik analisis untuk visual curve matching yang lebih baik pada kondisi akuifer kompleks akibat debit pemompaan bervariasi, aquitard storage, dan efek batas.")) },
        { t: "feat", img: IMG("aquifertest-screen-4"),
          body: h3(t("Colour contouring and color shading", "Kontur warna dan color shading")) +
            p(t("Gain a deeper understanding of your test data and take your reports to the next level with colourful contour maps showing drawdown data and well interference over aerial and satellite site maps.", "Pahami data uji lebih dalam dan tingkatkan kualitas laporan dengan peta kontur berwarna yang menampilkan data drawdown dan interferensi sumur di atas peta lokasi dari foto udara dan citra satelit.")) +
            h3(t("Barometric and baseline trend correction", "Koreksi barometrik dan baseline trend")) +
            p(t("AquiferTest Pro provides pre-processing tools that ensure your water levels are corrected for baseline trends (trend effects) and barometric pressure changes.", "AquiferTest Pro menyediakan alat preprocessing yang memastikan water level Anda terkoreksi terhadap baseline trend (efek tren) dan perubahan tekanan barometrik.")) },
        { t: "feat", img: IMG("workspace"),
          body: h3(t("Diagnostic plots for choosing the best analysis", "Diagnostic plot untuk memilih analisis terbaik")) +
            p(t("AquiferTest provides a set of powerful diagnostic plots that help you easily identify model assumptions and select the most appropriate analytical solution for your pumping test data.", "AquiferTest menyediakan diagnostic plot yang membantu Anda mengenali asumsi model dan memilih solusi analitis yang paling sesuai untuk data pumping test.")) +
            h3(t("Automatic analysis reports", "Laporan analisis otomatis")) +
            p(t("Automatically transform raw analyses to professional-quality reports that include your company logo, name, project information, well data, analysis graphs and site maps. Report templates can be customized exactly the way you want them, and saved as PDFs for easy sharing.", "Ubah hasil analisis mentah menjadi laporan berkualitas profesional secara otomatis, lengkap dengan logo dan nama perusahaan, informasi proyek, data sumur, grafik analisis, dan peta lokasi. Template laporan dapat disesuaikan sesuai keinginan dan disimpan sebagai PDF agar mudah dibagikan.")),
          links: [sheet("WH-Tech-Sheet-AquiferTest-Pro-May-2026.pdf")] },
        { t: "feat", img: IMG("screen-3-1"),
          body: h3(t("An Extensive Suite of Analytical Tools", "Rangkaian Alat Analisis yang Lengkap")) +
            p(t("AquiferTest delivers an extensive set of solutions suitable for all types of aquifers and test conditions. Analyse confined, unconfined, leaky, and fractured aquifers. Account for various well conditions including wellbore storage, horizontal wells, and single-well analyses.", "AquiferTest menyediakan beragam solusi untuk semua jenis akuifer dan kondisi pengujian. Analisis akuifer confined, unconfined, leaky, dan fractured. Perhitungkan berbagai kondisi sumur, termasuk wellbore storage, sumur horizontal, dan analisis sumur tunggal.")),
          links: [[`${WH}/aquifertest-analytical-methods/`, t("Complete List of Analytical Methods", "Daftar Lengkap Metode Analisis")]] },
        { t: "apps", bg: IMG("feature-products-aquifertest"), h: t("AquiferTest Applications Include", "Aplikasi AquiferTest meliputi"),
          items: [
            t("Groundwater resource evaluations", "Evaluasi sumber daya airtanah"),
            t("Determine groundwater hydraulics", "Menentukan hidraulika airtanah"),
            t("Pumping test data evaluation", "Evaluasi data pumping test"),
            t("Slug test reporting", "Pelaporan slug test"),
            t("Interpret Lugeon test data", "Interpretasi data Lugeon test"),
            t("Derive the fundamental hydrogeologic parameters affecting groundwater flow", "Menurunkan parameter hidrogeologi dasar yang memengaruhi aliran airtanah"),
          ] },
        { t: "cta", h: t("Get Started With AquiferTest", "Mulai dengan AquiferTest") },
      ],
    },
  };
};
