document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Adım: İlk çıktı (500ms sonra)
    setTimeout(() => {
        document.getElementById('line1').textContent = 
            '[INFO] Loading dependencies ... Done.';
    }, 500);

    // 2. Adım: İkinci çıktı (1500ms sonra)
    setTimeout(() => {
        document.getElementById('line2').textContent = 
            '[INFO] Checking skills ... Java, Microservices, System Design verified.';
    }, 1500);

    // 3. Adım: İkinci komut satırını görünür yap (2500ms sonra)
    setTimeout(() => {
        document.getElementById('cmd2').classList.remove('hidden');
        document.getElementById('cmd2').style.display = 'flex';
    }, 2500);

    // 4. Adım: İletişim bilgisini bas (3500ms sonra)
    setTimeout(() => {
        document.getElementById('line3').textContent = 
            '"iletisim@erenmente.com"';
    }, 3500);

});