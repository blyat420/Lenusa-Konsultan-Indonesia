/* Imago, rebuilt from https://www.seequent.com/products-solutions/imago/ (fetched 11 Nov 2026).
   Left out on purpose: hero "Try it now"/"Sign in" buttons, pricing lines, customer quote, "Imago at work", free training.
   Loaded by script.js (PAGE_FILES) only on software-details.html?id=imago. t(en, id) picks the language. */
(window.SoftwarePages = window.SoftwarePages || {})["imago"] = (t, { ul, p, h3, h4 }) => {
  const IMG = (n) => `assets/images/software/seequent/imago/${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.webp`;
  const plan = (en, id, type, feats) =>
    ({ h: en, body: p(type) + h4(t("Features:", "Fitur:")) + ul(...feats) });
  const sub12 = t("12 month subscription. Additional mine sites require separate Imago subscriptions.", "Langganan 12 bulan. Setiap mine site tambahan memerlukan langganan Imago tersendiri.");
  const single = t("Single workspace", "Satu workspace");
  const users = t("Unlimited users", "Pengguna tanpa batas");
  const camera = t("Capture images from camera", "Ambil gambar langsung dari kamera");
  const integ = t("Integrate with other applications", "Integrasi dengan aplikasi lain");
  const api = t("API Data access", "Akses data lewat API");
  return {
    blocks: [
      { t: "hero",
        h1: "Imago",
        body: p(t("Geological core imagery collection, logging, and management software", "Software untuk pengambilan, logging, dan pengelolaan citra core geologi")),
        img: IMG("Imago-Image-Analysis") },
      { t: "split", img: IMG("Imago-Platform-Overview"), rev: 1,
        h: t("Preserve critical insights and validate decisions faster", "Simpan wawasan penting dan validasi keputusan lebih cepat"),
        body: p(t("Streamline capturing and managing core imagery. Imago automatically crops, catalogues, and syncs after capturing images in the core shed. This data can be easily accessed or integrated with modelling tools such as Leapfrog to instantly validate decisions by placing imagery alongside data and models.",
                  "Permudah pengambilan dan pengelolaan citra core. Setelah gambar diambil di core shed, Imago otomatis melakukan crop, katalog, dan sinkronisasi. Data ini mudah diakses atau diintegrasikan dengan software pemodelan seperti Leapfrog, sehingga keputusan bisa langsung divalidasi dengan menempatkan citra berdampingan dengan data dan model.")) },
      { t: "cards", eyebrow: t("Key benefits", "Manfaat utama"), h: t("Quality across your entire workflow", "Kualitas di seluruh workflow Anda"), cols: 3,
        items: [
          { h: t("Use machine learning technology", "Manfaatkan teknologi machine learning"),
            body: p(t("Automatically measure RQD and capture consistent colour data from every core photo with Image Analysis. Remove subjectivity from your most critical assessments.",
                      "Ukur RQD secara otomatis dan dapatkan data warna yang konsisten dari setiap foto core dengan Image Analysis. Hilangkan subjektivitas dari penilaian Anda yang paling penting.")) },
          { h: t("Increase your efficiency", "Tingkatkan efisiensi"),
            body: p(t("From the field to the office, Imago helps teams spend more time on modelling and analysis than core image documentation and capture.",
                      "Dari lapangan hingga kantor, Imago membantu tim mencurahkan lebih banyak waktu untuk pemodelan dan analisis, bukan untuk dokumentasi dan pengambilan citra core.")) },
          { h: t("Simplify quality control", "Sederhanakan quality control"),
            body: p(t("Verify data and control errors or anomalies in assay and logs using catalogued images rather than needing to manually recall core samples.",
                      "Verifikasi data serta kendalikan kesalahan atau anomali pada assay dan log menggunakan citra yang sudah terkatalog, tanpa perlu mengambil ulang sampel core secara manual.")) },
          { h: t("Protect your investment", "Lindungi investasi Anda"),
            body: p(t("Every metre drilled is expensive. Catalogue your core and protect your investment against degradation, damage, or loss.",
                      "Setiap meter pengeboran itu mahal. Katalogkan core Anda dan lindungi investasi dari degradasi, kerusakan, atau kehilangan.")) },
          { h: t("Give data access", "Berikan akses data"),
            body: p(t("Share remote access with external contractors, exploration managers, and collaborators with Imago's cloud hosted data.",
                      "Bagikan akses jarak jauh kepada kontraktor eksternal, manajer eksplorasi, dan kolaborator melalui data Imago yang di-host di cloud.")) },
          { h: t("Make comprehensive decisions", "Ambil keputusan yang menyeluruh"),
            body: p(t("Integrate core imagery and AI analysis into Leapfrog, MX Deposit, Oasis montaj, and more. Validate your decisions across the drilling lifecycle.",
                      "Integrasikan citra core dan analisis AI ke Leapfrog, MX Deposit, Oasis montaj, dan lainnya. Validasi keputusan Anda di sepanjang siklus pengeboran.")) },
        ] },
      { t: "split", img: IMG("Features-and-Capabilities-v2"), eyebrow: t("Product plans", "Paket produk"),
        h: t("Explore Imago’s features and capabilities", "Kenali fitur dan kemampuan Imago"),
        body: h3("Imago") +
          p(t("Imago is a cloud-based platform for cataloguing and managing your core imagery. Centralise your libraries, share data with stakeholders, and validate your decisions.",
              "Imago adalah platform berbasis cloud untuk mengkatalogkan dan mengelola citra core Anda. Pusatkan library, bagikan data kepada pemangku kepentingan, dan validasi keputusan Anda.")) +
          h4(t("Imago includes the following:", "Imago mencakup:")) +
          h4(t("AI image analysis", "AI image analysis")) +
          p(t("Geoscience-specific machine learning for calculating RQD, colour analysis, depth mapping, AutoCropping core-boxes, and linearization.",
              "Machine learning khusus geosains untuk menghitung RQD, analisis warna, depth mapping, AutoCropping core box, dan linearization.")) +
          h4("Capture X") +
          p(t("Imago Capture X manages your image capture workflows by controlling your camera and automatically labelling, cropping, and storing your images.",
              "Imago Capture X mengelola workflow pengambilan gambar dengan mengendalikan kamera serta otomatis memberi label, crop, dan menyimpan gambar Anda.")) +
          h4("Imago connect") +
          p(t("Imago Connect is a connectivity toolkit for streamlining image management and integrations. Additions include export workflows and program interoperability for automation and batch operations.",
              "Imago Connect adalah toolkit konektivitas untuk merampingkan pengelolaan gambar dan integrasi. Tambahannya meliputi workflow ekspor dan interoperabilitas program untuk otomasi dan operasi batch.")) },
      { t: "cards", eyebrow: t("Subscriptions", "Langganan"), h: t("Imago Portal plans", "Paket Imago Portal"), cols: 3,
        items: [
          plan("Standard", "Standard", sub12, [single, users, camera, integ, t("3TB storage", "Penyimpanan 3TB"), api]),
          plan("Enterprise", "Enterprise", sub12, [t("Multiple workspaces", "Banyak workspace"), users, camera, integ,
            t("Additional storage options", "Opsi penyimpanan tambahan"), "Single sign-on", t("User group management", "Pengelolaan grup pengguna"),
            t("Workspace organisation tools", "Alat pengaturan workspace"), t("6TB shared storage", "Penyimpanan bersama 6TB"), api]),
          plan("Junior", "Junior", t("12 month subscription. For non-producing companies or academic licensing only.", "Langganan 12 bulan. Khusus untuk perusahaan yang belum berproduksi atau lisensi akademik."),
            [single, users, camera, integ, t("500 GB storage", "Penyimpanan 500 GB"), api]),
        ] },
      { t: "cards", h: t("Imago Add-ons", "Add-on Imago"), cols: 3,
        intro: p(t("All add-ons require an Imago subscription to purchase and run", "Semua add-on memerlukan langganan Imago untuk dibeli dan dijalankan")),
        items: [
          { h: "Chip shot", body: p(sub12, t("Controls your camera in Capture X and capture RC chips in 2-5 compartment chip trays.", "Mengendalikan kamera di Capture X dan mengambil gambar RC chip pada chip tray 2 hingga 5 kompartemen.")) },
          { h: "Mobile Capture X", body: p(sub12, t("Smartphone workflows to capture geoscience imagery from the field into Imago.", "Workflow smartphone untuk mengambil citra geosains dari lapangan langsung ke Imago.")) },
          { h: t("Storage", "Penyimpanan"), body: p(sub12, t("Purchase more storage in 1TB increments for your Imago Portal.", "Tambah kapasitas penyimpanan Imago Portal dalam kelipatan 1TB.")) },
        ] },
      { t: "band", bg: IMG("shutterstock_2128256828-1-scaled"),
        h: t("Imago is changing the way that data management is done in mining projects", "Imago mengubah cara pengelolaan data dalam proyek tambang"),
        links: [["wa:sales", t("Contact sales", "Hubungi sales")], ["wa:trial", t("Request a trial", "Minta trial")]] },
    ],
  };
};
