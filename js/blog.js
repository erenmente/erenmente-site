/**
 * Blog Page Script
 * Handles blog post loading and filtering
 */

const Blog = {
    state: {
        posts: [],
        categories: [],
        currentFilter: 'all'
    },

    init() {
        this.loadPosts();
    },

    async loadPosts() {
        try {
            const response = await fetch('/data/blog-posts.json');
            const data = await response.json();

            this.state.posts = data.posts || [];
            this.state.categories = data.categories || [];

            this.renderCategories();
            this.renderPosts();
        } catch (error) {
            console.error('Blog posts could not be loaded:', error);
            this.renderError();
        }
    },

    renderCategories() {
        const container = document.getElementById('blog-categories');
        if (!container || !this.state.categories.length) return;

        this.state.categories.forEach(category => {
            const btn = document.createElement('button');
            btn.onclick = () => window.filterBlogPosts(category);
            btn.className = 'blog-category-btn px-4 py-2 text-sm font-medium rounded-lg transition-all glassmorphism dark:bg-slate-800 border border-brand-border dark:border-slate-700 hover:border-brand-primary';
            btn.textContent = category;
            container.appendChild(btn);
        });

        // Global filter function
        window.filterBlogPosts = (category) => {
            this.state.currentFilter = category;
            this.renderPosts();

            document.querySelectorAll('.blog-category-btn').forEach(btn => {
                btn.classList.remove('active', 'bg-brand-primary', 'text-white', 'border-brand-primary');
                btn.classList.add('glassmorphism', 'dark:bg-slate-800');
            });

            event?.target?.classList.add('active', 'bg-brand-primary', 'text-white', 'border-brand-primary');
            event?.target?.classList.remove('glassmorphism', 'dark:bg-slate-800');
        };
    },

    renderPosts() {
        const container = document.getElementById('blog-posts-grid');
        if (!container) return;

        let posts = this.state.posts;

        if (this.state.currentFilter !== 'all') {
            posts = posts.filter(p => p.category === this.state.currentFilter);
        }

        container.innerHTML = '';

        if (posts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-slate-500 dark:text-slate-400">Bu kategoride henüz yazı bulunmuyor.</p>
                </div>
            `;
            return;
        }

        posts.forEach((post, index) => {
            const card = this.createBlogCard(post, index);
            container.appendChild(card);
        });
    },

    createBlogCard(post, index) {
        const card = document.createElement('div');
        card.className = 'group opacity-0 translate-y-10 transition-all duration-700 ease-out';
        card.style.transitionDelay = `${index * 100}ms`;

        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const gradients = [
            'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900',
            'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
            'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30',
            'from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30',
            'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30',
            'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
        ];
        const gradient = gradients[index % gradients.length];

        const categoryColors = {
            'Java': { bg: 'bg-orange-500/10 dark:bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/30', accent: 'from-orange-500 to-amber-500' },
            'Python': { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/30', accent: 'from-blue-500 to-cyan-500' },
            'Web': { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-500', border: 'border-emerald-500/30', accent: 'from-emerald-500 to-teal-500' },
            'Genel': { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-500', border: 'border-purple-500/30', accent: 'from-purple-500 to-pink-500' },
        };
        const colors = categoryColors[post.category] || { bg: 'bg-brand-primary/10', text: 'text-brand-primary', border: 'border-brand-primary/30', accent: 'from-brand-primary to-brand-accent' };

        card.innerHTML = `
            <article class="h-full glassmorphism dark:bg-slate-800 rounded-xl overflow-hidden border border-brand-border dark:border-slate-700 hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300 hover:-translate-y-2 flex flex-col">
                <div class="h-1.5 bg-gradient-to-r ${colors.accent}"></div>
                
                <div class="p-6 flex flex-col flex-1">
                    <div class="flex items-center justify-between mb-4">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${colors.bg} ${colors.text} rounded-full ${colors.border} border">
                            ${post.category}
                        </span>
                        ${post.featured ? '<span class="px-2.5 py-1 bg-brand-primary text-white text-xs font-bold rounded-full shadow-lg">⭐ Öne Çıkan</span>' : ''}
                    </div>
                    
                    <div class="mb-3 text-xs text-slate-500 dark:text-slate-400">
                        ${formattedDate}
                    </div>
                    
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                        ${post.title}
                    </h3>
                    
                    <p class="text-slate-600 dark:text-slate-400 mb-5 line-clamp-3 text-sm leading-relaxed flex-1">
                        ${post.excerpt}
                    </p>
                    
                    <div class="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <a href="/blog/post.html?slug=${post.slug}" 
                           class="text-brand-primary hover:text-brand-hover font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Devamını Oku
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </article>
        `;

        setTimeout(() => {
            card.classList.remove('opacity-0', 'translate-y-10');
            card.classList.add('opacity-100', 'translate-y-0');
        }, 50);

        return card;
    },

    renderError() {
        const container = document.getElementById('blog-posts-grid');
        if (!container) return;

        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-slate-500 dark:text-slate-400">Blog yazıları yüklenirken bir hata oluştu.</p>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => Blog.init());
