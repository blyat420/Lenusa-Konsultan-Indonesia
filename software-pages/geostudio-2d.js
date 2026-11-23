/* GeoStudio 2D, rebuilt from https://www.seequent.com/products-solutions/geostudio-2d/ (fetched 11 Nov 2026).
   Left out on purpose: demo buttons, pricing plans, "GeoStudio live in action", free training and support.
   Loaded by script.js (PAGE_FILES) only on software-details.html?id=geostudio-2d. t(en, id) picks the language. */
(window.SoftwarePages = window.SoftwarePages || {})["geostudio-2d"] = (t, { p, h4 }) => {
  const IMG = (n) => `assets/images/software/seequent/geostudio-2d/${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.webp`;
  const includes = (en, id) => p(t(`<strong>${en} includes the following:</strong>`, `<strong>${id} mencakup:</strong>`));
  const SLOPE = h4("SLOPE/W") + p(t("SLOPE/W is the leading limit equilibrium slope stability software for soil and rock slopes, analysing both simple and complex problems for a variety of slip surface shapes, pore water pressure conditions, soil properties, and loading conditions.",
    "SLOPE/W adalah software stabilitas lereng limit equilibrium terdepan untuk lereng tanah dan batuan. Software ini menganalisis masalah sederhana maupun kompleks untuk berbagai bentuk slip surface, kondisi tekanan air pori, sifat tanah, dan kondisi pembebanan."));
  const SEEP = h4("SEEP/W") + p(t("SEEP/W is a powerful finite element software product for modelling groundwater flow in porous media. SEEP/W can model simple saturated steady-state problems or sophisticated saturated/unsaturated transient analyses with atmospheric coupling at the ground surface.",
    "SEEP/W adalah software finite element yang andal untuk memodelkan aliran air tanah di media berpori. SEEP/W dapat memodelkan masalah steady-state jenuh yang sederhana hingga analisis transient jenuh/tak jenuh yang canggih dengan atmospheric coupling di permukaan tanah."));
  const QUAKE = h4("QUAKE/W") + p(t("QUAKE/W is a powerful finite element software product for modelling earthquake liquefaction and dynamic loading. QUAKE/W determines the motion and excess pore water pressures that arise due to earthquake shaking, blasts, or sudden impact loads.",
    "QUAKE/W adalah software finite element yang andal untuk memodelkan likuefaksi akibat gempa dan beban dinamis. QUAKE/W menghitung gerakan dan excess pore water pressure yang timbul akibat guncangan gempa, peledakan, atau beban impak mendadak."));
  const SIGMA = h4("SIGMA/W") + p(t("SIGMA/W is a powerful finite element software product for modelling stress and deformation in soil, rock, and structures. SIGMA/W analyses may range from simple linear elastic simulations to soil-structure interaction problems with nonlinear material models.",
    "SIGMA/W adalah software finite element yang andal untuk memodelkan tegangan dan deformasi pada tanah, batuan, dan struktur. Analisis SIGMA/W mencakup simulasi linear elastic sederhana hingga masalah interaksi tanah-struktur dengan model material nonlinear."));
  return {
    blocks: [
      { t: "hero", h1: "GeoStudio 2D",
        body: p(t("2D slope stability with critical slip surface and seepage modelling software", "Software stabilitas lereng 2D dengan critical slip surface dan pemodelan seepage")),
        img: IMG("GEO-2D-1") },
      { t: "split", img: IMG("GeoStudio-Value-Desktop"), rev: 1,
        h: t("A comprehensive solution for geotechnical analysis", "Solusi lengkap untuk analisis geoteknik"),
        body: p(t("GeoStudio 2D offers a range of numerical analysis tools for simulating conditions at and below the ground surface. From natural soil and rock slopes, to dewatering systems or tailings storage facilities, you can use GeoStudio 2D to model the conditions you need for better insights into your geotechnical projects.",
                  "GeoStudio 2D menyediakan beragam alat analisis numerik untuk mensimulasikan kondisi di permukaan dan bawah permukaan tanah. Mulai dari lereng tanah dan batuan alami hingga sistem dewatering atau fasilitas penyimpanan tailing, GeoStudio 2D dapat memodelkan kondisi yang Anda butuhkan untuk pemahaman yang lebih baik atas proyek geoteknik Anda.")) },
      { t: "cards", eyebrow: t("Key benefits", "Manfaat utama"), h: t("Confidently simulate surface and subsurface conditions", "Simulasikan kondisi permukaan dan bawah permukaan dengan yakin"), cols: 3,
        items: [
          { h: t("Collaborate seamlessly", "Kolaborasi tanpa hambatan"),
            body: p(t("Leverage the power of the Seequent portfolio, including Leapfrog and PLAXIS, to share geometry and materials via a seamless cloud-based workflow.",
                      "Manfaatkan portofolio Seequent, termasuk Leapfrog dan PLAXIS, untuk berbagi geometri dan material melalui workflow berbasis cloud yang mulus.")) },
          { h: t("Integrated stability analyses", "Analisis stabilitas terintegrasi"),
            body: p(t("Easily incorporate finite element results into a limit equilibrium analysis for a comprehensive view of slope stability.",
                      "Masukkan hasil finite element ke dalam analisis limit equilibrium dengan mudah untuk gambaran stabilitas lereng yang menyeluruh.")) },
          { h: t("Analyse complex ground behaviour", "Analisis perilaku tanah yang kompleks"),
            body: p(t("Use the comprehensive constitutive model library for soil and rock, in all your stability, groundwater flow, and stress-strain analyses.",
                      "Gunakan pustaka constitutive model yang lengkap untuk tanah dan batuan dalam semua analisis stabilitas, aliran air tanah, dan tegangan-regangan Anda.")) },
          { h: t("One model, multiple analyses", "Satu model, banyak analisis"),
            body: p(t("Explore complex geotechnical processes using a number of analyses, geometries, and dimensions in a single project file.",
                      "Pelajari proses geoteknik yang kompleks dengan beragam analisis, geometri, dan dimensi dalam satu file proyek.")) },
          { h: t("Insights through visualisation", "Wawasan lewat visualisasi"),
            body: p(t("Graphing and visualisation tools to help you interpret results, compare them to the physical system, and gain deep insights into the problem at hand.",
                      "Alat grafik dan visualisasi membantu Anda menafsirkan hasil, membandingkannya dengan sistem fisik, dan memahami masalah yang dihadapi secara mendalam.")) },
          { h: t("Start simple, add complexity", "Mulai sederhana, tambah kompleksitas"),
            body: p(t("Explore geotechnical systems with multi-analysis and multi-geometry capabilities, and a simple-to-complex iterative workflow to unlock knowledge.",
                      "Pelajari sistem geoteknik dengan kemampuan multi-analisis dan multi-geometri, serta workflow iteratif dari sederhana ke kompleks untuk memperdalam pemahaman.")) },
        ] },
      { t: "cards", eyebrow: t("Product plans", "Paket produk"), h: t("Explore GeoStudio 2D product plans", "Kenali paket produk GeoStudio 2D"), cols: 2,
        items: [
          { img: IMG("Product-info-Geo-2D"), h: "GeoStudio 2D",
            body: p(t("GeoStudio 2D offers the foundational capability to perform limit equilibrium slope stability analysis in soil and rock in two dimensions. With three product plans to choose from, you can address problems that require the consideration of groundwater flow, finite element stresses or pore water pressures, or dynamic stresses.",
                      "GeoStudio 2D menyediakan kemampuan dasar untuk analisis stabilitas lereng limit equilibrium pada tanah dan batuan dalam dua dimensi. Dengan tiga paket produk yang bisa dipilih, Anda dapat menangani masalah yang memperhitungkan aliran air tanah, tegangan atau tekanan air pori dari finite element, maupun tegangan dinamis.")) +
              includes("GeoStudio 2D", "GeoStudio 2D") + SLOPE },
          { img: IMG("Product-info-Geo-2D-Advanced"), h: "GeoStudio 2D Advanced",
            body: p(t("GeoStudio 2D Advanced has the capabilities of the GeoStudio 2D, as well as the ability to simulate steady-state and transient groundwater flow in both saturated and unsaturated soil and rock. GeoStudio 2D Advanced can be used to analyse geotechnical engineering challenges such as rapid drawdown analysis, complex seepage analyses and much more.",
                      "GeoStudio 2D Advanced memiliki semua kemampuan GeoStudio 2D, ditambah kemampuan mensimulasikan aliran air tanah steady-state dan transient pada tanah dan batuan jenuh maupun tak jenuh. GeoStudio 2D Advanced dapat dipakai untuk menganalisis tantangan rekayasa geoteknik seperti analisis rapid drawdown, analisis seepage yang kompleks, dan banyak lagi.")) +
              includes("GeoStudio 2D Advanced", "GeoStudio 2D Advanced") + SEEP + SLOPE },
          { img: IMG("Product-info-Geo-2D-Ultimate"), h: "GeoStudio 2D Ultimate",
            body: p(t("GeoStudio 2D Ultimate expands the capability of GeoStudio 2D Advanced with functionality to analyse static and dynamic stress and deformation within soil or rock including coupled consolidation, finite element stress stability, and the ability to use finite element results in the limit equilibrium analysis.",
                      "GeoStudio 2D Ultimate memperluas kemampuan GeoStudio 2D Advanced dengan fungsi untuk menganalisis tegangan dan deformasi statis maupun dinamis pada tanah atau batuan, termasuk coupled consolidation, stabilitas berbasis tegangan finite element, dan pemakaian hasil finite element dalam analisis limit equilibrium.")) +
              includes("GeoStudio 2D Ultimate", "GeoStudio 2D Ultimate") + QUAKE + SEEP + SIGMA + SLOPE },
          { img: IMG("Geotechnical-Analysis-WorkSuite-2D-1"), h: "Geotechnical Analysis 2D WorkSuite",
            body: p(t("The Geotechnical Analysis 2D WorkSuite includes PLAXIS 2D Ultimate and GeoStudio 2D Ultimate, making it the most comprehensive 2D option.",
                      "Geotechnical Analysis 2D WorkSuite mencakup PLAXIS 2D Ultimate dan GeoStudio 2D Ultimate, sehingga menjadi pilihan 2D yang paling lengkap.")) +
              includes("Geotechnical Analysis 2D WorkSuite", "Geotechnical Analysis 2D WorkSuite") + h4("GeoStudio 2D Ultimate") + h4("PLAXIS 2D Ultimate") },
        ] },
      { t: "table", eyebrow: t("Feature comparison", "Perbandingan fitur"), h: t("Compare GeoStudio 2D features", "Bandingkan fitur GeoStudio 2D"),
        cols: ["", "GeoStudio 2D", "GeoStudio 2D Advanced", "GeoStudio 2D Ultimate"],
        rows: [
          t("Groundwater seepage", "Seepage air tanah"),
          [t("2D cross-section, 2D axisymmetric, and 1D geometry options", "Opsi geometri 2D cross-section, 2D axisymmetric, dan 1D"), 1, 1, 1],
          [t("Convenient initial pore water pressure condition definition", "Definisi kondisi awal tekanan air pori yang praktis"), 1, 1, 1],
          [t("Estimation routines for defining hydraulic functions", "Rutin estimasi untuk mendefinisikan fungsi hidrolik"), 0, 1, 1],
          [t("Hydraulic boundary conditions, including specialised boundary conditions for soil-atmosphere coupling", "Boundary condition hidrolik, termasuk boundary condition khusus untuk soil-atmosphere coupling"), 0, 1, 1],
          [t("Results graphing and visualisation options, including isosurfaces and contouring", "Opsi grafik dan visualisasi hasil, termasuk isosurface dan contouring"), 1, 1, 1],
          [t("Saturated/Unsaturated steady-state or transient groundwater flow", "Aliran air tanah steady-state atau transient pada kondisi jenuh/tak jenuh"), 0, 1, 1],
          [t("Under-relaxation and convergence strategies for pore water pressure computation", "Strategi under-relaxation dan konvergensi untuk perhitungan tekanan air pori"), 0, 1, 1],
          t("Slope stability", "Stabilitas lereng"),
          [t("Comprehensive material model library for soil and rock", "Pustaka model material yang lengkap untuk tanah dan batuan"), 1, 1, 1],
          [t("Extensive limit equilibrium methods including Morgenstern-Price and Spencer", "Beragam metode limit equilibrium, termasuk Morgenstern-Price dan Spencer"), 1, 1, 1],
          [t("Fault systems via weak and anisotropic surface definition", "Sistem sesar melalui definisi weak surface dan anisotropic surface"), 1, 1, 1],
          [t("Finite element stress-based stability analysis", "Analisis stabilitas berbasis tegangan finite element"), 0, 0, 1],
          [t("Full range of slip surface search and optimisation techniques", "Teknik pencarian dan optimasi slip surface yang lengkap"), 1, 1, 1],
          [t("Newmark deformation stability analysis", "Analisis stabilitas deformasi Newmark"), 0, 0, 1],
          [t("Partial factor analysis capabilities including limit state design support", "Kemampuan analisis partial factor, termasuk dukungan limit state design"), 1, 1, 1],
          [t("Pore water pressure definition using piezometric lines, spatial functions, Ru, and B-bar", "Definisi tekanan air pori dengan garis piezometrik, spatial function, Ru, dan B-bar"), 1, 1, 1],
          [t("Pore water pressure definition with finite element seepage analysis", "Definisi tekanan air pori dengan analisis seepage finite element"), 0, 1, 1],
          [t("Probabilistic and sensitivity analysis capabilities", "Kemampuan analisis probabilistik dan sensitivitas"), 1, 1, 1],
          [t("Reinforcement definition options including vendor reinforcement library", "Opsi definisi perkuatan, termasuk pustaka perkuatan dari vendor"), 1, 1, 1],
          [t("Rigorous limit equilibrium slope stability formulation", "Formulasi stabilitas lereng limit equilibrium yang rigorous"), 1, 1, 1],
          [t("Staged pseudo static formulation", "Formulasi pseudo static bertahap"), 1, 1, 1],
          [t("Staged rapid drawdown functionality", "Fungsi rapid drawdown bertahap"), 1, 1, 1],
          [t("Surcharge and seismic load functionality", "Fungsi beban surcharge dan seismik"), 1, 1, 1],
          t("Static and dynamic stresses", "Tegangan statis dan dinamis"),
          [t("Complete range of stress and deformation boundary conditions", "Boundary condition tegangan dan deformasi yang lengkap"), 0, 0, 1],
          [t("Comprehensive stress-strain constitutive model list, including non-linear soil and rock material models", "Daftar constitutive model tegangan-regangan yang lengkap, termasuk model material tanah dan batuan non-linear"), 0, 0, 1],
          [t("Coupled stress and pore water pressure formulation for consolidation analysis", "Formulasi coupled tegangan dan tekanan air pori untuk analisis konsolidasi"), 0, 0, 1],
          [t("Dynamic and static stress analyses to model post-earthquake deformation and excess pore water pressures dissipation", "Analisis tegangan dinamis dan statis untuk memodelkan deformasi pasca-gempa dan disipasi excess pore water pressure"), 0, 0, 1],
          [t("Incremental stress-strain formulation", "Formulasi tegangan-regangan inkremental"), 0, 0, 1],
          [t("Multiple options for In situ stress definition, including gravity activation, K0 procedure, and field stresses", "Beragam opsi definisi tegangan in situ, termasuk gravity activation, prosedur K0, dan field stress"), 0, 0, 1],
          [t("Stress redistribution analysis", "Analisis redistribusi tegangan"), 0, 0, 1],
          [t("Stress-update algorithm for handling non-linear material models", "Algoritma stress-update untuk menangani model material non-linear"), 0, 0, 1],
          [t("Structural element library for modelling reinforcement, retaining walls and more", "Pustaka elemen struktur untuk memodelkan perkuatan, dinding penahan tanah, dan lainnya"), 0, 0, 1],
          [t("Unloading/loading stress analysis with straightforward construction sequence simulation", "Analisis tegangan unloading/loading dengan simulasi urutan konstruksi yang mudah"), 0, 0, 1],
        ] },
      { t: "band", bg: IMG("GeoStudio-MWL-image@2x"),
        h: t("GeoStudio has over 40 years’ experience in enabling geotechnical analysis in research and industry.", "GeoStudio telah lebih dari 40 tahun mendukung analisis geoteknik di dunia riset dan industri."),
        links: [["wa:sales", t("Contact sales", "Hubungi sales")]] },
    ],
  };
};
