document.addEventListener('DOMContentLoaded', () => {
    // Footer Yıl Güncellemesi
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Indicator (Opsiyonel: Navbar gölgesini scroll durumuna göre güncelleme)
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });

    console.log("Portfolio Loaded: Muhammet Eren Mente");
});