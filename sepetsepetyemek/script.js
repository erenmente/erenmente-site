class QRMenu {
    constructor() {
        this.menuVerisi = [];
        this.sepet = JSON.parse(localStorage.getItem("sepet")) || [];
        this.currentCategory = "Hepsi";
        this.searchTerm = "";
        this.init();
    }

    async init() {
        try {
            // Use absolute path to avoid relative path issues
            const response = await fetch("/sepetsepetyemek/data.json");
            if (!response.ok) throw new Error(`HTTP Hata: ${response.status}`);

            this.menuVerisi = await response.json();

            this.renderMenu(this.menuVerisi);
            this.renderCategories();
            this.updateCart();
            this.setupEventListeners();
        } catch (error) {
            console.error("Veri yüklenirken hata oluştu:", error);
            const errMsg = `Veri yüklenemedi! Hata: ${error.message}`;

            if (typeof Swal !== 'undefined') {
                Swal.fire({ icon: 'error', title: 'Hata', text: errMsg });
            } else {
                alert(errMsg);
                document.body.innerHTML = `<div style="color:red; text-align:center; padding:20px;">${errMsg}</div>`;
            }
        }
    }

    setupEventListeners() {
        const searchBar = document.getElementById("search-bar");
        if (searchBar) {
            searchBar.addEventListener("input", (e) => this.handleSearch(e));
        }
    }

    renderMenu(menuListesi) {
        const menuContainer = document.getElementById("menu-container");
        const itemCount = document.getElementById("item-count");

        if (itemCount) {
            itemCount.textContent = `${menuListesi.length} ürün listeleniyor`;
        }

        if (!menuContainer) return;

        let menuHTML = "";

        menuListesi.forEach((yemek, index) => {
            const delay = index * 0.05;

            menuHTML += `
                <div class="col fade-in" style="animation-delay: ${delay}s">
                    <div class="card h-100 shadow-sm">
                        <div class="position-relative">
                            <img src="${yemek.gorsel}" class="card-img-top" alt="${yemek.ad}">
                            <div class="position-absolute top-0 end-0 m-3">
                                <span class="price-badge shadow-sm">${yemek.fiyat}</span>
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-0">${yemek.ad}</h5>
                            </div>
                            <p class="card-text text-muted small flex-grow-1">${yemek.aciklama}</p>
                            
                            <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                                <small class="text-secondary bg-light px-2 py-1 rounded-pill">
                                    <i class="bi bi-tag-fill me-1"></i>${yemek.kategori}
                                </small>
                                <button class="btn-add-cart shadow-sm" onclick="qrMenu.sepeteEkle(${yemek.id})" title="Sepete Ekle">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        menuContainer.innerHTML = menuHTML;
    }

    renderCategories() {
        const btnContainer = document.getElementById("category-wrapper");
        if (!btnContainer) return;

        const kategoriler = ["Hepsi", ...new Set(this.menuVerisi.map(item => item.kategori))];

        const categoryBtns = kategoriler.map(category => {
            const activeClass = category === this.currentCategory ? "active" : "";
            const idAttr = category === "Hepsi" ? 'id="btn-hepsi"' : '';
            return `<button ${idAttr} class="filter-btn ${activeClass}" onclick="qrMenu.setCategory('${category}')">${category}</button>`;
        }).join("");

        btnContainer.innerHTML = categoryBtns;
    }

    resetToAll() {
        this.currentCategory = "Hepsi";
        this.searchTerm = "";

        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
            searchBar.value = '';
        }

        this.filterAndRender();
    }

    setCategory(category) {
        this.currentCategory = category;
        this.filterAndRender();
    }

    handleSearch(e) {
        this.searchTerm = e.target.value.toLowerCase();
        this.filterAndRender();
    }

    filterAndRender() {
        // 1. Filter by Category
        let filtered = this.menuVerisi;
        if (this.currentCategory !== "Hepsi") {
            filtered = filtered.filter(item => item.kategori === this.currentCategory);
        }

        // 2. Filter by Search Term
        if (this.searchTerm) {
            filtered = filtered.filter(item =>
                item.ad.toLowerCase().includes(this.searchTerm) ||
                item.aciklama.toLowerCase().includes(this.searchTerm)
            );
        }

        // 3. Update UI
        this.renderCategories(); // Re-render buttons to update 'active' state
        this.renderMenu(filtered);
    }

    sepeteEkle(id) {
        const yemek = this.menuVerisi.find(item => item.id === id);
        if (yemek) {
            this.sepet.push(yemek);
            this.updateCart();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            Toast.fire({
                icon: 'success',
                title: `${yemek.ad} sepete eklendi`
            });
        }
    }

    sepettenCikar(index) {
        this.sepet.splice(index, 1);
        this.updateCart();
    }

    updateCart() {
        const sepetListesi = document.getElementById("sepet-listesi");
        const mobileSepetListesi = document.getElementById("mobile-sepet-listesi");

        const toplamFiyatSpan = document.getElementById("toplam-fiyat");
        const mobileToplamFiyatSpan = document.getElementById("mobile-toplam-fiyat");
        const mobileCartCount = document.getElementById("mobile-cart-count");

        localStorage.setItem("sepet", JSON.stringify(this.sepet));

        // Helper function to generate cart item HTML
        const generateCartItemHTML = (yemek, index) => `
            <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                <div class="d-flex align-items-center">
                    <div class="ms-2">
                        <h6 class="mb-0 text-dark">${yemek.ad}</h6>
                        <small class="text-muted">${yemek.fiyat}</small>
                    </div>
                </div>
                <button class="btn btn-sm text-danger" onclick="qrMenu.sepettenCikar(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </li>
        `;

        let toplam = 0;
        let cartHTML = "";

        if (this.sepet.length === 0) {
            cartHTML = '<li class="list-group-item text-center text-muted py-4"><i class="bi bi-basket display-6 d-block mb-2"></i>Sepetiniz boş</li>';
        } else {
            this.sepet.forEach((yemek, index) => {
                const fiyatSayi = parseInt(yemek.fiyat.replace(/\D/g, '')) || 0;
                toplam += fiyatSayi;
                cartHTML += generateCartItemHTML(yemek, index);
            });
        }

        // Update Desktop Cart
        if (sepetListesi) sepetListesi.innerHTML = cartHTML;
        if (toplamFiyatSpan) toplamFiyatSpan.innerText = toplam + " ₺";

        // Update Mobile Cart
        if (mobileSepetListesi) mobileSepetListesi.innerHTML = cartHTML;
        if (mobileToplamFiyatSpan) mobileToplamFiyatSpan.innerText = toplam + " ₺";
        if (mobileCartCount) mobileCartCount.innerText = this.sepet.length;

        // Update other badges if any
        const cartBadges = document.querySelectorAll('.cart-badge');
        cartBadges.forEach(badge => badge.innerText = this.sepet.length);
    }

    siparisiTamamla() {
        if (this.sepet.length === 0) {
            Swal.fire({
                title: 'Sepetiniz Boş!',
                text: 'Lütfen sipariş vermek için menüden ürün ekleyin.',
                icon: 'warning',
                confirmButtonColor: '#ff6b6b'
            });
            return;
        }

        const toplamTutarEl = document.getElementById("toplam-fiyat");
        const mobileToplamTutarEl = document.getElementById("mobile-toplam-fiyat");

        // Use whichever is visible or available, fallback to 0
        const toplamTutar = toplamTutarEl ? toplamTutarEl.innerText : (mobileToplamTutarEl ? mobileToplamTutarEl.innerText : "0 ₺");

        Swal.fire({
            title: 'Sipariş Onayı',
            text: `Toplam tutar: ${toplamTutar}. Siparişi onaylıyor musunuz?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4ecdc4',
            cancelButtonColor: '#ff6b6b',
            confirmButtonText: 'Evet, Onayla!',
            cancelButtonText: 'İptal'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Siparişiniz Alındı! 🚀',
                    text: 'Mutfağımız hemen hazırlıklara başlıyor.',
                    icon: 'success',
                    confirmButtonColor: '#4ecdc4'
                });
                this.sepet = [];
                this.updateCart();
            }
        });
    }

    qrKodGoster() {
        Swal.fire({
            title: 'Menüyü Paylaş',
            html: '<div id="qrcode" class="d-flex justify-content-center my-3"></div><p class="text-muted small">Bu kodu okutarak menüye ulaşabilirsiniz.</p>',
            showConfirmButton: true,
            confirmButtonText: 'Kapat',
            confirmButtonColor: '#2d3436',
            didOpen: () => {
                new QRCode(document.getElementById("qrcode"), {
                    text: window.location.href,
                    width: 150,
                    height: 150,
                    colorDark: "#2d3436",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        });
    }
}

const qrMenu = new QRMenu();