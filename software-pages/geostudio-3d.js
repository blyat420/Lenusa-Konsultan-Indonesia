/* GeoStudio 3D, rebuilt from https://www.seequent.com/products-solutions/geostudio-3d/ (fetched 11 Nov 2026).
   Left out on purpose: demo buttons, pricing plans, "GeoStudio live in action", free training and support.
   Loaded by script.js (PAGE_FILES) only on software-details.html?id=geostudio-3d. t(en, id) picks the language. */
(window.SoftwarePages = window.SoftwarePages || {})["geostudio-3d"] = (t, { p, h4 }) => {
  const IMG = (n) => `assets/images/software/seequent/geostudio-3d/${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.webp`;
  const includes = (name) => p(t(`<strong>${name} includes the following:</strong>`, `<strong>${name} mencakup:</strong>`));
  const SLOPE = h4("SLOPE3D") + p(t("SLOPE3D expands on limit equilibrium capabilities by offering a practical yet sophisticated approach for capturing 3D slope failure mechanisms in both soil and rock, given a variety of slip surface shapes, pore water pressure conditions and soil properties.",
    "SLOPE3D memperluas kemampuan limit equilibrium dengan pendekatan yang praktis namun canggih untuk menangkap mekanisme keruntuhan lereng 3D pada tanah dan batuan, untuk berbagai bentuk slip surface, kondisi tekanan air pori, dan sifat tanah."));
  const SEEP = h4("SEEP3D") + p(t("SEEP3D is a powerful finite element software product for modelling 3D groundwater flow in porous media. SEEP3D can model simple saturated steady-state problems or sophisticated saturated / unsaturated transient analyses using the same comprehensive set of material models and boundary conditions as SEEP/W.",
    "SEEP3D adalah software finite element yang andal untuk memodelkan aliran air tanah 3D di media berpori. SEEP3D dapat memodelkan masalah steady-state jenuh yang sederhana hingga analisis transient jenuh/tak jenuh yang canggih, dengan rangkaian model material dan boundary condition yang sama lengkapnya dengan SEEP/W."));
  return {
    blocks: [
      { t: "hero", h1: "GeoStudio 3D",
        body: p(t("3D slope stability analysis software for complex geotechnical conditions", "Software analisis stabilitas lereng 3D untuk kondisi geoteknik yang kompleks")),
        img: IMG("GeoStudio-3D-Hero") },
      { t: "split", img: IMG("5f9891730306e4b49adad47073a27168"), rev: 1,
        h: t("A comprehensive solution for geotechnical project analysis", "Solusi lengkap untuk analisis proyek geoteknik"),
        body: p(t("GeoStudio 3D offers a range of numerical analysis tools for simulating conditions at and below the ground surface. From natural soil and rock slopes, to dewatering systems or tailings storage facilities, you can use GeoStudio 3D to model the conditions you need for better insights into your geotechnical projects.",
                  "GeoStudio 3D menyediakan beragam alat analisis numerik untuk mensimulasikan kondisi di permukaan dan bawah permukaan tanah. Mulai dari lereng tanah dan batuan alami hingga sistem dewatering atau fasilitas penyimpanan tailing, GeoStudio 3D dapat memodelkan kondisi yang Anda butuhkan untuk pemahaman yang lebih baik atas proyek geoteknik Anda.")) },
      { t: "cards", eyebrow: t("Key benefits", "Manfaat utama"), h: t("Confidently simulate surface and subsurface conditions in 3D", "Simulasikan kondisi permukaan dan bawah permukaan dalam 3D dengan yakin"), cols: 3,
        items: [
          { h: t("Collaborate seamlessly", "Kolaborasi tanpa hambatan"),
            body: p(t("Leverage the power of the Seequent portfolio, including Leapfrog, to share geometry and materials via a seamless cloud-based workflow.",
                      "Manfaatkan portofolio Seequent, termasuk Leapfrog, untuk berbagi geometri dan material melalui workflow berbasis cloud yang mulus.")) },
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
      { t: "cards", eyebrow: t("Product plans", "Paket produk"), h: t("Explore GeoStudio 3D product plans", "Kenali paket produk GeoStudio 3D"), cols: 3,
        items: [
          { img: IMG("GeoStudio-3D"), h: "GeoStudio 3D",
            body: p(t("GeoStudio 3D offers the foundational capability to perform limit equilibrium slope stability analysis for soil and rock in three dimensions. With two product plans to choose from, you can also address steady-state and transient groundwater flow in both saturated and unsaturated soil and rock.",
                      "GeoStudio 3D menyediakan kemampuan dasar untuk analisis stabilitas lereng limit equilibrium pada tanah dan batuan dalam tiga dimensi. Dengan dua paket produk yang bisa dipilih, Anda juga dapat menangani aliran air tanah steady-state dan transient pada tanah dan batuan jenuh maupun tak jenuh.")) +
              includes("GeoStudio 3D") + SLOPE },
          { img: IMG("GeoStudio-3D-Advanced-1"), h: "GeoStudio 3D Advanced",
            body: p(t("GeoStudio 3D Advanced provides the ability to simulate steady-state and transient groundwater flow in both saturated and unsaturated soil and rock. It can be used to analyse geotechnical engineering challenges across the value chain and to analyse conditions using pore water pressures directly in the 3D stability analysis.",
                      "GeoStudio 3D Advanced memberi kemampuan mensimulasikan aliran air tanah steady-state dan transient pada tanah dan batuan jenuh maupun tak jenuh. Paket ini dapat dipakai untuk menganalisis tantangan rekayasa geoteknik di seluruh rantai nilai, serta menganalisis kondisi dengan memakai tekanan air pori langsung dalam analisis stabilitas 3D.")) +
              includes("GeoStudio 3D Advanced") + SEEP + SLOPE },
          { img: IMG("Geotechnical-Analysis-WorkSuite-3D-1"), h: "Geotechnical Analysis 3D WorkSuite",
            body: p(t("The Geotechnical Analysis 3D WorkSuite includes PLAXIS 3D Ultimate and GeoStudio 3D Advanced, making it the most comprehensive 3D option.",
                      "Geotechnical Analysis 3D WorkSuite mencakup PLAXIS 3D Ultimate dan GeoStudio 3D Advanced, sehingga menjadi pilihan 3D yang paling lengkap.")) +
              includes("Geotechnical Analysis 3D WorkSuite") + h4("GeoStudio 3D Advanced") + h4("PLAXIS 3D Ultimate") },
        ] },
      { t: "table", eyebrow: t("Feature comparison", "Perbandingan fitur"), h: t("Compare GeoStudio 3D features", "Bandingkan fitur GeoStudio 3D"),
        cols: ["", "GeoStudio 3D", "GeoStudio 3D Advanced"],
        rows: [
          t("Groundwater seepage", "Seepage air tanah"),
          [t("3D cross-section, 3D axisymmetric, and 2D geometry options", "Opsi geometri 3D cross-section, 3D axisymmetric, dan 2D"), 1, 1],
          [t("Convenient initial pore water pressure condition definition", "Definisi kondisi awal tekanan air pori yang praktis"), 1, 1],
          [t("Estimation routines for defining hydraulic functions", "Rutin estimasi untuk mendefinisikan fungsi hidrolik"), 0, 1],
          [t("Results graphing and visualisation options, including isosurfaces and contouring", "Opsi grafik dan visualisasi hasil, termasuk isosurface dan contouring"), 1, 1],
          [t("Saturated/Unsaturated steady-state or transient groundwater flow", "Aliran air tanah steady-state atau transient pada kondisi jenuh/tak jenuh"), 0, 1],
          [t("Under-relaxation and convergence strategies for pore water pressure computation", "Strategi under-relaxation dan konvergensi untuk perhitungan tekanan air pori"), 0, 1],
          t("Slope stability", "Stabilitas lereng"),
          [t("Comprehensive material model library for soil and rock", "Pustaka model material yang lengkap untuk tanah dan batuan"), 1, 1],
          [t("Extensive limit equilibrium methods including Morgenstern-Price and Spencer", "Beragam metode limit equilibrium, termasuk Morgenstern-Price dan Spencer"), 1, 1],
          [t("Fault systems via weak and anisotropic surface definition", "Sistem sesar melalui definisi weak surface dan anisotropic surface"), 1, 1],
          [t("Full range of slip surface search and optimisation techniques", "Teknik pencarian dan optimasi slip surface yang lengkap"), 1, 1],
          [t("Partial factor analysis capabilities including limit state design support", "Kemampuan analisis partial factor, termasuk dukungan limit state design"), 1, 1],
          [t("Pore water pressure definition using piezometric lines, spatial functions, Ru, and B-bar", "Definisi tekanan air pori dengan garis piezometrik, spatial function, Ru, dan B-bar"), 1, 1],
          [t("Pore water pressure definition with finite element seepage analysis", "Definisi tekanan air pori dengan analisis seepage finite element"), 0, 1],
          [t("Probabilistic and sensitivity analysis capabilities", "Kemampuan analisis probabilistik dan sensitivitas"), 1, 1],
          [t("Reinforcement definition for anchors, piles, and soil nailing", "Definisi perkuatan untuk angkur, tiang, dan soil nailing"), 1, 1],
          [t("Results graphing and visualisation options, including isosurfaces and contouring", "Opsi grafik dan visualisasi hasil, termasuk isosurface dan contouring"), 1, 1],
          [t("Rigorous limit equilibrium slope stability formulation", "Formulasi stabilitas lereng limit equilibrium yang rigorous"), 1, 1],
          [t("Surcharge and seismic load functionality", "Fungsi beban surcharge dan seismik"), 1, 1],
        ] },
      { t: "band", bg: IMG("GeoStudio-3D-contact-MQL-scaled"),
        h: t("GeoStudio has over 40 years’ experience in enabling geotechnical analysis in research and industry.", "GeoStudio telah lebih dari 40 tahun mendukung analisis geoteknik di dunia riset dan industri."),
        links: [["wa:sales", t("Contact sales", "Hubungi sales")]] },
    ],
  };
};
