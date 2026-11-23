/* Leapfrog Energy, rebuilt from https://www.seequent.com/products-solutions/leapfrog-energy/ (fetched 11 Nov 2026).
   Left out on purpose: demo buttons, prices, "Leapfrog Energy in action", free training.
   Loaded by script.js (PAGE_FILES) only on software-details.html?id=leapfrog-energy. t(en, id) picks the language. */
(window.SoftwarePages = window.SoftwarePages || {})["leapfrog-energy"] = (t, { ul, p, h4 }) => {
  const IMG = (n) => `assets/images/software/seequent/leapfrog-energy/${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.webp`;
  const FEATURES = [
    t("Advanced geological modelling", "Pemodelan geologi tingkat lanjut"),
    t("Well planning", "Well planning"),
    t("Numeric modelling", "Numeric modelling"),
    t("Visualisation", "Visualisasi"),
    t("Industry interoperability", "Interoperabilitas dengan software industri"),
    t("Flow simulation", "Flow simulation"),
    t("Collaboration tools", "Alat kolaborasi"),
    t("Intuitive interface", "Antarmuka yang intuitif"),
  ];
  return {
    blocks: [
      { t: "hero",
        h1: "Leapfrog Energy",
        body: p(t("3D geological modelling software for geothermal and energy projects", "Software pemodelan geologi 3D untuk proyek panas bumi dan energi")),
        img: IMG("Energy_Macro_1-scaled") },
      { t: "split", img: IMG("Leapfrog-Energy-Value-Desktop"), rev: 1,
        h: t("Quickly understand subsurface properties for energy transition", "Pahami sifat bawah permukaan dengan cepat untuk transisi energi"),
        body: p(t("Use Leapfrog’s workflow-based 3D modelling capabilities for a variety of energy projects, such as exploring geothermal resources, evaluating CCS storage sites, planning offshore wind developments, or understanding hydrocarbon reserves and resources.",
                  "Manfaatkan kemampuan pemodelan 3D Leapfrog yang berbasis workflow untuk beragam proyek energi, seperti eksplorasi sumber daya panas bumi, evaluasi lokasi penyimpanan CCS, perencanaan pembangunan offshore wind, atau memahami cadangan dan sumber daya hidrokarbon.")) },
      { t: "cards", eyebrow: t("Key benefits", "Manfaat utama"), h: t("Streamline data and empower collaboration", "Rapikan data dan perkuat kolaborasi"), cols: 3,
        items: [
          { h: t("Make sense of complex, disparate data", "Pahami data yang kompleks dan tersebar"),
            body: p(t("Gather and conduct strategic investigations of disparate data in a single scene. From bathymetry, satellite imagery, well data, 2D and 3D geophysical grids, and cross sections, build a complete picture for a fully informed modelling experience.",
                      "Kumpulkan dan telusuri data yang tersebar secara strategis dalam satu scene. Dari batimetri, citra satelit, data sumur, grid geofisika 2D dan 3D, hingga penampang, bangun gambaran yang utuh agar pemodelan didasari informasi lengkap.")) },
          { h: t("Build and update 3D models faster", "Bangun dan perbarui model 3D lebih cepat"),
            body: p(t("Efficiently produce geologically sound volumes and models and easily update the project as new data is collected and loaded.",
                      "Hasilkan volume dan model yang masuk akal secara geologi dengan efisien, lalu perbarui proyek dengan mudah setiap kali data baru dikumpulkan dan dimuat.")) },
          { h: t("Validate models with confidence", "Validasi model dengan yakin"),
            body: p(t("Build robust 3D conceptual models and validate them with geophysical and legacy data. Iterate through this process with interoperability across the wider Seequent portfolio of software applications.",
                      "Bangun model konseptual 3D yang andal dan validasi dengan data geofisika maupun data lama. Ulangi proses ini dengan dukungan interoperabilitas di seluruh portofolio software Seequent.")) },
          { h: t("Plan directional wells with precision", "Rencanakan sumur berarah dengan presisi"),
            body: p(t("Rapidly build and test well trajectories and prognoses in 3D to make confident decisions on well targeting and in-progress drilling operations.",
                      "Bangun dan uji lintasan serta prognosis sumur dalam 3D dengan cepat, sehingga keputusan penentuan target sumur dan operasi pengeboran yang sedang berjalan lebih meyakinkan.")) },
          { h: t("Collaborate without boundaries", "Berkolaborasi tanpa batas"),
            body: p(t("Share scenes and movies or publish private and public views through Seequent Central to engage both technical and non-technical audiences.",
                      "Bagikan scene dan movie, atau publikasikan tampilan privat maupun publik lewat Seequent Central untuk melibatkan audiens teknis dan non-teknis.")) },
          { h: t("Visualise complexity to reduce risk", "Visualisasikan kompleksitas untuk menekan risiko"),
            body: p(t("Understand and communicate the complete picture of the subsurface with powerful 2D and 3D visualisations.",
                      "Pahami dan sampaikan gambaran bawah permukaan secara utuh dengan visualisasi 2D dan 3D yang kuat.")) },
        ] },
      { t: "cards", eyebrow: t("Subscriptions", "Langganan"), h: t("Leapfrog Energy licensing options", "Pilihan lisensi Leapfrog Energy"), cols: 2,
        intro: ul(
          t("<strong>Named license:</strong> allows unlimited use of the software for a single dedicated user during the subscription period.", "<strong>Named license:</strong> penggunaan software tanpa batas untuk satu pengguna tetap selama masa langganan."),
          t("<strong>Shared license:</strong> allows any number of users to access the software over the subscription period, limited to one user per seat at any given time.", "<strong>Shared license:</strong> software dapat diakses oleh berapa pun pengguna selama masa langganan, dengan batas satu pengguna per seat pada satu waktu.")
        ),
        items: [
          { h: t("Leapfrog Energy: 12 months named license", "Leapfrog Energy: named license 12 bulan"),
            body: h4(t("Features", "Fitur")) + ul(t("Unlimited use for a dedicated user for the subscription period", "Penggunaan tanpa batas untuk satu pengguna tetap selama masa langganan"), ...FEATURES) },
          { h: t("Leapfrog Energy: 12 months shared license", "Leapfrog Energy: shared license 12 bulan"),
            body: h4(t("Features", "Fitur")) + ul(t("Access for any number of users, limited to one user per seat at any given time, during the subscription period", "Akses untuk berapa pun pengguna selama masa langganan, dengan batas satu pengguna per seat pada satu waktu"), ...FEATURES) },
        ] },
      { t: "band", bg: IMG("lf-energy-mql"),
        h: t("Generate even more value from your geological data with 3D models in Leapfrog Energy", "Dapatkan nilai lebih dari data geologi Anda dengan model 3D di Leapfrog Energy"),
        links: [["wa:sales", t("Contact sales", "Hubungi sales")]] },
    ],
  };
};
