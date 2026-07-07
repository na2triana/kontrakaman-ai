(function () {
  "use strict";

  /* Basis data pola modus penipuan (diringkas dari data kurasi tim,
     sumber resmi: OJK Satgas PASTI, Kemkomdigi, Kemnaker) */
  var MODUS_DB = [
    {
      nama: "Penawaran kerja paruh waktu berdeposit",
      kataKunci: ["deposit dulu", "modal kecil", "return besar", "tanpa interview", "cuan"],
      mitigasi: "Jangan pernah transfer deposit untuk 'kerja'. Verifikasi legalitas perusahaan dan simpan bukti chat, nomor, serta rekening sebelum melapor.",
      sumber: "Satgas PASTI / OJK, 2025"
    },
    {
      nama: "Lowongan kerja fiktif via WhatsApp/Telegram",
      kataKunci: ["hanya via wa", "hanya via telegram", "langsung kerja tanpa tes", "kuota terbatas hari ini"],
      mitigasi: "Cocokkan identitas perekrut dengan domain resmi perusahaan dan hindari berpindah ke grup privat yang tidak terverifikasi.",
      sumber: "Kemkomdigi, 2025"
    },
    {
      nama: "Program bantuan atau pendaftaran kerja palsu",
      kataKunci: ["pendaftaran dibuka lewat link", "program tkm", "segera daftar sebelum kuota habis"],
      mitigasi: "Verifikasi tanggal pembukaan program hanya di situs resmi, jangan isi formulir dari tautan tidak resmi.",
      sumber: "Kemnaker, 2025"
    },
    {
      nama: "Impersonation entitas berizin / tiruan brand resmi",
      kataKunci: ["mitra resmi", "akun verifikasi", "admin pusat"],
      mitigasi: "Cocokkan domain, email, dan nomor rekening dengan daftar kontak resmi perusahaan melalui dua jalur verifikasi.",
      sumber: "Satgas PASTI, 2025"
    },
    {
      nama: "Penawaran kerja online yang menyasar pekerja migran",
      kataKunci: ["kerja luar negeri legal", "cepat berangkat", "tanpa biaya", "urus semua dokumen"],
      mitigasi: "Verifikasi perusahaan penyalur, izin resmi, dan kontrak kerja sebelum berkas pribadi diserahkan.",
      sumber: "Kemkomdigi & KP2MI, 2025"
    },
    {
      nama: "Dokumen kerja atau kontrak palsu",
      kataKunci: ["kontrak sudah siap tinggal tanda tangan", "dp dulu baru kirim dokumen", "invoice resmi"],
      mitigasi: "Validasi dokumen dengan menelepon balik ke nomor resmi perusahaan dan gunakan rekening bersama untuk transaksi.",
      sumber: "IASC, 2026"
    },
    {
      nama: "Penipuan kerja paruh waktu lewat akun palsu",
      kataKunci: ["kerja fleksibel dari rumah", "cukup like", "cukup klik", "gaji harian"],
      mitigasi: "Periksa alamat kantor dan legalitas perusahaan, serta jangan pernah mengirim OTP atau data identitas.",
      sumber: "Satgas PASTI / OJK, 2025"
    }
  ];

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function findMatch(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < MODUS_DB.length; i++) {
      var modus = MODUS_DB[i];
      for (var j = 0; j < modus.kataKunci.length; j++) {
        if (lower.indexOf(modus.kataKunci[j]) !== -1) {
          return modus;
        }
      }
    }
    return null;
  }

  function initScanForm() {
    var form = document.getElementById("scanForm");
    var input = document.getElementById("scanInput");
    var hint = document.getElementById("scanHint");
    var resultBox = document.getElementById("scanResult");
    var badge = document.getElementById("resultBadge");
    var title = document.getElementById("resultTitle");
    var desc = document.getElementById("resultDesc");
    var mitigasi = document.getElementById("resultMitigasi");
    var source = document.getElementById("resultSource");

    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();

      if (!text) {
        hint.textContent = "Tempel dulu teks yang ingin dianalisis ya.";
        input.focus();
        return;
      }
      hint.textContent = "";

      var match = findMatch(text);
      badge.classList.remove("aman", "waspada", "bahaya");

      if (match) {
        badge.classList.add("bahaya");
        badge.textContent = "Bahaya";
        title.textContent = escapeHtml(match.nama);
        desc.textContent = "Teks yang Anda tempel mengandung pola kalimat yang sering dipakai pada modus ini.";
        mitigasi.textContent = match.mitigasi;
        source.textContent = "Sumber referensi: " + match.sumber;
      } else if (text.length < 25) {
        badge.classList.add("waspada");
        badge.textContent = "Waspada";
        title.textContent = "Teks terlalu singkat untuk dianalisis akurat";
        desc.textContent = "Tempel percakapan atau isi kontrak yang lebih lengkap agar pencocokan pola lebih akurat.";
        mitigasi.textContent = "Selalu verifikasi identitas pemberi kerja lewat kanal resmi sebelum melanjutkan transaksi apa pun.";
        source.textContent = "";
      } else {
        badge.classList.add("aman");
        badge.textContent = "Belum Terdeteksi";
        title.textContent = "Pola mencurigakan spesifik belum ditemukan";
        desc.textContent = "Bukan berarti sepenuhnya aman. Basis data kami terus diperbarui, tetap terapkan kehati-hatian dasar.";
        mitigasi.textContent = "Jangan transfer dana di muka, verifikasi legalitas mitra kerja, dan simpan seluruh bukti komunikasi.";
        source.textContent = "";
      }

      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function initNavToggle() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var duration = 1200;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var value = Math.floor(progress * target);
      el.textContent = value + (progress >= 1 ? "+" : "");
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + "+";
      }
    }
    requestAnimationFrame(step);
  }

  function initStatsCounter() {
    var statsBar = document.getElementById("statsBar");
    if (!statsBar || !("IntersectionObserver" in window)) return;

    var numbers = statsBar.querySelectorAll(".stat-number");
    var hasRun = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          numbers.forEach(animateCounter);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(statsBar);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initScanForm();
    initNavToggle();
    initStatsCounter();
  });
})();
