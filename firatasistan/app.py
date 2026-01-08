from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from services import AIService

# 1. AYARLARI YÜKLE
load_dotenv()
app = Flask(__name__)

# Servisi Başlat
ai_service = AIService()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sor', methods=['POST'])
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
        return jsonify({'response': "Sunucu tarafında bir hata oluştu."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)