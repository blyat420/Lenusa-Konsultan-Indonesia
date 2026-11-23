/* MX Deposit, rebuilt from https://www.seequent.com/products-solutions/mx-deposit/ (fetched 13 Nov 2026).
   Left out on purpose: demo and trial buttons, prices, reviews, related products, "build your skills", free training and support.
   Loaded by script.js (PAGE_FILES) only on software-details.html?id=mx-deposit. t(en, id) picks the language. */
(window.SoftwarePages = window.SoftwarePages || {})["mx-deposit"] = (t, { ul, p, h3, h4 }) => {
  const IMG = (n) => `assets/images/software/seequent/mx-deposit/${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.webp`;
  const plan = (h, type, feats) => ({ h, body: p(type) + h4(t("Features:", "Fitur:")) + ul(...feats) });
  const sub12 = t("12 month named licence.", "Lisensi named 12 bulan.");
  const app = t("Android and iOS app", "Aplikasi Android dan iOS");
  const api = t("API and integrations for third-party export", "API dan integrasi untuk ekspor ke pihak ketiga");
  const imp = t("Data import, entry, and modification", "Impor, input, dan perubahan data");
  const exp = t("File and data export", "Ekspor file dan data");
  const rep = t("Project summaries and reports", "Ringkasan proyek dan laporan");
  const feed = t("Activity feed", "Activity feed");
  const adm = t("Admin privileges and system configuration", "Hak admin dan konfigurasi sistem");
  return {
    blocks: [
      { t: "hero",
        h1: "MX Deposit",
        body: p(t("Core logging and drillhole data management software for exploration teams", "Software logging core dan manajemen data lubang bor untuk tim eksplorasi")),
        img: IMG("MX-Deposit-Hero") },
      { t: "split", img: IMG("MX-Deposit-Mineralisation-Striplog"), rev: 1,
        h: t("One database for drillhole and point-sample data", "Satu database untuk data lubang bor dan sampel titik"),
        body: p(t("MX Deposit is a cloud database for collecting, managing, and sharing drillhole and point-sample data. It takes data from several sources and checks it with dynamic logging and built-in validation. Well, open hole, drill core, and geology logging run in one standard workflow, from the first drill program to long-term mining.",
                  "MX Deposit adalah database cloud untuk mengumpulkan, mengelola, dan membagikan data lubang bor dan sampel titik. Data dari berbagai sumber diterima, lalu diperiksa lewat dynamic logging dan validasi bawaan. Logging sumur, open hole, core, dan geologi berjalan dalam satu alur standar, dari program pengeboran pertama sampai penambangan jangka panjang.")) },
      { t: "cards", eyebrow: t("Key benefits", "Manfaat utama"), h: t("Collaboration and efficiency across your modelling workflows", "Kolaborasi dan efisiensi di seluruh workflow pemodelan Anda"), cols: 3,
        items: [
          { h: t("Lower your costs", "Tekan biaya"),
            body: p(t("Licensing is flexible and scalable, with no setup, hardware, or consultancy costs. Drilling and mining data sit in one environment, so there is less duplication.",
                      "Lisensi fleksibel dan bisa disesuaikan skalanya, tanpa biaya setup, perangkat keras, atau konsultan. Data pengeboran dan penambangan berada di satu lingkungan, sehingga pekerjaan ganda berkurang.")) },
          { h: t("Work without limits", "Bekerja tanpa batas"),
            body: p(t("The number of projects is not capped. Data and models grow with operations, and large datasets keep their performance.",
                      "Jumlah proyek tidak dibatasi. Data dan model ikut tumbuh bersama operasi, dan dataset besar tetap berjalan lancar.")) },
          { h: t("Increase your efficiency", "Tingkatkan efisiensi"),
            body: p(t("Drillhole, well, and mining data are centralised. Core and open hole logging share one workflow, with specialised tools that produce complete, auditable logs.",
                      "Data lubang bor, sumur, dan tambang dipusatkan. Logging core dan open hole memakai satu workflow, dengan alat khusus yang menghasilkan log lengkap dan bisa diaudit.")) },
          { h: t("Rely on trusted data", "Andalkan data tepercaya"),
            body: p(t("A system of record, an audit trail, and standard logging tools give consistent, defensible data from exploration through production.",
                      "Sistem pencatatan, audit trail, dan alat logging standar menghasilkan data yang konsisten dan bisa dipertanggungjawabkan, dari eksplorasi sampai produksi.")) },
          { h: t("Work from anywhere", "Bekerja dari mana saja"),
            body: p(t("Every team shares one data source, wherever they are. Online and offline logging lets crews record core, geology, and well data next to the rig.",
                      "Semua tim memakai satu sumber data di mana pun lokasinya. Logging online dan offline memungkinkan kru mencatat data core, geologi, dan sumur langsung di dekat rig.")) },
          { h: t("Collaborate in real time", "Berkolaborasi secara real time"),
            body: p(t("Changes to data, images, or comments on drillholes, samples, tables, and records show up for everyone at once.",
                      "Perubahan data, gambar, atau komentar pada lubang bor, sampel, tabel, dan record langsung terlihat oleh semua orang.")) },
        ] },
      { t: "split", img: IMG("How-MX-Deposit-Works"), eyebrow: t("Product information", "Informasi produk"),
        h: t("How MX Deposit works", "Cara kerja MX Deposit"),
        body: p(t("During exploration, teams log field and drillhole data online or offline across core, open hole, well, and geology workflows. In production, the data sources of several teams stay in one place. In remediation, the platform supports risk mitigation, compliance reporting, and a complete record.",
                  "Pada tahap eksplorasi, tim mencatat data lapangan dan lubang bor secara online maupun offline untuk workflow core, open hole, sumur, dan geologi. Pada tahap produksi, sumber data beberapa tim tetap berada di satu tempat. Pada tahap remediasi, platform ini mendukung mitigasi risiko, pelaporan kepatuhan, dan rekam jejak yang lengkap.")) +
          h3(t("Assays and QAQC management", "Manajemen assay dan QAQC")) +
          p(t("Ongoing quality control and reporting for analytical results. Results are checked against established methods and certified benchmarks before they feed downstream processing and resource modelling.",
              "Kontrol kualitas dan pelaporan hasil analisis berjalan terus. Hasil dicek terhadap metode baku dan benchmark bersertifikat sebelum masuk ke pemrosesan dan pemodelan sumber daya.")) +
          h3(t("Mobile logging app", "Aplikasi logging mobile")) +
          p(t("Android and iOS apps support online and offline logging, with several data tabs open at once. The Android app accepts physical keyboards offline, so logging at the rig feels like working on a laptop.",
              "Aplikasi Android dan iOS mendukung logging online dan offline, dengan beberapa tab data terbuka sekaligus. Aplikasi Android menerima keyboard fisik secara offline, jadi logging di rig terasa seperti bekerja di laptop.")) +
          h3("MX Deposit Portal") +
          p(t("The web hub for logging, managing, viewing, and connecting drillhole and sample data. Set up a new instance quickly, create tables and validation rules, run calculations at scale, manage user and joint-venture access, and follow a news feed, all in an auditable environment.",
              "Hub web untuk logging, mengelola, melihat, dan menghubungkan data lubang bor dan sampel. Instance baru bisa disiapkan dengan cepat, lengkap dengan tabel dan aturan validasi, perhitungan skala besar, pengaturan akses pengguna dan joint venture, serta news feed, semuanya dalam lingkungan yang bisa diaudit.")) },
      { t: "cards", eyebrow: t("Subscriptions", "Langganan"), h: t("MX Deposit plans", "Paket MX Deposit"), cols: 4,
        intro: p(t("A named licence gives one dedicated user unlimited use for the subscription period. Shared and enterprise licences are arranged through Lenusa.",
                   "Lisensi named memberi satu pengguna khusus akses tanpa batas selama masa langganan. Lisensi shared dan enterprise diatur lewat Lenusa.")),
        items: [
          plan("Standard User", sub12, [t("Single user account", "Satu akun pengguna"), adm, imp, exp, rep, api, app, feed]),
          plan("Shift User", sub12, [t("Two user accounts with a shared login, not used at the same time", "Dua akun pengguna dengan login bersama, tidak dipakai bersamaan"), adm, imp, exp, rep, api, app, feed]),
          plan("Reviewer", sub12, [t("Single read-only user", "Satu pengguna read-only"), exp, rep, api, app, feed]),
          { h: "Enterprise", body: p(t("Shared licences let any number of users work over the subscription period, one user per seat at a time. Terms are agreed with Lenusa.", "Lisensi shared memungkinkan pengguna dalam jumlah berapa pun bekerja selama masa langganan, satu pengguna per seat dalam satu waktu. Ketentuan disepakati bersama Lenusa.")) },
        ] },
    ],
  };
};
