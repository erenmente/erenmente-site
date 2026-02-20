/**
 * Pages Common Script
 * Handles navigation, footer, theme and common functionality for all pages
 */

const Pages = {
    state: {
        theme: localStorage.getItem('color-theme') || 'system'
    },

    init() {
        this.loadNavigation();
        this.loadFooter();
        this.setupTheme();
        this.updateYear();
        this.setupMobileMenu();
    },

    loadNavigation() {
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (!navPlaceholder) return;

        const currentPage = window.location.pathname;

        const isActive = (page) => currentPage.includes(page) ? 'text-brand-primary font-bold' : 'text-brand-text dark:text-slate-300 hover:text-brand-primary';
        const isMobileActive = (page) => currentPage.includes(page) ? 'text-brand-primary bg-indigo-50 dark:bg-slate-800' : 'text-brand-text dark:text-slate-300 hover:text-brand-primary hover:bg-indigo-50 dark:hover:bg-slate-800';

        navPlaceholder.innerHTML = `
            <nav class="fixed w-full z-50 glassmorphism dark:bg-brand-dark-surface/80 backdrop-blur-md border-b border-brand-border dark:border-brand-dark-border transition-all duration-300">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex-shrink-0 cursor-pointer group">
                            <a href="/" class="text-2xl font-extrabold tracking-tight">
                                <span class="holographic-bg">erenmente</span>
                            </a>
                        </div>

                        <div class="hidden md:block">
                            <div class="ml-10 flex items-center space-x-8">
                                <a href="/pages/about.html" class="${isActive('about')} transition-colors px-3 py-2 rounded-md text-sm font-medium">Hakkımda</a>
                                <a href="/pages/blog.html" class="${isActive('blog')} transition-colors px-3 py-2 rounded-md text-sm font-medium">Blog</a>
                                <a href="/pages/projects.html" class="${isActive('projects')} transition-colors px-3 py-2 rounded-md text-sm font-medium">Projeler</a>
                                <a href="/pages/contact.html" class="bg-brand-primary hover:bg-brand-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:scale-105">İletişim</a>

                                <div class="relative ml-4">
                                    <button id="theme-toggle" type="button" aria-label="Temayı Değiştir" class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5">
                                        <svg id="icon-display-dark" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                                        <svg id="icon-display-light" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                        <svg id="icon-display-system" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm2 0v8h10V5H5z" clip-rule="evenodd"></path></svg>
                                    </button>
                                    <div id="theme-dropdown" class="hidden absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden">
                                        <ul class="text-sm text-gray-700 dark:text-gray-200">
                                            <li><button type="button" onclick="selectTheme('light')" class="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">☀️ Aydınlık</button></li>
                                            <li><button type="button" onclick="selectTheme('dark')" class="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">🌙 Karanlık</button></li>
                                            <li><button type="button" onclick="selectTheme('system')" class="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">💻 Sistem</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="md:hidden">
                            <button id="mobile-menu-btn" aria-label="Menüyü Aç" class="text-brand-text dark:text-slate-300 hover:text-brand-primary focus:outline-none">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div id="mobile-menu" class="md:hidden glassmorphism dark:bg-brand-dark-surface border-b border-brand-border dark:border-brand-dark-border hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                        <a href="/pages/about.html" class="block px-3 py-2 rounded-md text-base font-medium ${isMobileActive('about')}">Hakkımda</a>
                        <a href="/pages/blog.html" class="block px-3 py-2 rounded-md text-base font-medium ${isMobileActive('blog')}">Blog</a>
                        <a href="/pages/projects.html" class="block px-3 py-2 rounded-md text-base font-medium ${isMobileActive('projects')}">Projeler</a>
                        <a href="/pages/contact.html" class="block px-3 py-2 rounded-md text-base font-medium text-white bg-brand-primary hover:bg-brand-hover shadow-md shadow-brand-primary/20">İletişim</a>
                    </div>
                </div>
            </nav>
        `;
    },

    loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;

        footerPlaceholder.innerHTML = `
            <footer class="bg-brand-surface/60 dark:bg-brand-dark-surface/60 backdrop-blur-sm border-t border-brand-border dark:border-brand-dark-border py-8">
                <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-slate-500 dark:text-slate-400 text-sm">&copy; <span id="year">${new Date().getFullYear()}</span> Eren Mente.</p>
                    <div class="flex space-x-6">
                        <a href="https://github.com/erenmente" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/erenmente/" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-[#0077b5] transition-colors" aria-label="LinkedIn">
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                    </div>
                </div>
            </footer>
        `;
    },

    setupTheme() {
        // Apply initial theme
        this.applyTheme(this.state.theme);

        // Wait for nav to be loaded
        setTimeout(() => {
            const toggleBtn = document.getElementById('theme-toggle');
            const dropdown = document.getElementById('theme-dropdown');

            if (toggleBtn && dropdown) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('hidden');
                });

                document.addEventListener('click', (e) => {
                    if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
                        dropdown.classList.add('hidden');
                    }
                });
            }

            // System preference listener
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (this.state.theme === 'system') {
                    this.applyTheme('system');
                }
            });

            // Global function
            window.selectTheme = (mode) => {
                this.state.theme = mode;
                this.applyTheme(mode);
                document.getElementById('theme-dropdown')?.classList.add('hidden');
            };
        }, 100);
    },

    applyTheme(mode) {
        const html = document.documentElement;
        html.classList.remove('light', 'dark');

        if (mode === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            html.classList.add(mode);
        }

        localStorage.setItem('color-theme', mode);

        // Update icons after nav loads
        setTimeout(() => {
            const icons = {
                light: document.getElementById('icon-display-light'),
                dark: document.getElementById('icon-display-dark'),
                system: document.getElementById('icon-display-system')
            };
            Object.values(icons).forEach(icon => icon?.classList.add('hidden'));
            icons[mode]?.classList.remove('hidden');
        }, 100);
    },

    updateYear() {
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    },

    setupMobileMenu() {
        setTimeout(() => {
            const btn = document.getElementById('mobile-menu-btn');
            const menu = document.getElementById('mobile-menu');

            if (btn && menu) {
                btn.addEventListener('click', () => {
                    menu.classList.toggle('hidden');
                });

                menu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        menu.classList.add('hidden');
                    });
                });
            }
        }, 100);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => Pages.init());
