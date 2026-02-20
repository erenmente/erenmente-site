/**
 * Projects Page - GitHub API Integration
 * Fetches and displays repositories from GitHub
 */

const Projects = {
    state: {
        repos: [],
        languages: [],
        currentFilter: 'all'
    },

    // Live demo URLs for specific repos
    liveUrls: {
        'yemek-sepeti-js': 'https://www.erenmente.com/sepetsepetyemek',
        'ders-asistani': 'https://www.erenmente.com/firatasistan',
        'erenmente-site': 'https://www.erenmente.com'
    },

    // Custom descriptions for repos without description
    customDescriptions: {
        'erenmente': 'GitHub profil README dosyam'
    },

    // Emojis for languages
    languageEmojis: {
        'Java': '☕',
        'JavaScript': '⚡',
        'Python': '🐍',
        'HTML': '🌐',
        'CSS': '🎨',
        'TypeScript': '💙',
        'null': '📁'
    },

    init() {
        this.fetchRepos();
    },

    async fetchRepos() {
        try {
            const response = await fetch('https://api.github.com/users/erenmente/repos?sort=updated&per_page=30');
            const data = await response.json();

            // Filter out forked repos
            this.state.repos = data.filter(repo => !repo.fork);

            // Extract unique languages
            const langs = [...new Set(this.state.repos.map(r => r.language).filter(Boolean))];
            this.state.languages = langs;

            this.renderLanguageFilter();
            this.renderProjects();
        } catch (error) {
            console.error('GitHub API error:', error);
            this.renderError();
        }
    },

    renderLanguageFilter() {
        const container = document.getElementById('language-filter');
        if (!container) return;

        this.state.languages.forEach(lang => {
            const btn = document.createElement('button');
            btn.onclick = () => this.filterProjects(lang);
            btn.className = 'filter-btn px-4 py-2 text-sm font-medium rounded-lg transition-all glassmorphism dark:bg-slate-800 border border-brand-border dark:border-slate-700 hover:border-brand-primary';
            btn.innerHTML = `${this.languageEmojis[lang] || '💻'} ${lang}`;
            container.appendChild(btn);
        });

        // Expose filter function globally
        window.filterProjects = (lang) => this.filterProjects(lang);
    },

    filterProjects(language) {
        this.state.currentFilter = language;
        this.renderProjects();

        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-brand-primary', 'text-white', 'border-brand-primary');
            btn.classList.add('glassmorphism', 'dark:bg-slate-800');
        });

        event?.target?.classList.add('active', 'bg-brand-primary', 'text-white', 'border-brand-primary');
        event?.target?.classList.remove('glassmorphism', 'dark:bg-slate-800');
    },

    renderProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        let repos = this.state.repos;

        if (this.state.currentFilter !== 'all') {
            repos = repos.filter(r => r.language === this.state.currentFilter);
        }

        container.innerHTML = '';

        if (repos.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-slate-500 dark:text-slate-400">Bu kategoride proje bulunamadı.</p>
                </div>
            `;
            return;
        }

        repos.forEach((repo, index) => {
            const card = this.createProjectCard(repo, index);
            container.appendChild(card);
        });
    },

    createProjectCard(repo, index) {
        const card = document.createElement('div');
        card.className = 'group opacity-0 translate-y-10 transition-all duration-700 ease-out';
        card.style.transitionDelay = `${index * 100}ms`;

        const emoji = this.languageEmojis[repo.language] || '📁';
        const description = repo.description || this.customDescriptions[repo.name] || 'Açıklama eklenmemiş';
        const liveUrl = repo.homepage || this.liveUrls[repo.name];
        const updatedAt = new Date(repo.updated_at).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Topics/tags
        const topics = repo.topics?.slice(0, 3) || [];

        card.innerHTML = `
            <article class="h-full glassmorphism dark:bg-slate-800 rounded-xl overflow-hidden border border-brand-border dark:border-slate-700 hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300 hover:-translate-y-2 flex flex-col">
                <!-- Header -->
                <div class="p-6 flex-1">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">${emoji}</span>
                            <div>
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                                    ${repo.name}
                                </h3>
                                ${repo.language ? `<span class="text-xs text-slate-500 dark:text-slate-400">${repo.language}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span class="flex items-center gap-1" title="Yıldızlar">⭐ ${repo.stargazers_count}</span>
                        </div>
                    </div>

                    <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                        ${description}
                    </p>

                    ${topics.length > 0 ? `
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${topics.map(t => `<span class="px-2 py-1 text-xs bg-brand-primary/10 text-brand-primary rounded-full">${t}</span>`).join('')}
                        </div>
                    ` : ''}

                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        Güncelleme: ${updatedAt}
                    </p>
                </div>

                <!-- Actions -->
                <div class="p-4 pt-0 flex gap-2">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
                       class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-all">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
                        GitHub
                    </a>
                    ${liveUrl ? `
                        <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" 
                           class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all">
                            🚀 Canlı Demo
                        </a>
                    ` : ''}
                </div>
            </article>
        `;

        // Trigger animation
        setTimeout(() => {
            card.classList.remove('opacity-0', 'translate-y-10');
            card.classList.add('opacity-100', 'translate-y-0');
        }, 50);

        return card;
    },

    renderError() {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-slate-500 dark:text-slate-400">Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
            </div>
        `;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => Projects.init());
