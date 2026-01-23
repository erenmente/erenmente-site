/**
 * Eren Mente Portfolio - Main Script
 * Refactored for modularity and performance
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
        this.setupScrollTop();
        this.setupScrollSpy();
        this.setupAnimations();
        this.setupModal();
        this.setupSpotlight();

        // Initial Theme Apply
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
            if (now - lastScroll < 50) return; // Throttle 50ms
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
            menu.classList.toggle('active');
            btn.setAttribute('aria-expanded', this.state.isMenuOpen);
        });

        // Close when link clicked
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.state.isMenuOpen = false;
                menu.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    },

    setupTheme() {
        const toggleBtn = document.getElementById('theme-toggle');
        const dropdown = document.getElementById('theme-dropdown');

        if (!toggleBtn || !dropdown) return;

        // Toggle Dropdown
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });

        // System Preference Listener
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (this.state.theme === 'system') {
                this.applyTheme('system');
            }
        });

        // Expose selection globally for HTML onclicks
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

        // Hide all icons
        Object.values(icons).forEach(icon => icon && icon.classList.add('hidden'));

        // Show active icon
        if (icons[mode]) icons[mode].classList.remove('hidden');

        // Apply Class
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else if (mode === 'light') {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            // System
            localStorage.setItem('color-theme', 'system');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
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

    setupScrollTop() {
        const btn = document.getElementById('scroll-top-btn');
        if (!btn) return;

        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTop < 100) return;
            lastScrollTop = now;

            if (window.scrollY > 300) {
                btn.classList.remove('translate-y-20', 'opacity-0');
            } else {
                btn.classList.add('translate-y-20', 'opacity-0');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    setupScrollSpy() {
        const sections = document.querySelectorAll('header[id], section[id]');
        const navLinks = document.querySelectorAll('.space-x-8 a, #mobile-menu a');

        let lastScrollSpy = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollSpy < 100) return;
            lastScrollSpy = now;

            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-brand-primary', 'font-bold');
                link.classList.add('text-brand-text', 'dark:text-slate-300');

                if (link.getAttribute('href').includes(current) && current !== '') {
                    link.classList.add('text-brand-primary', 'font-bold');
                    link.classList.remove('text-brand-text', 'dark:text-slate-300');
                }
            });
        });
    },

    setupAnimations() {
        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('#skills .group, #experience .group, #projects .group');
        elements.forEach((el, index) => {
            el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');

            if (el.closest('#skills')) {
                el.style.transitionDelay = `${(index % 4) * 100}ms`;
            }

            observer.observe(el);
        });
    },

    setupModal() {
        const modal = document.getElementById('version-modal');
        const backdrop = document.getElementById('modal-backdrop');
        const panel = document.getElementById('modal-panel');

        if (!modal) return;

        window.toggleModal = (show) => {
            if (show) {
                modal.classList.remove('hidden');
                setTimeout(() => {
                    backdrop.classList.remove('opacity-0');
                    panel.classList.remove('opacity-0', 'translate-y-4');
                }, 10);
            } else {
                backdrop.classList.add('opacity-0');
                panel.classList.add('opacity-0', 'translate-y-4');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        };
    },

    setupSpotlight() {
        const wrapper = document.getElementById('spotlight-wrapper');
        if (!wrapper) return;

        // Tech keywords related to the portfolio
        const techWords = [
            'Java', 'Python', 'Spring', 'React', 'Docker', 'AWS', 'SQL',
            'Git', 'Linux', 'DevOps', 'Azure', 'Kubernetes', 'Büyük Veri',
            'Yapay Zeka', 'Algoritma', 'Backend', 'Frontend', 'Fullstack',
            'REST API', 'Microservices', 'Clean Code', 'System Design',
            'Redis', 'PostgreSQL', 'MongoDB', 'Kafka', 'CI/CD', 'Maven'
        ];

        // Generate dense grid of words
        let html = '';
        const density = 200; // Total words

        for (let i = 0; i < density; i++) {
            const word = techWords[Math.floor(Math.random() * techWords.length)];
            const top = Math.floor(Math.random() * 100);
            const left = Math.floor(Math.random() * 100);
            const fontSize = Math.random() * 0.5 + 0.5; // 0.5rem to 1rem
            const opacity = Math.random() * 0.5 + 0.1;

            html += `<span class="spotlight-word" style="top: ${top}%; left: ${left}%; font-size: ${fontSize}rem; opacity: ${opacity}">${word}</span>`;
        }

        wrapper.innerHTML = html;

        // Track mouse movement
        // Track mouse movement with throttle
        let lastMouse = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMouse < 20) return; // 50fps max
            lastMouse = now;

            const x = e.clientX;
            const y = e.clientY;
            wrapper.style.setProperty('--mouse-x', `${x}px`);
            wrapper.style.setProperty('--mouse-y', `${y}px`);
        });

        // Initialize at center
        wrapper.style.setProperty('--mouse-x', '50%');
        wrapper.style.setProperty('--mouse-y', '50%');
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => App.init());
