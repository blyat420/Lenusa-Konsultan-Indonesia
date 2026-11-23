/* Leapfrog Works, rebuilt from https://www.seequent.com/products-solutions/leapfrog-works/ (fetched 11 Nov 2026).
   Left out on purpose: demo buttons, extensions, pricing, testimonial, "Leapfrog Works live in action", free training.
   Loaded by script.js (PAGE_FILES) only on software-details.html?id=leapfrog-works. t(en, id) picks the language. */
(window.SoftwarePages = window.SoftwarePages || {})["leapfrog-works"] = (t, { p }) => {
  const IMG = (n) => `assets/images/software/seequent/leapfrog-works/${n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.webp`;
  return {
    blocks: [
      { t: "hero",
        h1: "Leapfrog Works",
        body: p(t("From field mapping to 3D model software, built for civil and environmental teams",
                  "Dari pemetaan lapangan hingga model 3D, software yang dibuat untuk tim sipil dan lingkungan")),
        img: IMG("lf-works-banner") },
      { t: "video", h: t("Model and understand subsurface conditions in 3D", "Modelkan dan pahami kondisi bawah permukaan dalam 3D"),
        intro: p(t("Build categorical and numerical models from site investigation and boring data in a fraction of the time. Visualise, understand, and communicate subsurface risk using models, videos, and cross sections to support confident, data-driven decisions.",
                   "Bangun model kategorikal dan numerik dari data penyelidikan lapangan dan boring dalam waktu jauh lebih singkat. Visualisasikan, pahami, dan komunikasikan risiko bawah permukaan melalui model, video, dan penampang untuk mendukung keputusan berbasis data yang meyakinkan.")),
        uuid: "D5LiQVQc824d3FbbNFjxHS", thumb: IMG("D5LiQVQc824d3FbbNFjxHS") },
      { t: "cards", eyebrow: t("Key benefits", "Manfaat utama"), h: t("See and understand ground conditions at any stage of your project", "Lihat dan pahami kondisi tanah di setiap tahap proyek Anda"), cols: 3,
        items: [
          { h: t("Increase ground condition confidence", "Tingkatkan keyakinan terhadap kondisi tanah"),
            body: p(t("Efficiently produce 3D models to better understand geological continuity, enabling confident planning to ensure the safety and stability of infrastructure projects.",
                      "Hasilkan model 3D secara efisien untuk memahami kontinuitas geologi dengan lebih baik, sehingga perencanaan lebih meyakinkan demi keamanan dan stabilitas proyek infrastruktur.")) },
          { h: t("Accelerate conceptual modelling", "Percepat pemodelan konseptual"),
            body: p(t("Turn raw data into actionable 3D models with advanced implicit modelling, enabling teams to move from data to decisions faster.",
                      "Ubah data mentah menjadi model 3D yang siap dipakai dengan implicit modelling yang canggih, sehingga tim dapat bergerak dari data ke keputusan lebih cepat.")) },
          { h: t("Easily update models with new data", "Perbarui model dengan data baru secara mudah"),
            body: p(t("Dynamically update models as new data becomes available throughout the project, ensuring they always reflect the latest information without the need for manual updates.",
                      "Perbarui model secara dinamis setiap kali data baru tersedia sepanjang proyek, sehingga model selalu mencerminkan informasi terbaru tanpa perlu pembaruan manual.")) },
          { h: t("Communicate complex data", "Komunikasikan data yang kompleks"),
            body: p(t("Visualise your data through 3D models that make it easier to communicate complex geological data to non-technical stakeholders, including management, clients, and the general public.",
                      "Visualisasikan data Anda melalui model 3D agar data geologi yang kompleks lebih mudah disampaikan kepada pemangku kepentingan non-teknis, termasuk manajemen, klien, dan masyarakat umum.")) },
          { h: t("Integrate seamlessly with project tools", "Terintegrasi mulus dengan tools proyek"),
            body: p(t("Work with popular industry-standard ground investigation data formats and built-in integrations with other Seequent software solutions.",
                      "Bekerja dengan format data penyelidikan tanah standar industri yang populer, serta integrasi bawaan dengan solusi software Seequent lainnya.")) },
          { h: t("See your project in full context", "Lihat proyek Anda dalam konteks utuh"),
            body: p(t("Combine your geological models with engineering designs, BIM workflows, and groundwater flow models to see the complete picture of your projects.",
                      "Gabungkan model geologi dengan desain engineering, workflow BIM, dan model aliran air tanah untuk melihat gambaran proyek secara lengkap.")) },
        ] },
      { t: "band", bg: IMG("MQL-block-2-scaled"),
        h: t("Generate even more value from your geological data with 3D subsurface models in Leapfrog Works", "Dapatkan nilai lebih dari data geologi Anda dengan model bawah permukaan 3D di Leapfrog Works"),
        links: [["wa:buy", t("Buy now", "Beli sekarang")], ["wa:sales", t("Contact sales", "Hubungi sales")]] },
    ],
  };
};
