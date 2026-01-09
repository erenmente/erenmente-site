from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

# --- 1. PROMPTS (Merged from prompts.py) ---
ALGO_PROMPT = """
Sen Fırat Üniversitesi Yazılım Mühendisliği bölümünde bir Algoritma Mentorüsün (Java Uzmanı).
Görevin: Öğrenciye asla direkt kodu kopyala-yapıştır yapabileceği şekilde verme.
Önce mantığı anlat, pseudocode (sözde kod) göster, ipuçları ver.
Clean Code prensiplerine sadık kal.
Cevaplarında bol bol emoji kullan ve samimi, motive edici bir dil kullan.
"""

BBG_PROMPT = """
Sen Bilgisayar Bilimleri dersi veren kıdemli bir Akademisyensin.
Görevin: Konuları (Binary sistemler, CPU mimarisi, Bellek yönetimi vb.) mühendislik formasyonuyla anlatmak.
Günlük hayattan analojiler ve metaforlar kullan.
Ciddi ama anlaşılır bir dil kullan.
"""

# --- 2. CONFIGURATION ---
load_dotenv()

# Define absolute paths for Vercel environment
base_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(base_dir, 'static')
template_dir = os.path.join(base_dir, 'templates')

app = Flask(__name__, 
            static_url_path='/firatasistan/static',
            static_folder=static_dir,
            template_folder=template_dir)

# --- 3. SERVICES (Merged from services.py) ---
try:
    from groq import Groq
except ImportError:
    Groq = None

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        if not self.api_key:
            print("⚠️ API Key not found in environment!")
        else:
            try:
                if Groq:
                    self.client = Groq(api_key=self.api_key)
                else:
                    print("❌ Groq library key missing")
            except Exception as e:
                print(f"❌ Groq Client Init Error: {e}")

    def get_response(self, user_input, mode):
        if not self.client:
            return f"Sunucu Hatası: API Anahtarı eksik veya kütüphane yüklenemedi. (Key: {'VAR' if self.api_key else 'YOK'}, Lib: {'VAR' if Groq else 'YOK'})"

        system_content = ALGO_PROMPT if mode == 'algo' else BBG_PROMPT

        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": user_input}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
            )
            return completion.choices[0].message.content

        except Exception as e:
            return f"API Hatası: {str(e)}"

# Initialize Service safely
ai_service = AIService()

# --- 4. ROUTES ---
@app.route('/')
@app.route('/firatasistan')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Template Error: {str(e)} - Path: {template_dir}"

@app.route('/sor', methods=['POST'])
@app.route('/firatasistan/sor', methods=['POST'])
def sor():
    try:
        data = request.json
        if not data:
            return jsonify({'response': "Veri alınamadı."})
            
        user_input = data.get('message')
        mode = data.get('mode', 'algo')

        if not user_input:
            return jsonify({'response': "Boş mesaj."})

        response = ai_service.get_response(user_input, mode)
        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'response': f"Sunucu İşlem Hatası: {str(e)}"})

# Local development support
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)