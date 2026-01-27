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
        this.setupSkillsAnimation();
        this.setupLoadingScreen();
        this.setupTechStack();
        this.setupBlog();

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

        const html = document.documentElement;
        const themeButtons = document.querySelectorAll('[data-theme]');

        // Clear all classes
        html.classList.remove('light', 'dark');

        if (mode === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            html.classList.add(mode);
        }

        // Store preference
        localStorage.setItem('color-theme', mode);

        // Update active button state
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === mode) {
                btn.classList.add('bg-brand-primary/10', 'text-brand-primary');
            } else {
                btn.classList.remove('bg-brand-primary/10', 'text-brand-primary');
            }
        });
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

    setupSkillsAnimation() {
        const skillItems = document.querySelectorAll('.skill-item');
        if (!skillItems.length) return;

        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.remove('opacity-0');
                        entry.target.classList.add('opacity-100', 'translate-y-0');

                        // Animate progress bar
                        const progressBar = entry.target.querySelector('.skill-bar');
                        const percentage = entry.target.querySelector('.skill-percentage');
                        const targetProgress = parseInt(progressBar.dataset.progress);

                        setTimeout(() => {
                            progressBar.style.width = targetProgress + '%';

                            // Animate percentage number
                            let current = 0;
                            const interval = setInterval(() => {
                                current++;
                                percentage.textContent = current + '%';
                                if (current >= targetProgress) {
                                    clearInterval(interval);
                                }
                            }, 15);
                        }, 100);
                    }, index * 100);

                    skillObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        skillItems.forEach(item => {
            item.classList.add('translate-y-10', 'transition-all', 'duration-700', 'ease-out');
            skillObserver.observe(item);
        });
    },

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        // Hide loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 800);
        });
    },

    setupTechStack() {
        // Load tech stack data
        fetch('./data/tech-stack.json')
            .then(response => response.json())
            .then(data => {
                this.renderTechStack(data.technologies || []);
            })
            .catch(error => {
                console.error('Tech stack could not be loaded:', error);
                document.getElementById('tech-stack-grid').innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <p class="text-slate-500 dark:text-slate-400">Teknolojiler yüklenirken bir hata oluştu.</p>
                    </div>
                `;
            });
    },

    renderTechStack(technologies) {
        const container = document.getElementById('tech-stack-grid');
        if (!container) return;

        container.innerHTML = '';

        technologies.forEach((tech, index) => {
            const card = document.createElement('div');
            card.className = 'tech-card group opacity-0 translate-y-10 transition-all duration-700 ease-out';
            card.style.transitionDelay = `${index * 50}ms`;

            card.innerHTML = `
                <div class="relative h-32 glassmorphism dark:bg-slate-800 rounded-xl border border-brand-border dark:border-slate-700 hover:border-brand-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-primary/20 overflow-hidden cursor-default">
                    <!-- Icon Badge -->
                    <div class="absolute top-3 left-3 text-3xl filter drop-shadow-lg">
                        ${tech.icon}
                    </div>
                    
                    <!-- Content -->
                    <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white/90 to-transparent dark:from-slate-900/90">
                        <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-1 truncate">
                            ${tech.name}
                        </h3>
                        <span class="inline-block px-2 py-0.5 text-xs bg-brand-primary/10 text-brand-primary rounded-full">
                            ${tech.category}
                        </span>
                    </div>

                    <!-- Hover Effect Background -->
                    <div class="absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-5 transition-opacity duration-300"></div>
                </div>
            `;

            setTimeout(() => {
                card.classList.remove('opacity-0', 'translate-y-10');
                card.classList.add('opacity-100', 'translate-y-0');
            }, 50);

            container.appendChild(card);
        });
    },

    setupBlog() {
        this.state.blogPosts = [];
        this.state.blogCategories = [];
        this.state.currentBlogFilter = 'all';

        // Load blog data
        fetch('./data/blog-posts.json')
            .then(response => response.json())
            .then(data => {
                this.state.blogPosts = data.posts || [];
                this.state.blogCategories = data.categories || [];

                this.renderBlogCategories();
                this.renderBlogPosts();
            })
            .catch(error => {
                console.error('Blog posts could not be loaded:', error);
                document.getElementById('blog-posts-grid').innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <p class="text-slate-500 dark:text-slate-400">Blog yazıları yüklenirken bir hata oluştu.</p>
                    </div>
                `;
            });

        // Expose filter function globally
        window.filterBlogPosts = (category) => {
            this.state.currentBlogFilter = category;
            this.renderBlogPosts();

            // Update active button
            document.querySelectorAll('.blog-category-btn').forEach(btn => {
                btn.classList.remove('active', 'bg-brand-primary', 'text-white', 'border-brand-primary');
                btn.classList.add('glassmorphism', 'dark:bg-slate-800');
            });

            event.target.classList.add('active', 'bg-brand-primary', 'text-white', 'border-brand-primary');
            event.target.classList.remove('glassmorphism', 'dark:bg-slate-800');
        };
    },

    renderBlogCategories() {
        const container = document.getElementById('blog-categories');
        if (!container || !this.state.blogCategories.length) return;

        this.state.blogCategories.forEach(category => {
            const btn = document.createElement('button');
            btn.onclick = () => window.filterBlogPosts(category);
            btn.className = 'blog-category-btn px-4 py-2 text-sm font-medium rounded-lg transition-all glassmorphism dark:bg-slate-800 border border-brand-border dark:border-slate-700 hover:border-brand-primary';
            btn.textContent = category;
            container.appendChild(btn);
        });
    },

    renderBlogPosts() {
        const container = document.getElementById('blog-posts-grid');
        if (!container) return;

        let posts = this.state.blogPosts;

        // Filter posts
        if (this.state.currentBlogFilter !== 'all') {
            posts = posts.filter(post => post.category === this.state.currentBlogFilter);
        }

        // Clear container
        container.innerHTML = '';

        if (posts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-slate-500 dark:text-slate-400">Bu kategoride henüz yazı bulunmuyor.</p>
                </div>
            `;
            return;
        }

        // Render posts
        posts.forEach((post, index) => {
            const card = this.createBlogCard(post, index);
            container.appendChild(card);
        });
    },

    createBlogCard(post, index) {
        const card = document.createElement('div');
        card.className = 'group opacity-0 translate-y-10 transition-all duration-700 ease-out';
        card.style.transitionDelay = `${index * 100}ms`;

        // Format date
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create placeholder with your preferred colors: mavi, sarı, kırmızı, siyah, gri, beyaz
        const gradients = [
            'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900',        // Gri/Siyah/Beyaz
            'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',      // Mavi
            'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30',          // Açık Mavi
            'from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30', // Sarı
            'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30',          // Kırmızı
            'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'             // Gri
        ];
        const gradient = gradients[index % gradients.length];

        card.innerHTML = `
            <article class="h-full glassmorphism dark:bg-slate-800 rounded-xl overflow-hidden border border-brand-border dark:border-slate-700 hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300 hover:-translate-y-2">
                <div class="relative h-48 bg-gradient-to-br ${gradient} overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center text-slate-400 dark:text-slate-500">
                            <svg class="w-16 h-16 mx-auto opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    ${post.featured ? '<span class="absolute top-4 right-4 px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full shadow-lg">⭐ Öne Çıkan</span>' : ''}
                </div>
                
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-3 text-sm text-slate-500 dark:text-slate-400">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            ${formattedDate}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ${post.readTime} dk
                        </span>
                    </div>
                    
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                        ${post.title}
                    </h3>
                    
                    <p class="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                        ${post.excerpt}
                    </p>
                    
                    <div class="flex items-center justify-between">
                        <span class="inline-block px-3 py-1 text-xs font-semibold bg-brand-primary/10 text-brand-primary rounded-full">
                            ${post.category}
                        </span>
                        
                        <button onclick="alert('Blog detay sayfası yakında eklenecek!')" 
                            class="text-brand-primary hover:text-brand-hover font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Devamını Oku
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </article>
        `;

        // Trigger animation
        setTimeout(() => {
            card.classList.remove('opacity-0', 'translate-y-10');
            card.classList.add('opacity-100', 'translate-y-0');
        }, 50);

        return card;
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => App.init());
