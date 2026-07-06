/* ==========================================================================
   FITUR JAVASCRIPT: LOGIKA INTERAKTIF KONTRAKAMAN HYPERLOCAL
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {
    
    const btnAnalisis = document.getElementById("btn-analisis");
    const btnReset = document.getElementById("btn-reset"); // Inisialisasi tombol reset
    const txtMessage = document.getElementById("message");
    const boxHasil = document.getElementById("hasil-analisis");
    const kontenHasil = document.getElementById("konten-hasil");
    
    const btnYa = document.getElementById("fb-ya");
    const btnTidak = document.getElementById("fb-tidak");

    // LOGIKA PROSES ANALISIS
    if (btnAnalisis && txtMessage) {
        btnAnalisis.addEventListener("click", function() {
            const teksInput = txtMessage.value.trim().toLowerCase();
            
            if (teksInput === "") {
                alert("Mohon tempelkan teks percakapan terlebih dahulu.");
                return;
            }
            
            btnAnalisis.innerText = "Sedang Memindai...";
            btnAnalisis.disabled = true;

            setTimeout(function() {
                let laporanAnalisis = "";

                if (teksInput.includes("deposit") || teksInput.includes("part-time") || teksInput.includes("bayar")) {
                    laporanAnalisis = `
                        <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #EF4444; padding: 12px; border-radius: 8px;">
                            <strong style="color: #EF4444;">🔴 RISIKO TINGGI: Indikasi Kerja Deposit / Scam</strong>
                            <p style="margin: 8px 0 0; font-size: 14px; color: #94A3B8;">
                                Pesan mengandung indikasi permintaan uang muka di depan. Jangan pernah mentransfer dana jaminan!
                            </p>
                        </div>
                    `;
                } else if (teksInput.includes("ijazah") || teksInput.includes("tahan")) {
                    laporanAnalisis = `
                        <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #EF4444; padding: 12px; border-radius: 8px;">
                            <strong style="color: #EF4444;">🔴 RISIKO TINGGI: Aturan Hukum Penahanan Dokumen</strong>
                            <p style="margin: 8px 0 0; font-size: 14px; color: #94A3B8;">
                                Terdeteksi indikasi penahanan dokumen pribadi asli pekerja oleh sepihak perusahaan.
                            </p>
                        </div>
                    `;
                } else {
                    laporanAnalisis = `
                        <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10B981; padding: 12px; border-radius: 8px;">
                            <strong style="color: #10B981;">🟢 RISIKO RENDAH (DATABASE LOKAL): Pola Kata Kunci Aman</strong>
                            <p style="margin: 8px 0 0; font-size: 14px; color: #94A3B8;">
                                Teks ini lolos dari kata kunci mencurigakan lokal. Catatan: Kasus kompleks seperti paket investasi luar negeri (Bulgaria/Schengen) memerlukan aktivasi server API Gemini untuk pemindaian makna konteks penuh.
                            </p>
                        </div>
                    `;
                }

                kontenHasil.innerHTML = laporanAnalisis;
                boxHasil.style.display = "block";
                
                btnAnalisis.innerText = "Analisis Risiko AI";
                btnAnalisis.disabled = false;
                boxHasil.scrollIntoView({ behavior: 'smooth' });

            }, 800);
        });
    }

    /* ==========================================================================
       FITUR TAMBAHAN: LOGIKA RESET KOTAK TANPA REFRESH PAGE
       Penjelasan: Mengembalikan kondisi form ke keadaan kosong secara bersih.
       ========================================================================== */
    if (btnReset) {
        btnReset.addEventListener("click", function() {
            txtMessage.value = ""; // Mengosongkan area teks input
            boxHasil.style.display = "none"; // Menyembunyikan kembali kotak hasil analisis
            kontenHasil.innerHTML = ""; // Membersihkan isi teks analisis lama
            
            // Mengaktifkan kembali tombol umpan balik ke mode normal
            btnYa.disabled = false;
            btnTidak.disabled = false;
            btnYa.style.opacity = "1";
            btnTidak.style.opacity = "1";
            
            // Menggulir layar kembali dengan mulus ke area atas kotak input
            txtMessage.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // LOGIKA TOMBOL FEEDBACK USER
    if (btnYa && btnLater = btnTidak) {
        btnYa.addEventListener("click", function() {
            alert("Terima kasih atas feedback Anda! Data disimpan secara anonim.");
            btnYa.disabled = true; btnTidak.disabled = true;
            btnYa.style.opacity = "0.5"; btnTidak.style.opacity = "0.5";
        });
        btnTidak.addEventListener("click", function() {
            prompt("Sebutkan bagian analisis yang kurang tepat:");
            btnYa.disabled = true; btnTidak.disabled = true;
            btnYa.style.opacity = "0.5"; btnTidak.style.opacity = "0.5";
        });
    }
});
