/* ============================================================
   ROMANTIC DIGITAL MEMORY BOOK — script.js
   Victor ❤️ Indah
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ===== STATE ===== */
let musicPlaying = false;
const music = document.getElementById('bgMusic');

/* ============================================================
   PARTICLES CANVAS — floating sparkles
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 2 + 0.5;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.hue = Math.random() > 0.5 ? 'rgba(255,143,177,' : 'rgba(255,255,255,';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.alpha -= 0.001;
      if (this.y < -5 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.hue + this.alpha + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   SAKURA PETALS
   ============================================================ */
function createSakura(container, count = 15) {
  const petals = ['🌸', '🌺', '✿', '❀', '💮'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'sakura-petal';
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 6 + 5) + 's';
    el.style.animationDelay = (Math.random() * 8) + 's';
    el.style.fontSize = (Math.random() * 0.6 + 0.7) + 'rem';
    el.style.opacity = Math.random() * 0.5 + 0.3;
    container.appendChild(el);
  }
}

/* ============================================================
   STARS
   ============================================================ */
function createStars(container, count = 80) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 4 + 's';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    star.style.width = star.style.height = (Math.random() * 2.5 + 0.5) + 'px';
    container.appendChild(star);
  }
}

/* ============================================================
   INTRO ANIMATION
   ============================================================ */
function runIntro() {
  const tl = gsap.timeline();

  // Line 1
  tl.to('#introLine1', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power2.out',
    delay: 0.8
  });

  // Line 2
  tl.to('#introLine2', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power2.out',
  }, '+=0.6');

  // Dots
  tl.to('.intro-dots', {
    opacity: 1,
    duration: 0.5
  }, '+=0.4');

  // Transition to login
  tl.to('#introScreen', {
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut',
    delay: 1.2,
    onComplete: () => {
      document.getElementById('introScreen').style.display = 'none';
      const loginPage = document.getElementById('loginPage');
      loginPage.classList.remove('hidden');
      gsap.from(loginPage, { opacity: 0, duration: 0.8, ease: 'power2.out' });

      // Init sakura for login
      createSakura(document.getElementById('sakuraLogin'), 20);
    }
  });
}

runIntro();

/* ============================================================
   LOGIN
   ============================================================ */
const CORRECT_USER = 'sunshine';
const CORRECT_PASS = '150426';
const HIDDEN_PASS = '4426';

// Hidden password attempt limiter
let hiddenAttempts = 0;
let hiddenLockUntil = 0;

// Allow pressing Enter
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const loginPage = document.getElementById('loginPage');
    const hiddenModal = document.getElementById('hiddenModal');
    if (!loginPage.classList.contains('hidden')) handleLogin();
    if (!hiddenModal.classList.contains('hidden')) checkHiddenPassword();
  }
});

function handleLogin() {
  const user = document.getElementById('usernameInput').value.trim().toLowerCase();
  const pass = document.getElementById('passwordInput').value.trim();
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  if (user === CORRECT_USER && pass === CORRECT_PASS) {
    errorEl.classList.add('hidden');
    btn.innerHTML = '<span>Masuk... ✨</span>';
    btn.disabled = true;

    // Success transition
    gsap.to('#loginPage', {
      opacity: 0,
      scale: 1.03,
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => {
        document.getElementById('loginPage').classList.add('hidden');
        initMainSite();
      }
    });

  } else {
    errorEl.classList.remove('hidden');
    gsap.fromTo('#loginBtn',
      { x: -6 },
      { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
    );
    // Shake password field
    gsap.fromTo('#passwordInput',
      { x: -4 },
      { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
    );
  }
}

/* ============================================================
   INIT MAIN SITE
   ============================================================ */
function initMainSite() {
  const main = document.getElementById('mainSite');
  main.classList.remove('hidden');
  gsap.from(main, { opacity: 0, duration: 1, ease: 'power2.out' });

  // Start music
  tryPlayMusic();

  // Init sections
  createStars(document.getElementById('heroStars'), 100);
  createStars(document.getElementById('letterStars'), 60);
  createEndingParticles();
  initCountdown();
  initHeroAnimations();
  initScrollAnimations();
  initChat();
}

/* ============================================================
   MUSIC
   ============================================================ */
function tryPlayMusic() {
  music.volume = 0.5;
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicPlaying = true;
      updateMusicBtn();
    }).catch(() => {
      // Autoplay blocked — wait for user interaction
      document.addEventListener('click', function resumeOnClick() {
        music.play().then(() => {
          musicPlaying = true;
          updateMusicBtn();
        }).catch(() => {});
        document.removeEventListener('click', resumeOnClick);
      }, { once: true });
    });
  }
}

function toggleMusic() {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
  } else {
    music.play().catch(() => {});
    musicPlaying = true;
  }
  updateMusicBtn();
}

function updateMusicBtn() {
  const btn = document.getElementById('musicToggle');
  if (btn) {
    btn.textContent = musicPlaying ? '🎵' : '🔇';
    btn.classList.toggle('muted', !musicPlaying);
  }
}

/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
function initCountdown() {
  const start = new Date('2026-04-15T00:00:00');

  function update() {
    const now = new Date();
    const diff = now - start;
    if (diff < 0) return;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    document.getElementById('countDays').textContent = String(days).padStart(2, '0');
    document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countMins').textContent = String(mins).padStart(2, '0');
    document.getElementById('countSecs').textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   HERO ANIMATIONS (GSAP)
   ============================================================ */
function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
    .to('.countdown-card', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    .to('.scroll-btn', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');
}

/* ============================================================
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
   ============================================================ */
function initScrollAnimations() {
  // Section headers
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
      opacity: 0, y: 40, duration: 0.9, ease: 'power2.out'
    });
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((el, i) => {
    const dir = el.classList.contains('left') ? -40 : 40;
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, x: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power2.out'
    });
    gsap.set(el, { x: dir });
  });

  // Gallery cards
  gsap.utils.toArray('.polaroid-card').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      opacity: 1, scale: 1, y: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'back.out(1.5)'
    });
  });

  // Letter paragraphs
  gsap.utils.toArray('.letter-para').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, y: 20, duration: 0.7, delay: i * 0.08, ease: 'power2.out'
    });
  });

  // Ending section
  const endingTl = gsap.timeline({
    scrollTrigger: { trigger: '#endingSection', start: 'top 70%' }
  });
  endingTl
    .from('.ending-eyebrow', { opacity: 0, y: 20, duration: 0.8 })
    .from('.ending-quote', { opacity: 0, y: 30, duration: 1, ease: 'power2.out' }, '-=0.3')
    .from('.ending-names', { opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.5)' }, '-=0.4')
    .from('.ending-tagline', { opacity: 0, y: 20, duration: 0.8 }, '-=0.3')
    .from('.ending-date', { opacity: 0, duration: 0.8 }, '-=0.3');
}

/* ============================================================
   FAKE CHAT
   ============================================================ */
const chatMessages = [
  // === AWAL KENAL — pagi, 4 April 2026 ===
  { sender: 'indah', text: 'P', delay: 0 },
  { sender: 'indah', text: 'kakk', delay: 700 },
  { sender: 'victor', text: 'Ya?', delay: 2200 },
  { sender: 'victor', text: 'Ini siapa?', delay: 3000 },
  { sender: 'indah', text: 'Indah kak', delay: 4800 },
  { sender: 'victor', text: 'Indah mana?', delay: 6200 },
  { sender: 'indah', text: 'Penettt kak, tau gak? 😂', delay: 8000 },
  { sender: 'victor', text: 'Dapet nomorku darimana?', delay: 9600 },
  { sender: 'indah', text: 'Dari mana ya kak, berusaha sendiri nyarinya 😂', delay: 11400 },
  { sender: 'victor', text: 'Kok bisa??', delay: 13000 },
  { sender: 'victor', text: 'Ah ini palingan ada orang ngerjain, pake nomor baru', delay: 14000 },
  { sender: 'indah', text: 'Ngga kak, beneran!', delay: 15800 },
  { sender: 'indah', text: 'Aku Indah kak, mungkin kak ga kenal aku, tapi aku tau kamu kak 😂', delay: 17000 },
  { sender: 'victor', text: 'Indah penet yang mana ini', delay: 19000 },
  { sender: 'victor', text: 'Kok bisa gitu wkwk', delay: 19800 },
  { sender: 'indah', text: 'Bisa dong haha', delay: 21400 },
  { sender: 'indah', text: 'Kak ga kenal pasti', delay: 22200 },
  { sender: 'victor', text: 'Temenku yang mana yang kenal kamu', delay: 24000 },
  { sender: 'indah', text: 'Andiii', delay: 25600 },
  { sender: 'victor', text: 'Oalah pantes, Andi yang ngasih nomorku ya', delay: 27200 },
  { sender: 'indah', text: 'Bukan kak, aku aja yang ga wa dia', delay: 28800 },
  { sender: 'victor', text: 'Lah terus gimana bisa dapet nomorku, gamungkin ngasal dong haha', delay: 30600 },
  { sender: 'indah', text: 'Kamu pernah ke Penet kak waktu itu, udah agak lama, aku lihat kak', delay: 32400 },
  { sender: 'victor', text: 'Hah kapan??', delay: 34000 },
  { sender: 'victor', text: 'Kasih tau aku, penasaran banget 😂', delay: 35000 },
  { sender: 'indah', text: 'Duh, aku penasaran juga lagi kak sama kamu 😂', delay: 37000 },
  { sender: 'victor', text: 'Aku penasaran banget serius', delay: 38600 },
  { sender: 'indah', text: 'Sini kak kalau penasaran haha', delay: 40200 },
  { sender: 'victor', text: 'Sini kemana haha 😄', delay: 41800 },
  { sender: 'indah', text: 'Kemana yaa 😂', delay: 43200 },
  { sender: 'victor', text: 'Kemana hayoo 😄', delay: 44800 },
  { sender: 'indah', text: 'Gatau kemana ya kak 😂', delay: 46200 },
  { sender: 'victor', text: 'Jadi makin penasaran 😄', delay: 48000 },
  { sender: 'indah', text: 'Haha masa sih 😄', delay: 49600 },
  { sender: 'victor', text: 'Aku sering ke Penet tau, kalo servis', delay: 51200 },
  { sender: 'indah', text: 'Masa sih 😄', delay: 52600 },
  { sender: 'indah', text: 'Mampir kerumah 😄', delay: 53800 },
  { sender: 'victor', text: 'Ah aku aja masih penasaran, udah disuruh mampir kerumah aja 😂', delay: 55600 },
  { sender: 'victor', text: 'Pengen tau nama lengkap kamu', delay: 58000 },
  { sender: 'indah', text: 'Boleh, tapi ga penting', delay: 60000 },
  { sender: 'victor', text: 'Penting sih, tapi kalau ga boleh gapapa kok', delay: 61600 },
  { sender: 'indah', text: 'Boleh kok kak', delay: 63200 },
  { sender: 'indah', text: 'Kamu ga cuma penasaran aja kan kak sama aku?', delay: 66000 },
  { sender: 'victor', text: 'Ngga, aku ga gitu', delay: 67800 },

  // === MOMEN JUJUR — siang ===
  { sender: 'indah', text: 'Kakak ga suka cewek ya? sukanya sama game? soalnya aku liat tiktoknya isinya game semua 😭', delay: 72000 },
  { sender: 'victor', text: 'Aku bukan ga suka cewek 😭 aku cuma main game aja dulu, fokus ke game. Mungkin egois, tapi itu dulu. Sekarang udah waktunya berpikir dewasa, aku ga akan hidup cukup sama main game aja', delay: 75000 },
  { sender: 'victor', text: 'Dan sekarang terbukti kalau aku suka sama cewek', delay: 77200 },
  { sender: 'victor', text: 'Yaitu kamu', delay: 78400 },
  { sender: 'victor', text: 'p', delay: 82000 },
  { sender: 'victor', text: 'p', delay: 83200 },
  { sender: 'victor', text: 'p', delay: 84400 },
  { sender: 'victor', text: 'Tidur ya?', delay: 86000 },
  { sender: 'indah', text: 'Belum kak, aku nangis', delay: 88000 },
  { sender: 'indah', text: 'Nanti aku baca chatnya', delay: 89200 },
  { sender: 'victor', text: 'Kenapa nangis 😭', delay: 90800 },
  { sender: 'victor', text: 'Kamu jangan nangis, aku tungguin ya', delay: 91800 },

  // === VICTOR MAU NGOMONG SERIUS ===
  { sender: 'victor', text: 'Ada yang mau aku omongin kalau kita ketemu', delay: 96000 },
  { sender: 'indah', text: 'Ngomong apa kak, penasaran', delay: 97800 },
  { sender: 'victor', text: 'Ya nanti kalau ketemu aku mau ngomong serius', delay: 99400 },
  { sender: 'victor', text: 'Aku mau ngomong di depan kamu', delay: 100400 },
  { sender: 'indah', text: 'Kapan ya kak', delay: 102000 },
  { sender: 'indah', text: 'Takut banget', delay: 103200 },
  { sender: 'victor', text: 'Takut apa 😭', delay: 104800 },
  { sender: 'indah', text: 'Malu', delay: 106400 },
  { sender: 'indah', text: 'Kakak ini masih awal, kita gatau nanti gimana', delay: 108000 },
  { sender: 'indah', text: 'Aku takut banget', delay: 109200 },
  { sender: 'victor', text: 'Aku tentuin waktunya nanti, ga akan lama kok', delay: 111000 },
  { sender: 'victor', text: 'Kan aku udah bilang mau ajak kamu jalan', delay: 112200 },
  { sender: 'indah', text: 'Iya kak, gapapa, sebisa aja', delay: 114000 },
  { sender: 'victor', text: 'Iya aku luangin waktuku buat kamu nanti yaa', delay: 115800 },
  { sender: 'indah', text: 'Makasih ya kak 🩷🩷', delay: 117400 },
  { sender: 'victor', text: 'Makasih ya sayang 🥰', delay: 119000 },
  { sender: 'indah', text: 'Eh kok sayang? 😳', delay: 121000 },
  { sender: 'victor', text: 'Gapapa biar lebih deket aja hehe', delay: 122800 },
  { sender: 'indah', text: 'Iya deh sayang 🩷', delay: 124600 },

  // === MOMEN KHAWATIR — pagi 14 April ===
  { sender: 'indah', text: 'Sayang, kamu kenapa?', delay: 130000 },
  { sender: 'indah', text: 'Sayang marah ya sama aku? 🥺', delay: 131400 },
  { sender: 'indah', text: 'Sayang jangan marah ya, aku sayang banget sama kamu 🥺🥺', delay: 132800 },
  { sender: 'indah', text: 'Sayang kenapa, aku ada salah?', delay: 134400 },
  { sender: 'indah', text: 'Aku minta maaf ya kalau aku ada salah, aku sayang banget sama kamu 🥺', delay: 136000 },
  { sender: 'victor', text: 'Ngga loh yang', delay: 138000 },
  { sender: 'victor', text: 'Aku tidur', delay: 138800 },
  { sender: 'indah', text: 'Bohong', delay: 140200 },
  { sender: 'indah', text: 'Sayang kemana ya, khawatir banget aku 🥺', delay: 142000 },
  { sender: 'victor', text: 'Yang aku tidur, baru bangun', delay: 144000 },
  { sender: 'victor', text: 'Sayang maaf ya suka ngilang 🙁', delay: 145200 },
  { sender: 'indah', text: 'Aku kira kemana 🥺', delay: 147000 },
  { sender: 'victor', text: 'Maaf ya suka ilang-ilangan 🙁', delay: 148600 },
  { sender: 'indah', text: 'Iya gapapa sayang', delay: 150200 },
  { sender: 'indah', text: 'Namanya cape, istirahat', delay: 151400 },
  { sender: 'indah', text: 'Udah bobo lagi yuk', delay: 152600 },
  { sender: 'victor', text: 'Gapapa mulu 😄', delay: 154200 },
  { sender: 'indah', text: 'Ya gapapa sayang 💋', delay: 155800 },

  // === MOMEN JEMPUT — sore habis magrib 15 April ===
  { sender: 'victor', text: 'Jadi sayang, magrib aku otw dari sini ya', delay: 161000 },
  { sender: 'indah', text: 'Jadi gaa? Hati-hati ya sayang', delay: 162800 },
  { sender: 'indah', text: 'Kak mau jemput di rumah ga? Kalau dari rumah aku pulang abis nganter teman', delay: 164400 },
  { sender: 'victor', text: 'Aku otw, udah sampe Mandala', delay: 166200 },
  { sender: 'indah', text: 'Pelan-pelan aja', delay: 167800 },
  { sender: 'indah', text: 'Ih sabar kak 😭😭', delay: 169000 },
  { sender: 'indah', text: 'Sampe mana?', delay: 171000 },
  { sender: 'victor', text: 'Penet, 5 menit lagi', delay: 172600 },
  { sender: 'indah', text: 'Okee sayang, tunggu ya 🩷', delay: 174200 },
  { sender: 'indah', text: 'Sayang hati-hati ya kalau udah sampe, kabarin', delay: 176000 },

  // === PULANG — jam 10 malam ===
  { sender: 'victor', text: 'Baru sampe rumah sayang', delay: 182000 },
  { sender: 'indah', text: 'Alhamdulillah', delay: 183800 },
  { sender: 'victor', text: 'Aku mau jatuh tadi di Mandala 😭', delay: 185400 },
  { sender: 'indah', text: 'Hah kok bisa?! Naik motornya pelan-pelan aja, jangan ngebut-ngebut, aku jadi khawatir sama kamu 😭', delay: 187400 },
  { sender: 'victor', text: 'Maaf ya bikin kamu khawatir 😭', delay: 189600 },
  { sender: 'indah', text: 'Iya sayang gapapa 💋', delay: 191400 },
  { sender: 'victor', text: 'I love you ❤️', delay: 194000 },
  { sender: 'indah', text: 'I love you more 💕', delay: 196000 },
  { sender: 'victor', text: 'Ngga mungkin 😌', delay: 197800 },
  { sender: 'indah', text: 'Iya mungkin dong 😭', delay: 199400 },
];

let chatStarted = false;

function initChat() {
  const chatSection = document.getElementById('chatSection');

  // Start chat when section comes into view
  ScrollTrigger.create({
    trigger: chatSection,
    start: 'top 60%',
    onEnter: () => {
      if (!chatStarted) {
        chatStarted = true;
        playChatMessages();
      }
    }
  });
}

function playChatMessages() {
  const chatBody = document.getElementById('chatBody');
  const statusEl = document.getElementById('chatStatus');
  const typingIndicator = createTypingIndicator();
  chatBody.appendChild(typingIndicator);

  chatMessages.forEach((msg, i) => {
    // Show typing indicator before each message
    setTimeout(() => {
      const isLast = i === chatMessages.length - 1;
      statusEl.textContent = 'mengetik...';
      statusEl.className = 'chat-status typing';
      typingIndicator.classList.add('visible');
      chatBody.scrollTop = chatBody.scrollHeight;

      // Show message after typing delay
      const typingDuration = Math.min(msg.text.length * 40 + 400, 1200);
      setTimeout(() => {
        typingIndicator.classList.remove('visible');
        if (!isLast) {
          statusEl.textContent = 'online';
          statusEl.className = 'chat-status';
        } else {
          statusEl.textContent = 'online 💕';
          statusEl.className = 'chat-status';
        }

        const bubble = createBubble(msg.sender, msg.text);
        chatBody.insertBefore(bubble, typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, typingDuration);

    }, msg.delay);
  });
}

function createTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  return div;
}

// Pre-assigned timestamps per message index, always ascending within each section
const chatTimestamps = [
  // === AWAL KENAL — 4 April 2026, mulai 15:08 ===
  '15.08', '15.08', '15.08', '15.08', // p, kakk, Ya?, Ini siapa?
  '15.09', '15.09',                    // Indah kak, Indah mana?
  '15.10', '15.11', '15.12',           // Penettt, Dapet nomorku, Dari mana ya
  '15.13', '15.13', '15.14', '15.14', // Kok bisa, Ah ini palingan, Ngga kak, Aku Indah kak
  '15.15', '15.15', '15.16', '15.16', // Indah penet, Kok bisa gitu, Bisa dong, Kak ga kenal
  '15.17', '15.17',                    // Temenku yang mana, Andiii
  '15.18', '15.18', '15.19',           // Oalah pantes, Bukan kak, Lah terus gimana
  '15.20', '15.21', '15.21',           // Kamu pernah ke Penet, Hah kapan, Kasih tau aku
  '15.22', '15.23', '15.24',           // Duh penasaran, Aku penasaran, Sini kak
  '15.24', '15.25', '15.25',           // Sini kemana, Kemana yaa, Kemana hayoo
  '15.26', '15.27', '15.27',           // Gatau kemana, Jadi makin, Haha masa sih
  '15.28', '15.29', '15.29',           // Aku sering ke Penet, Masa sih, Mampir kerumah
  '15.30',                             // Ah aku aja masih penasaran
  '15.32', '15.33', '15.34', '15.35', // Pengen tau, Boleh tapi ga penting, Penting sih, Boleh kok
  '15.37', '15.38',                    // Kamu ga cuma penasaran, Ngga aku ga gitu

  // === MOMEN JUJUR — 9 April 2026, mulai 00:26 ===
  '00.26',                             // Kakak ga suka cewek
  '00.27', '00.28', '00.28',           // Aku bukan ga suka, Dan sekarang, Yaitu kamu
  '00.35', '00.35', '00.36', '00.37', // p, p, p, Tidur ya?
  '00.38', '00.38',                    // Belum kak aku nangis, Nanti aku baca
  '00.39', '00.39',                    // Kenapa nangis, Kamu jangan nangis

  // === MOMEN NGOMONG SERIUS — 9 April 2026, lanjut ===
  '00.41', '00.42',                    // Ada yang mau aku omongin, Ngomong apa kak
  '00.42', '00.43',                    // Ya nanti kalau ketemu, Aku mau ngomong
  '00.44', '00.44',                    // Kapan ya kak, Takut banget
  '00.45', '00.46',                    // Takut apa, Malu
  '00.46', '00.47',                    // Kakak ini masih awal, Aku takut banget
  '00.48', '00.48',                    // Aku tentuin waktunya, Kan aku udah bilang
  '00.49', '00.50',                    // Iya kak gapapa, Iya aku luangin
  '00.51', '00.52',                    // Makasih ya kak, Makasih ya sayang
  '00.53', '00.54', '00.55',           // Eh kok sayang, Gapapa biar lebih deket, Iya deh sayang

  // === MOMEN KHAWATIR — 14 April 2026, mulai 06:56 ===
  '06.56', '06.57', '06.59', '07.03', // Sayang kamu kenapa, marah ya, jangan marah, kenapa ada salah
  '07.06',                             // Aku minta maaf
  '07.22', '07.22',                    // Ngga loh yang, Aku tidur
  '07.22', '07.23',                    // Bohong, Sayang kemana ya
  '07.24', '07.25',                    // Yang aku tidur baru bangun, Sayang maaf
  '07.26', '07.27',                    // Aku kira kemana, Maaf ya suka ilang
  '07.28', '07.29', '07.30',           // Iya gapapa, Namanya cape, Udah bobo lagi
  '07.31', '07.42',                    // Gapapa mulu, Ya gapapa sayang

  // === MOMEN JEMPUT — 15 April 2026, mulai 18:00 ===
  '18.00', '18.01',                    // Jadi sayang magrib otw, Jadi gaa
  '18.02', '18.10',                    // Kak mau jemput, Aku otw
  '18.11', '18.15',                    // Pelan-pelan aja, Ih sabar kak
  '18.35', '18.40',                    // Sampe mana, Penet 5 menit
  '19.03', '19.03',                    // Okee sayang tunggu, Sayang hati-hati

  // === PULANG — 15 April 2026, mulai 22:00 ===
  '22.00', '22.01',                    // Baru sampe rumah, Alhamdulillah
  '22.02', '22.04',                    // Aku mau jatuh, Hah kok bisa
  '22.05', '22.06',                    // Maaf ya bikin khawatir, Iya sayang gapapa
  '22.07', '22.08',                    // I love you, I love you more
  '22.09', '22.10',                    // Ngga mungkin, Iya mungkin dong
];

let chatTimeIndex = 0;

function getNextTime() {
  const t = chatTimestamps[chatTimeIndex] || '22.00';
  chatTimeIndex++;
  return t;
}

function createBubble(sender, text) {
  const wrap = document.createElement('div');
  wrap.className = `chat-bubble ${sender}`;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'bubble-msg';
  msgDiv.textContent = text;

  const timeDiv = document.createElement('div');
  timeDiv.className = 'bubble-time';
  timeDiv.textContent = getNextTime();

  wrap.appendChild(msgDiv);
  wrap.appendChild(timeDiv);
  return wrap;
}

/* ============================================================
   ENDING PARTICLES
   ============================================================ */
function createEndingParticles() {
  const container = document.getElementById('endingParticles');
  const emojis = ['💕', '🌸', '✨', '💗', '⭐', '🌟'];

  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      font-size: ${Math.random() * 1.5 + 0.8}rem;
      opacity: ${Math.random() * 0.4 + 0.1};
      animation: float-heart ${Math.random() * 4 + 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
      pointer-events: none;
    `;
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    container.appendChild(el);
  }
}

/* ============================================================
   HIDDEN MODAL
   ============================================================ */
function openHiddenModal() {
  const modal = document.getElementById('hiddenModal');
  modal.classList.remove('hidden');
  setTimeout(() => document.getElementById('hiddenPasswordInput').focus(), 100);
}

function closeHiddenModal() {
  document.getElementById('hiddenModal').classList.add('hidden');
  document.getElementById('hiddenError').classList.add('hidden');
  document.getElementById('hiddenPasswordInput').value = '';
  // Reset attempts when user closes modal (graceful)
  hiddenAttempts = 0;
  hiddenLockUntil = 0;
}

function closeHiddenModalOutside(e) {
  if (e.target === document.getElementById('hiddenModal')) closeHiddenModal();
}

function checkHiddenPassword() {
  const val = document.getElementById('hiddenPasswordInput').value.trim();
  const errEl = document.getElementById('hiddenError');
  const now = Date.now();

  // Check if locked
  if (now < hiddenLockUntil) {
    const waitSec = Math.ceil((hiddenLockUntil - now) / 1000);
    errEl.textContent = `Terlalu banyak percobaan. Coba lagi ${waitSec} detik.`;
    errEl.classList.remove('hidden');
    return;
  }

  if (val === HIDDEN_PASS) {
    // Success — reset attempts
    hiddenAttempts = 0;
    hiddenLockUntil = 0;
    closeHiddenModal();
    openHiddenScene();
  } else {
    hiddenAttempts++;
    const remaining = 3 - hiddenAttempts;

    if (hiddenAttempts >= 3) {
      // Lock for 30 seconds
      hiddenLockUntil = Date.now() + 30000;
      hiddenAttempts = 0;
      errEl.textContent = `Terlalu banyak percobaan. Coba lagi 30 detik kemudian.`;
      errEl.classList.remove('hidden');
      gsap.fromTo('#hiddenPasswordInput',
        { x: -5 },
        { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
      );
      // Clear input
      document.getElementById('hiddenPasswordInput').value = '';
    } else {
      errEl.textContent = `Salah! ${remaining} percobaan lagi. Kamu bukan Sayang-ku 😤`;
      errEl.classList.remove('hidden');
      gsap.fromTo('#hiddenPasswordInput',
        { x: -5 },
        { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
      );
      document.getElementById('hiddenPasswordInput').value = '';
    }
  }
}

function openHiddenScene() {
  const scene = document.getElementById('hiddenScene');
  scene.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  gsap.fromTo(scene,
    { opacity: 0 },
    { opacity: 1, duration: 0.8, ease: 'power2.out' }
  );

  gsap.from('.hidden-scene-heart', { scale: 0, duration: 0.6, delay: 0.4, ease: 'back.out(2)' });
  gsap.from('.hidden-scene-title', { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
  gsap.from('.hidden-scene-message', { opacity: 0, y: 30, duration: 0.8, delay: 0.8 });
}

function closeHiddenScene() {
  gsap.to('#hiddenScene', {
    opacity: 0, duration: 0.5, onComplete: () => {
      document.getElementById('hiddenScene').classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ============================================================
   SMOOTH SCROLL for internal links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
