document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Yıl Güncelleme ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- 2. Navbar Scroll Efekti ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.classList.add('shadow-lg', 'bg-white/95');
            nav.classList.remove('bg-white/80');
        } else {
            nav.classList.remove('shadow-lg', 'bg-white/95');
            nav.classList.add('bg-white/80');
        }
    });

    // --- 3. Mobil Menü Toggle ---
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if(btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // --- 4. Daktilo Efekti (Typewriter) ---
    const words = ["Java", "Python", "Algoritmalar", "Veri Yapıları"];
    let i = 0;
    let timer;
    let isDeleting = false;
    const element = document.getElementById('typewriter');

    function typeWriter() {
        if (!element) return;
        
        const word = words[i];
        let currentText = element.textContent;

        if (!isDeleting && currentText.length < word.length) {
            // Yazıyor
            element.textContent = word.substring(0, currentText.length + 1);
            timer = setTimeout(typeWriter, 100);
        } else if (isDeleting && currentText.length > 0) {
            // Siliyor
            element.textContent = word.substring(0, currentText.length - 1);
            timer = setTimeout(typeWriter, 50);
        } else {
            // Kelime bitti veya silme bitti
            isDeleting = !isDeleting;
            if (!isDeleting) {
                // Sonraki kelimeye geç
                i = (i + 1) % words.length;
            }
            // Bekleme süresi (Yazdıktan sonra bekle veya sildikten sonra bekle)
            timer = setTimeout(typeWriter, isDeleting ? 1000 : 2000);
        }
    }
    
    // Başlat
    typeWriter();

    // --- 5. Geliştirici Konsol Mesajı ---
    console.log("%c Merhaba Eren! 👋", "color:#4f46e5; font-size:20px; font-weight:bold;");
    console.log("%c Kodları inceliyorsan doğru yerdesin.", "color:#64748b; font-size:12px;");
});