/**
 * Blog Post Page Script
 * Handles dynamic loading of blog posts from JSON
 */

const BlogPost = {
    state: {
        posts: [],
        currentPost: null,
        theme: localStorage.getItem('color-theme') || 'system'
    },

    async init() {
        this.updateYear();
        this.setupTheme();
        this.setupReadingProgress();
        await this.loadPost();
    },

    updateYear() {
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    },

    setupTheme() {
        const toggleBtn = document.getElementById('theme-toggle');
        const iconDark = document.getElementById('icon-dark');
        const iconLight = document.getElementById('icon-light');

        // Apply initial theme
        this.applyTheme(this.state.theme);

        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');
            this.state.theme = isDark ? 'light' : 'dark';
            this.applyTheme(this.state.theme);
        });
    },

    applyTheme(mode) {
        const html = document.documentElement;
        const iconDark = document.getElementById('icon-dark');
        const iconLight = document.getElementById('icon-light');

        html.classList.remove('light', 'dark');

        let isDark = false;
        if (mode === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            isDark = mode === 'dark';
        }

        html.classList.add(isDark ? 'dark' : 'light');
        localStorage.setItem('color-theme', mode);

        // Update icons
        if (iconDark && iconLight) {
            iconDark.classList.toggle('hidden', isDark);
            iconLight.classList.toggle('hidden', !isDark);
        }
    },

    setupReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    },

    async loadPost() {
        const loadingState = document.getElementById('loading-state');
        const errorState = document.getElementById('error-state');
        const postContent = document.getElementById('post-content');

        // Get slug from URL
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (!slug) {
            this.showError();
            return;
        }
        try {
            // Fetch blog posts - try multiple paths for compatibility
            let response;
            try {
                response = await fetch('/data/blog-posts.json');
                if (!response.ok) throw new Error('Not found');
            } catch (e) {
                response = await fetch('../data/blog-posts.json');
            }
            const data = await response.json();
            this.state.posts = data.posts || [];

            // Find current post
            const postIndex = this.state.posts.findIndex(p => p.slug === slug);

            if (postIndex === -1) {
                this.showError();
                return;
            }

            this.state.currentPost = this.state.posts[postIndex];
            this.renderPost(this.state.currentPost, postIndex);

            // Hide loading, show content
            loadingState.classList.add('hidden');
            postContent.classList.remove('hidden');

            // Update page title and meta
            document.title = `${this.state.currentPost.title} | Eren Mente`;

        } catch (error) {
            console.error('Failed to load blog post:', error);
            this.showError();
        }
    },

    showError() {
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
    },

    renderPost(post, currentIndex) {
        // Category
        document.getElementById('post-category').textContent = post.category;

        // Title
        document.getElementById('post-title').textContent = post.title;

        // Author
        document.getElementById('post-author').textContent = post.author;

        // Date
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('post-date').textContent = formattedDate;

        // Tags
        const tagsContainer = document.getElementById('post-tags');
        if (post.tags && post.tags.length > 0) {
            tagsContainer.innerHTML = post.tags.map(tag =>
                `<span class="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">${tag}</span>`
            ).join('');
        }

        // Body content
        const bodyContent = this.formatContent(post.content);
        document.getElementById('post-body').innerHTML = bodyContent;

        // Previous/Next navigation
        this.setupNavigation(currentIndex);
    },

    formatContent(content) {
        // Simple content formatting - replace \n\n with paragraph breaks
        // In a real scenario, you might use a markdown parser
        const paragraphs = content.split('\n\n').filter(p => p.trim());

        return paragraphs.map(p => {
            // Check if it's a heading (starts with ##)
            if (p.startsWith('## ')) {
                return `<h2 class="text-2xl font-bold mt-8 mb-4">${p.replace('## ', '')}</h2>`;
            }
            if (p.startsWith('### ')) {
                return `<h3 class="text-xl font-bold mt-6 mb-3">${p.replace('### ', '')}</h3>`;
            }
            // Check for code blocks
            if (p.startsWith('```')) {
                const codeContent = p.replace(/```\w*\n?/g, '').trim();
                return `<pre class="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto my-4"><code>${this.escapeHtml(codeContent)}</code></pre>`;
            }
            // Regular paragraph
            return `<p class="mb-4">${p}</p>`;
        }).join('');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    setupNavigation(currentIndex) {
        const prevLink = document.getElementById('prev-post');
        const nextLink = document.getElementById('next-post');
        const prevTitle = document.getElementById('prev-post-title');
        const nextTitle = document.getElementById('next-post-title');

        // Previous post (newer, lower index)
        if (currentIndex > 0) {
            const prevPost = this.state.posts[currentIndex - 1];
            prevLink.href = `post.html?slug=${prevPost.slug}`;
            prevTitle.textContent = prevPost.title;
            prevLink.classList.remove('hidden');
        }

        // Next post (older, higher index)
        if (currentIndex < this.state.posts.length - 1) {
            const nextPost = this.state.posts[currentIndex + 1];
            nextLink.href = `post.html?slug=${nextPost.slug}`;
            nextTitle.textContent = nextPost.title;
            nextLink.classList.remove('hidden');
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => BlogPost.init());
