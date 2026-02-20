from flask import Flask, request, jsonify
from dotenv import load_dotenv
from functools import wraps
import os
import json
import hashlib
import hmac
import time
import base64

# --- Configuration ---
load_dotenv()
base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(os.path.dirname(base_dir), 'data')

app = Flask(__name__)

# --- Auth Helpers ---
SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "erenmente-admin-secret-2026")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

def generate_token():
    """Generate a simple auth token"""
    timestamp = str(int(time.time()))
    payload = f"{timestamp}:{SECRET_KEY}"
    signature = hashlib.sha256(payload.encode()).hexdigest()
    token = base64.b64encode(f"{timestamp}:{signature}".encode()).decode()
    return token

def verify_token(token):
    """Verify auth token (valid for 24 hours)"""
    try:
        decoded = base64.b64decode(token).decode()
        timestamp, signature = decoded.split(":", 1)
        
        # Check expiration (24 hours)
        if int(time.time()) - int(timestamp) > 86400:
            return False
        
        # Verify signature
        expected_payload = f"{timestamp}:{SECRET_KEY}"
        expected_signature = hashlib.sha256(expected_payload.encode()).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
    except Exception:
        return False

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Yetkilendirme gerekli"}), 401
        
        token = auth_header.split(' ', 1)[1]
        if not verify_token(token):
            return jsonify({"error": "Geçersiz veya süresi dolmuş token"}), 401
        
        return f(*args, **kwargs)
    return decorated

# --- Data Helpers ---
def read_blog_posts():
    """Read blog posts from JSON file"""
    json_path = os.path.join(data_dir, 'blog-posts.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"posts": [], "categories": []}

def write_blog_posts(data):
    """Write blog posts to JSON file"""
    json_path = os.path.join(data_dir, 'blog-posts.json')
    
    # Try local write first
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        return True
    except Exception:
        pass
    
    # If local write fails (Vercel production), try GitHub API
    return write_to_github(data)

def write_to_github(data):
    """Write data to GitHub repo via GitHub API"""
    github_token = os.getenv("GITHUB_TOKEN")
    github_repo = os.getenv("GITHUB_REPO", "erenmente/erenmente-com")
    
    if not github_token:
        return False
    
    try:
        import urllib.request
        import urllib.error
        
        file_path = "data/blog-posts.json"
        api_url = f"https://api.github.com/repos/{github_repo}/contents/{file_path}"
        
        # Get current file SHA
        req = urllib.request.Request(api_url)
        req.add_header("Authorization", f"token {github_token}")
        req.add_header("Accept", "application/vnd.github.v3+json")
        
        with urllib.request.urlopen(req) as response:
            current_file = json.loads(response.read().decode())
            current_sha = current_file["sha"]
        
        # Update file
        content = json.dumps(data, ensure_ascii=False, indent=4)
        encoded_content = base64.b64encode(content.encode('utf-8')).decode('utf-8')
        
        update_data = json.dumps({
            "message": "Admin panel: blog yazısı güncellendi",
            "content": encoded_content,
            "sha": current_sha
        }).encode('utf-8')
        
        req = urllib.request.Request(api_url, data=update_data, method='PUT')
        req.add_header("Authorization", f"token {github_token}")
        req.add_header("Accept", "application/vnd.github.v3+json")
        req.add_header("Content-Type", "application/json")
        
        with urllib.request.urlopen(req) as response:
            return response.status == 200
            
    except Exception as e:
        print(f"GitHub API error: {e}")
        return False

def generate_slug(title):
    """Generate URL slug from title"""
    tr_chars = {'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
                'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'}
    slug = title.lower()
    for tr, en in tr_chars.items():
        slug = slug.replace(tr, en)
    slug = ''.join(c if c.isalnum() or c == ' ' else '' for c in slug)
    slug = '-'.join(slug.split())
    return slug

# --- Routes ---
@app.route('/api/admin/login', methods=['POST'])
def login():
    """Admin login endpoint"""
    data = request.json
    if not data:
        return jsonify({"error": "Veri alınamadı"}), 400
    
    password = data.get('password', '')
    
    if password == ADMIN_PASSWORD:
        token = generate_token()
        return jsonify({
            "success": True,
            "token": token,
            "message": "Giriş başarılı!"
        })
    
    return jsonify({"error": "Hatalı şifre"}), 401

@app.route('/api/admin/verify', methods=['GET'])
@require_auth
def verify():
    """Verify token is still valid"""
    return jsonify({"valid": True})

@app.route('/api/admin/posts', methods=['GET'])
@require_auth
def get_posts():
    """Get all blog posts"""
    data = read_blog_posts()
    return jsonify(data)

@app.route('/api/admin/posts', methods=['POST'])
@require_auth
def create_post():
    """Create a new blog post"""
    post_data = request.json
    if not post_data:
        return jsonify({"error": "Veri alınamadı"}), 400
    
    data = read_blog_posts()
    posts = data.get("posts", [])
    
    # Generate new ID
    max_id = max([p.get("id", 0) for p in posts], default=0)
    new_id = max_id + 1
    
    # Create new post
    new_post = {
        "id": new_id,
        "title": post_data.get("title", ""),
        "slug": post_data.get("slug") or generate_slug(post_data.get("title", "")),
        "excerpt": post_data.get("excerpt", ""),
        "content": post_data.get("content", ""),
        "author": "Eren Mente",
        "date": post_data.get("date", ""),
        "readTime": post_data.get("readTime", 5),
        "category": post_data.get("category", "Genel"),
        "tags": post_data.get("tags", []),
        "featured": post_data.get("featured", False),
        "image": post_data.get("image", "")
    }
    
    posts.insert(0, new_post)
    data["posts"] = posts
    
    # Update categories
    if new_post["category"] not in data.get("categories", []):
        data.setdefault("categories", []).append(new_post["category"])
    
    if write_blog_posts(data):
        return jsonify({"success": True, "post": new_post, "message": "Yazı başarıyla oluşturuldu!"})
    
    return jsonify({"error": "Yazı kaydedilemedi"}), 500

@app.route('/api/admin/posts/<int:post_id>', methods=['PUT'])
@require_auth
def update_post(post_id):
    """Update an existing blog post"""
    post_data = request.json
    if not post_data:
        return jsonify({"error": "Veri alınamadı"}), 400
    
    data = read_blog_posts()
    posts = data.get("posts", [])
    
    for i, post in enumerate(posts):
        if post.get("id") == post_id:
            posts[i].update({
                "title": post_data.get("title", post["title"]),
                "slug": post_data.get("slug") or generate_slug(post_data.get("title", post["title"])),
                "excerpt": post_data.get("excerpt", post["excerpt"]),
                "content": post_data.get("content", post["content"]),
                "date": post_data.get("date", post["date"]),
                "readTime": post_data.get("readTime", post.get("readTime", 5)),
                "category": post_data.get("category", post["category"]),
                "tags": post_data.get("tags", post.get("tags", [])),
                "featured": post_data.get("featured", post.get("featured", False)),
                "image": post_data.get("image", post.get("image", ""))
            })
            
            data["posts"] = posts
            
            if write_blog_posts(data):
                return jsonify({"success": True, "post": posts[i], "message": "Yazı güncellendi!"})
            
            return jsonify({"error": "Yazı kaydedilemedi"}), 500
    
    return jsonify({"error": "Yazı bulunamadı"}), 404

@app.route('/api/admin/posts/<int:post_id>', methods=['DELETE'])
@require_auth
def delete_post(post_id):
    """Delete a blog post"""
    data = read_blog_posts()
    posts = data.get("posts", [])
    
    original_length = len(posts)
    data["posts"] = [p for p in posts if p.get("id") != post_id]
    
    if len(data["posts"]) == original_length:
        return jsonify({"error": "Yazı bulunamadı"}), 404
    
    if write_blog_posts(data):
        return jsonify({"success": True, "message": "Yazı silindi!"})
    
    return jsonify({"error": "Değişiklik kaydedilemedi"}), 500

@app.route('/api/admin/stats', methods=['GET'])
@require_auth
def get_stats():
    """Get dashboard statistics"""
    data = read_blog_posts()
    posts = data.get("posts", [])
    categories = data.get("categories", [])
    
    # Category counts
    category_counts = {}
    for post in posts:
        cat = post.get("category", "Diğer")
        category_counts[cat] = category_counts.get(cat, 0) + 1
    
    # Featured count
    featured_count = sum(1 for p in posts if p.get("featured", False))
    
    return jsonify({
        "totalPosts": len(posts),
        "totalCategories": len(categories),
        "featuredPosts": featured_count,
        "categoryCounts": category_counts,
        "categories": categories
    })

# Catch-all for admin panel routes
@app.route('/api/admin/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def catch_all(path):
    return jsonify({"error": "Endpoint bulunamadı"}), 404
