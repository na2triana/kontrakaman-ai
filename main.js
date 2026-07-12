// 🔄 Fitur Tombol Reset Kotak Analisis
    const btnReset = document.getElementById("btnReset");
    const formScan = document.getElementById("scanForm");
    const resultBox = document.getElementById("scanResult");

    if (btnReset) {
        btnReset.addEventListener("click", function() {
            formScan.reset(); // Mengosongkan kolom input teks
            resultBox.hidden = true; // Menyembunyikan kembali kotak hasil analisis
            document.getElementById("scanHint").textContent = ""; // Menghapus pesan peringatan kosong
        });
    }

    // 👍 Fitur Penilaian Hasil Analisis (Feedback)
    const btnLike = document.getElementById("btnLike");
    const btnDislike = document.getElementById("btnDislike");

    if (btnLike && btnDislike) {
        btnLike.addEventListener("click", function() {
            alert("Terima kasih! Umpan balik positif Anda disimpan secara anonim untuk melatih AI.");
        });
        btnDislike.addEventListener("click", function() {
            alert("Terima kasih atas masukannya. Catatan evaluasi ini akan kami gunakan untuk melatih akurasi AI.");
        });
    }

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
    // ✍️ Fitur Teks Bergerak (Typewriter Effect)
    const teksHero = "Kenali Penipuan Kerja Sebelum Anda Rugi";
    let indeksKarakter = 0;

    function ketikJudul() {
        const elemenJudul = document.getElementById("hero-title");
        if (elemenJudul && indeksKarakter < teksHero.length) {
            elemenJudul.textContent += teksHero.charAt(indeksKarakter);
            indeksKarakter++;
            setTimeout(ketikJudul, 50); // Mengatur kecepatan ketikan (dalam milidetik)
        }
    }
    
    // Jalankan fungsi ketik saat halaman selesai dimuat
    ketikJudul();
    initScanForm();
    initNavToggle();
    initStatsCounter();
  });
})();

// 🤖 Fungsi API Gemini dengan Batasan Topik Ketat
async function panggilGeminiAI(teksPengguna) {
    // 🌐 Alamat lokal/relatif yang mengarah ke fungsi serverless Netlify kita
    const url = "/.netlify/functions/chat";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // 📦 Mengirim teks input pengguna dalam bentuk JSON
            body: JSON.stringify({ pesan: teksPengguna })
        });
        
        const data = await response.json();
        return data.jawaban;
    } catch (error) {
        console.error("Error Frontend:", error);
        return "Maaf, asisten gagal terhubung dengan server aman.";
    }
}

// 🕹️ Logika Sensor Klik untuk Tombol Opsi Cepat (Suggestion Chips)
document.querySelectorAll('.chip-btn').forEach(button => {
    button.addEventListener('click', () => {
        const teksOpsi = button.getAttribute('data-teks');
        chatInput.value = teksOpsi; // Pindahkan teks ke dalam input box
        btnSendChat.click();        // Picu otomatis fungsi kirim pesan
    });
});


// ==========================================
// 🕹️ LOGIKA INTERAKSI CHATBOT & EFEK LOADING
// ==========================================
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatContainer = document.getElementById('chat-container');
const btnSendChat = document.getElementById('btn-send-chat');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatCloseBtn = document.getElementById('chat-close-btn');


// 1. Logika Buka Jendela
// Tambahkan ini di bagian atas pengenalan variabel chat
const chatWrapper = document.querySelector('.chat-toggle-wrapper');

// 1. Logika Buka Jendela: Sembunyikan seluruh wrapper stempel
if (chatToggleBtn && chatContainer && chatWrapper) {
    chatToggleBtn.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
        chatWrapper.style.display = 'none'; 
    });
}

// 2. Logika Tutup Jendela: Munculkan kembali seluruh wrapper stempel
if (chatCloseBtn && chatContainer && chatWrapper) {
    chatCloseBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        chatWrapper.style.display = 'flex'; 
    });
            }

// 1. Logika Buka Jendela: Sembunyikan tombol kaca pembesar
if (chatToggleBtn && chatContainer) {
    chatToggleBtn.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
        chatToggleBtn.style.display = 'none'; 
    });
}

// 2. Logika Tutup Jendela: Munculkan kembali tombol kaca pembesar
if (chatCloseBtn && chatToggleBtn && chatContainer) {
    chatCloseBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        chatToggleBtn.style.display = 'flex'; 
    });
}

// 3. Fitur Mengirim Pesan Lewat Tombol Enter Keyboard ⌨️
if (chatInput && btnSendChat) {
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Mencegah eror baris baru di input
            btnSendChat.click();    // Memicu otomatis tombol kirim
        }
    });
}

// 4. Fungsi Menampilkan Gelembung Chat di Layar
function tampilkanGelembungChat(teks, pengirim) {
    if (!chatMessages) return;
    const bubble = document.createElement('div');
    bubble.style.padding = '8px 12px';
    bubble.style.borderRadius = '8px';
    bubble.style.maxWidth = '85%';
    bubble.style.fontSize = '13px';
    bubble.style.lineHeight = '1.4';
    bubble.style.marginBottom = '8px';
    bubble.style.display = 'inline-block';
    
    if (pengirim === 'user') {
        bubble.style.backgroundColor = '#e2e8f0';
        bubble.style.color = '#1e293b';
        bubble.style.alignSelf = 'flex-end';
    } else {
        bubble.style.backgroundColor = '#2563eb';
        bubble.style.color = 'white';
        bubble.style.alignSelf = 'flex-start';
    }
    
    bubble.innerText = teks;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll ke bawah
}

// 5. Logika Utama Saat Tombol Kirim Diklik
if (btnSendChat && chatInput) {
    btnSendChat.addEventListener('click', async () => {
        const teksUser = chatInput.value.trim();
        if (!teksUser) return;

        tampilkanGelembungChat(teksUser, 'user');
        chatInput.value = '';

        const loadingId = 'loading-' + Date.now();
        const loadingBubble = document.createElement('div');
        loadingBubble.id = loadingId;
        loadingBubble.style.alignSelf = 'flex-start';
        loadingBubble.style.fontSize = '12px';
        loadingBubble.style.color = '#64748b';
        loadingBubble.textContent = 'Asisten sedang menganalisis... ⏳';
        chatMessages.appendChild(loadingBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // 🔄 Menjalankan fungsi AI secara aman lewat serverless Netlify
            const responsAI = await panggilGeminiAI(teksUser);
            tampilkanGelembungChat(responsAI, 'ai');
        } catch (error) {
            tampilkanGelembungChat("Sistem Chat Eror: " + error.message, 'ai');
        } finally {
            // 🧼 Menghapus efek loading setelah respons selesai
            const currentLoading = document.getElementById(loadingId);
            if (currentLoading) currentLoading.remove();
        }
    });
                                              }
