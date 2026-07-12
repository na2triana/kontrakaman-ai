exports.handler = async function (event, context) {
    // 🛡️ Hanya izinkan metode POST untuk mengirim data secara aman
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ jawaban: "Metode tidak diizinkan" })
        };
    }

    try {
        // 📥 Mengambil data pesan yang dikirim oleh main.js frontend
        const body = JSON.parse(event.body);
        const teksPengguna = body.pesan;

        // 🔒 Membaca API Key secara rahasia dari Environment Variable Netlify
        const API_KEY = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        // 🧠 Kita pindahkan instruksi sistem ke sini agar tidak bisa diintip dari browser

            const promptSistem = `Anda adalah Asisten KontrakAman.ai, seorang pakar edukasi hukum kontrak dan pencegahan penipuan kerja yang sangat ramah dan suportif.
    
    Aturan Menjawab:
    1. BADGE: (Bahaya/Waspada/Aman)
    2. Penjelasan Singkat
    3. Link Resmi Pengaduan (OJK: sipasti.ojk.go.id / Kemkomdigi: aduankonten.id) jika terindikasi penipuan.
    4. Jawablah dengan cerdas, valid, dan edukatif jika pengguna bertanya tentang keamanan kontrak, ciri lowongan kerja palsu, tips freelance/UMKM, atau panduan mitigasi korban penipuan.
    5. Jika pengguna mengajukan pertanyaan di luar topik penipuan kerja, hukum kontrak, lowongan fiktif, atau pelaporan resmi pemerintah, Anda WAJIB menolak secara halus. 
    6. Contoh penolakan: Ucapkan maaf dengan ramah, jelaskan batasan keahlian Anda, lalu mintalah pengguna untuk kembali mengajukan pertanyaan seputar keamanan kontrak kerja.

    Pertanyaan pengguna: "${teksPengguna}"`;
        

        // 🌐 Melakukan panggilan aman dari server Netlify ke Google Gemini
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptSistem }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ jawaban: "Eror Google Serverless: " + data.error.message })
            };
        }

        const jawabanAI = data.candidates[0].content.parts[0].text;

        // 📤 Mengirimkan kembali jawaban asli dari Google ke browser pengguna
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jawaban: jawabanAI })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jawaban: "Eror Sistem Jembatan: " + error.message })
        };
    }
};
