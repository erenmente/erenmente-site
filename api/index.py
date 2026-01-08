from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import sys

# Vercel path fix: Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from services import AIService
except Exception as e:
    err_msg = str(e)
    print(f"❌ Import Error: {err_msg}")
    # Fallback class to prevent crash
    class AIService:
        def __init__(self): pass
        def get_response(self, *args): return f"Sistem Başlatma Hatası: {err_msg}"
import os

# 1. AYARLARI YÜKLE
load_dotenv()

# Klasör yollarını tam belirle (Vercel için kritik)
base_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(base_dir, 'static')
template_dir = os.path.join(base_dir, 'templates')

app = Flask(__name__, 
            static_url_path='/firatasistan/static',
            static_folder=static_dir,
            template_folder=template_dir)

# Servisi Başlat (Hata alırsa patlamasın, loglasın)
try:
    ai_service = AIService()
except Exception as e:
    print(f"❌ Service Init Error: {e}")
    ai_service = None

@app.route('/')
@app.route('/firatasistan')
def home():
    return render_template('index.html')

@app.route('/sor', methods=['POST'])
@app.route('/firatasistan/sor', methods=['POST'])
def sor():
    try:
        data = request.json
        user_input = data.get('message')
        mode = data.get('mode') 

        if not user_input:
            return jsonify({'response': "Boş mesaj."})

        # Servis üzerinden cevap al
        response = ai_service.get_response(user_input, mode)
        
        return jsonify({'response': response})

    except Exception as e:
        print(f"❌ Sunucu Hatası: {str(e)}")
        # Hata detayını kullanıcıya göster ki sebebi anlayalım
        return jsonify({'response': f"DEBUG HATASI: {str(e)}"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)