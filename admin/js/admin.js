/**
 * Admin Panel JavaScript
 * Handles authentication, CRUD operations, and UI management
 */

const Admin = {
    token: localStorage.getItem('admin_token') || null,
    posts: [],
    tags: [],

    // --- Initialization ---
    async init() {
        if (this.token) {
            const valid = await this.verifyToken();
            if (valid) {
                this.showDashboard();
                return;
            }
        }
        this.showLogin();
    },

    // --- Auth ---
    async login(event) {
        event.preventDefault();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        const btn = document.getElementById('login-btn');

        errorEl.textContent = '';
        btn.innerHTML = '<span class="spinner"></span> Giriş yapılıyor...';
        btn.disabled = true;

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                this.token = data.token;
                localStorage.setItem('admin_token', data.token);
                this.showToast('Giriş başarılı!', 'success');
                this.showDashboard();
            } else {
                errorEl.textContent = data.error || 'Giriş başarısız';
            }
        } catch (err) {
            errorEl.textContent = 'Sunucuya bağlanılamadı';
        }

        btn.innerHTML = 'Giriş Yap';
        btn.disabled = false;
    },

    async verifyToken() {
        try {
            const res = await fetch('/api/admin/verify', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            return res.ok;
        } catch {
            return false;
        }
    },

    logout() {
        this.token = null;
        localStorage.removeItem('admin_token');
        this.showLogin();
        this.showToast('Çıkış yapıldı', 'success');
    },

    // --- Navigation ---
    showLogin() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('admin-layout').classList.remove('active');
    },

    showDashboard() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-layout').classList.add('active');
        this.loadStats();
        this.loadPosts();
    },

    navigate(section) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        event.target.closest('.nav-item')?.classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${section}`)?.classList.add('active');

        // Load data
        if (section === 'dashboard') this.loadStats();
        if (section === 'posts') this.loadPosts();
    },

    // --- API Helper ---
    async apiRequest(url, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);
        const data = await res.json();

        if (res.status === 401) {
            this.logout();
            this.showToast('Oturum süresi doldu, tekrar giriş yapın', 'error');
            throw new Error('Unauthorized');
        }

        if (!res.ok) {
            throw new Error(data.error || 'Bir hata oluştu');
        }

        return data;
    },

    // --- Dashboard ---
    async loadStats() {
        try {
            const stats = await this.apiRequest('/api/admin/stats');

            document.getElementById('stat-posts').textContent = stats.totalPosts;
            document.getElementById('stat-categories').textContent = stats.totalCategories;
            document.getElementById('stat-featured').textContent = stats.featuredPosts;

            // Render category distribution
            const grid = document.getElementById('category-grid');
            if (stats.categoryCounts && Object.keys(stats.categoryCounts).length > 0) {
                grid.innerHTML = Object.entries(stats.categoryCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => `
                        <div class="category-card">
                            <div class="cat-count">${count}</div>
                            <div class="cat-name">${name}</div>
                        </div>
                    `).join('');
            } else {
                grid.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">Henüz veri yok</p>';
            }
        } catch (err) {
            console.error('Stats load error:', err);
        }
    },

    // --- Posts ---
    async loadPosts() {
        try {
            const data = await this.apiRequest('/api/admin/posts');
            this.posts = data.posts || [];
            this.renderPosts();
        } catch (err) {
            console.error('Posts load error:', err);
        }
    },

    renderPosts() {
        const list = document.getElementById('posts-list');
        const count = document.getElementById('posts-count');

        count.textContent = `${this.posts.length} yazı`;

        if (this.posts.length === 0) {
            list.innerHTML = `
                <li class="empty-state">
                    <div class="empty-icon">📄</div>
                    <p>Henüz blog yazısı eklenmemiş</p>
                </li>
            `;
            return;
        }

        list.innerHTML = this.posts.map(post => {
            const date = new Date(post.date).toLocaleDateString('tr-TR', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            return `
                <li class="post-item">
                    <div class="post-info">
                        <h4>${post.featured ? '⭐ ' : ''}${this.escapeHtml(post.title)}</h4>
                        <div class="post-meta">
                            <span class="post-category">${this.escapeHtml(post.category)}</span>
                            <span>${date}</span>
                            <span>${post.readTime || 5} dk okuma</span>
                        </div>
                    </div>
                    <div class="post-actions">
                        <button class="btn btn-secondary btn-sm" onclick="Admin.editPost(${post.id})">✏️ Düzenle</button>
                        <button class="btn btn-danger btn-sm" onclick="Admin.deletePost(${post.id})">🗑️</button>
                    </div>
                </li>
            `;
        }).join('');
    },

    // --- Post Modal ---
    openNewPostModal() {
        document.getElementById('modal-title').textContent = 'Yeni Yazı';
        document.getElementById('post-id').value = '';
        document.getElementById('post-title').value = '';
        document.getElementById('post-category').value = 'Java';
        document.getElementById('post-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('post-readtime').value = 5;
        document.getElementById('post-featured').checked = false;
        document.getElementById('post-excerpt').value = '';
        document.getElementById('post-content').value = '';
        this.tags = [];
        this.renderTags();
        document.getElementById('post-modal').classList.add('active');
    },

    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        document.getElementById('modal-title').textContent = 'Yazıyı Düzenle';
        document.getElementById('post-id').value = post.id;
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-date').value = post.date;
        document.getElementById('post-readtime').value = post.readTime || 5;
        document.getElementById('post-featured').checked = post.featured || false;
        document.getElementById('post-excerpt').value = post.excerpt;
        document.getElementById('post-content').value = post.content || '';
        this.tags = post.tags || [];
        this.renderTags();
        document.getElementById('post-modal').classList.add('active');
    },

    closeModal() {
        document.getElementById('post-modal').classList.remove('active');
    },

    async savePost() {
        const btn = document.getElementById('save-post-btn');
        const postId = document.getElementById('post-id').value;
        const title = document.getElementById('post-title').value.trim();
        const category = document.getElementById('post-category').value;
        const date = document.getElementById('post-date').value;
        const readTime = parseInt(document.getElementById('post-readtime').value) || 5;
        const featured = document.getElementById('post-featured').checked;
        const excerpt = document.getElementById('post-excerpt').value.trim();
        const content = document.getElementById('post-content').value.trim();

        if (!title) {
            this.showToast('Başlık gerekli!', 'error');
            return;
        }

        if (!excerpt) {
            this.showToast('Özet gerekli!', 'error');
            return;
        }

        btn.innerHTML = '<span class="spinner"></span> Kaydediliyor...';
        btn.disabled = true;

        const postData = {
            title, category, date, readTime,
            featured, excerpt, content,
            tags: this.tags
        };

        try {
            if (postId) {
                await this.apiRequest(`/api/admin/posts/${postId}`, 'PUT', postData);
                this.showToast('Yazı güncellendi!', 'success');
            } else {
                await this.apiRequest('/api/admin/posts', 'POST', postData);
                this.showToast('Yazı oluşturuldu!', 'success');
            }

            this.closeModal();
            this.loadPosts();
            this.loadStats();
        } catch (err) {
            this.showToast(err.message, 'error');
        }

        btn.innerHTML = 'Kaydet';
        btn.disabled = false;
    },

    // --- Delete ---
    deletePost(id) {
        document.getElementById('delete-post-id').value = id;
        document.getElementById('delete-modal').classList.add('active');
    },

    closeDeleteModal() {
        document.getElementById('delete-modal').classList.remove('active');
    },

    async confirmDelete() {
        const postId = document.getElementById('delete-post-id').value;

        try {
            await this.apiRequest(`/api/admin/posts/${postId}`, 'DELETE');
            this.showToast('Yazı silindi!', 'success');
            this.closeDeleteModal();
            this.loadPosts();
            this.loadStats();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // --- Tags ---
    renderTags() {
        const wrapper = document.getElementById('tags-wrapper');
        const input = document.getElementById('tags-input');

        // Remove old tag badges
        wrapper.querySelectorAll('.tag-badge').forEach(el => el.remove());

        // Add tag badges before the input
        this.tags.forEach((tag, i) => {
            const badge = document.createElement('span');
            badge.className = 'tag-badge';
            badge.innerHTML = `${this.escapeHtml(tag)} <button onclick="Admin.removeTag(${i})">&times;</button>`;
            wrapper.insertBefore(badge, input);
        });
    },

    removeTag(index) {
        this.tags.splice(index, 1);
        this.renderTags();
    },

    // --- Toast ---
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `${type === 'success' ? '✅' : '❌'} ${this.escapeHtml(message)}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // --- Helpers ---
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Tags input handler
document.addEventListener('DOMContentLoaded', () => {
    Admin.init();

    const tagsInput = document.getElementById('tags-input');
    if (tagsInput) {
        tagsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = tagsInput.value.trim();
                if (value && !Admin.tags.includes(value)) {
                    Admin.tags.push(value);
                    Admin.renderTags();
                    tagsInput.value = '';
                }
            }
        });
    }
});
