document.addEventListener('DOMContentLoaded', () => {
    // Sayfa yüklendiğinde konsola imza atalım
    console.log("%c Web Mimarı: Portfolio Online ", "background: #4ecca3; color: #000; padding: 5px; font-weight: bold;");

    // Kartlara ufak bir giriş animasyonu (İsteğe bağlı)
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 * (index + 1)); // Sırayla gelmeleri için
    });
});