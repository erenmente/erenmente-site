/**
 * Eren Mente Portfolio - Main Script
 * Homepage functionality only
 */

const App = {
    state: {
        isMenuOpen: false,
        theme: localStorage.getItem('color-theme') || 'system',
        isDeleting: false,
        textIndex: 0,
        charIndex: 0,
        texts: ['Yazılım Mühendisliği Öğrencisi', 'Java Geliştirici', 'Python Tutkunu', 'Backend Developer']
    },

    init() {
        this.updateYear();
        this.setupNavbar();
        this.setupMobileMenu();
        this.setupTheme();
        this.setupTypingEffect();
        this.setupLoadingScreen();
        this.applyTheme(this.state.theme);
    },

    updateYear() {
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    },

    setupNavbar() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScroll < 50) return;
            lastScroll = now;

            if (window.scrollY > 10) {
                nav.classList.add('shadow-lg', 'bg-white/95', 'dark:bg-slate-900/95');
                nav.classList.remove('bg-white/80', 'dark:bg-slate-900/80');
            } else {
                nav.classList.remove('shadow-lg', 'bg-white/95', 'dark:bg-slate-900/95');
                nav.classList.add('bg-white/80', 'dark:bg-slate-900/80');
            }
        });
    },

    setupMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            this.state.isMenuOpen = !this.state.isMenuOpen;
            menu.classList.toggle('hidden');
            btn.setAttribute('aria-expanded', this.state.isMenuOpen);
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.state.isMenuOpen = false;
                menu.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    },

    setupTheme() {
        const toggleBtn = document.getElementById('theme-toggle');
        const dropdown = document.getElementById('theme-dropdown');

        if (!toggleBtn || !dropdown) return;

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (this.state.theme === 'system') {
                this.applyTheme('system');
            }
        });

        window.selectTheme = (mode) => {
            this.state.theme = mode;
            this.applyTheme(mode);
            dropdown.classList.add('hidden');
        };
    },

    applyTheme(mode) {
        const icons = {
            light: document.getElementById('icon-display-light'),
            dark: document.getElementById('icon-display-dark'),
            system: document.getElementById('icon-display-system')
        };

        Object.values(icons).forEach(icon => icon && icon.classList.add('hidden'));
        if (icons[mode]) icons[mode].classList.remove('hidden');

        const html = document.documentElement;
        html.classList.remove('light', 'dark');

        if (mode === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            html.classList.add(mode);
        }

        localStorage.setItem('color-theme', mode);
    },

    setupTypingEffect() {
        const textElement = document.getElementById('typing-text');
        if (!textElement) return;

        const type = () => {
            const currentText = this.state.texts[this.state.textIndex];
            let typeSpeed = 100;

            if (this.state.isDeleting) {
                textElement.textContent = currentText.substring(0, this.state.charIndex - 1);
                this.state.charIndex--;
                typeSpeed = 50;
            } else {
                textElement.textContent = currentText.substring(0, this.state.charIndex + 1);
                this.state.charIndex++;
                typeSpeed = 100;
            }

            if (!this.state.isDeleting && this.state.charIndex === currentText.length) {
                this.state.isDeleting = true;
                typeSpeed = 2000;
            } else if (this.state.isDeleting && this.state.charIndex === 0) {
                this.state.isDeleting = false;
                this.state.textIndex = (this.state.textIndex + 1) % this.state.texts.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        type();
    },

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 800);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
