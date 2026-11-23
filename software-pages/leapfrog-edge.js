/* Leapfrog Edge, rebuilt from https://www.seequent.com/products-solutions/leapfrog-edge/ (fetched 11 Nov 2026).
   Left out on purpose: demo buttons, "Leapfrog Edge pricing", "Leapfrog Edge at Work", free training.
   Loaded by script.js (PAGE_FILES) only on software-details.html?id=leapfrog-edge. t(en, id) picks the language. */
(window.SoftwarePages = window.SoftwarePages || {})["leapfrog-edge"] = (t, { p }) => {
  const IMG = (n) => `assets/images/software/seequent/leapfrog-edge/${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.webp`;
  return {
    blocks: [
      { t: "hero",
        h1: "Leapfrog Edge",
        body: p(t("Geostatistical resource estimation software built around variogram analysis", "Software estimasi sumber daya geostatistik yang dibangun di sekitar analisis variogram")),
        img: IMG("Micro3-2-scaled") },
      { t: "video", h: t("Intuitive, visual, and seamlessly integrated geostatistics", "Geostatistik yang intuitif, visual, dan terintegrasi mulus"),
        intro: p(t("Leapfrog Edge puts the power of geostatistical modelling directly in users’ hands, transforming resource estimation into an intuitive, visual, and seamlessly connected workflow. Unlike traditional expert-driven tools, Edge integrates estimation with geological modelling, enabling greater clarity, streamlined collaboration between geologists and resource estimators, and confident decision-making at every step.",
                   "Leapfrog Edge menempatkan kemampuan pemodelan geostatistik langsung di tangan pengguna, sehingga estimasi sumber daya menjadi workflow yang intuitif, visual, dan saling terhubung. Berbeda dengan alat tradisional yang bergantung pada pakar, Edge menyatukan estimasi dengan pemodelan geologi, sehingga hasilnya lebih jelas, kolaborasi antara geolog dan resource estimator lebih lancar, dan setiap keputusan diambil dengan yakin.")),
        uuid: "1TRYHPhhadPKrHo7Kog6j9", thumb: IMG("1TRYHPhhadPKrHo7Kog6j9") },
      { t: "cards", eyebrow: t("Key benefits", "Manfaat utama"), h: t("Make confident resource estimations", "Buat estimasi sumber daya dengan yakin"), cols: 3,
        items: [
          { h: t("Consistent workflows", "Workflow yang konsisten"),
            body: p(t("Geological interpretations from Leapfrog Geo flow naturally into estimation through seamless integration and dynamic updating. Collaborate and iterate with confidence, using the latest models and interpretations.",
                      "Interpretasi geologi dari Leapfrog Geo mengalir langsung ke estimasi melalui integrasi yang mulus dan pembaruan dinamis. Berkolaborasi dan beriterasi dengan yakin memakai model dan interpretasi terbaru.")) },
          { h: t("Clear insights, confident decisions", "Wawasan jelas, keputusan yakin"),
            body: p(t("Compelling 2D and 3D visualisation makes it easy to analyse structural trends, grade patterns, and anomalies. Tools like 3D variogram modelling and graph highlighting help build confidence in your estimation parameters.",
                      "Visualisasi 2D dan 3D yang kuat memudahkan analisis structural trend, pola kadar, dan anomali. Alat seperti pemodelan variogram 3D dan graph highlighting membantu Anda yakin dengan parameter estimasi.")) },
          { h: t("Faster upskilling", "Peningkatan keterampilan lebih cepat"),
            body: p(t("Built on the same intuitive interface as Leapfrog Geo, it’s easy to learn, helping teams upskill quickly and contribute to resource modelling projects faster.",
                      "Dibangun di atas antarmuka intuitif yang sama dengan Leapfrog Geo, sehingga mudah dipelajari. Tim dapat cepat meningkatkan keterampilan dan lebih cepat berkontribusi pada proyek pemodelan sumber daya.")) },
          { h: t("Estimations tailored to your deposit", "Estimasi yang sesuai dengan endapan Anda"),
            body: p(t("Choose from a range of estimation methods: kriging, inverse distance and RBF. Use powerful interrogation for visual assessment of search neighborhood choices.",
                      "Pilih dari beragam metode estimasi: kriging, inverse distance, dan RBF. Gunakan fitur interogasi yang andal untuk menilai pilihan search neighbourhood secara visual.")) },
          { h: t("Simplified block modelling", "Block modelling yang lebih sederhana"),
            body: p(t("Streamline block model workflows with easy incorporation of 3D geology, sub-blocking and variable orientation and rapid scenario testing. Integration with BlockSync improves efficiency and supports robust, reliable estimates.",
                      "Sederhanakan workflow block model dengan memasukkan geologi 3D, sub-blocking, dan variable orientation secara mudah, serta pengujian skenario yang cepat. Integrasi dengan BlockSync meningkatkan efisiensi dan mendukung estimasi yang andal.")) },
          { h: t("Transparent, auditable reporting", "Pelaporan yang transparan dan dapat diaudit"),
            body: p(t("All estimation parameter changes are automatically tracked in a parameter report with an audit log. Export to Excel to support compliance and stakeholder trust, without extra admin.",
                      "Semua perubahan parameter estimasi tercatat otomatis dalam parameter report dengan audit log. Ekspor ke Excel untuk mendukung kepatuhan dan kepercayaan pemangku kepentingan, tanpa pekerjaan administrasi tambahan.")) },
        ] },
      { t: "band", bg: IMG("shutterstock_2282658833-1-scaled"),
        h: t("Generate more value from your geological data with Leapfrog Edge", "Dapatkan nilai lebih dari data geologi Anda dengan Leapfrog Edge"),
        links: [["wa:sales", t("Contact sales", "Hubungi sales")]] },
    ],
  };
};
