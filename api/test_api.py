import google.generativeai as genai
import os
from dotenv import load_dotenv

# 1. API KEY KONTROLÜ
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print("="*40)
print("🔍 TEŞHİS PROGRAMI BAŞLATILIYOR...")
print("="*40)

if not api_key:
    print("❌ HATA: .env dosyasında API Key okunmadı!")
    exit()
else:
    print(f"✅ API Key bulundu: {api_key[:5]}...{api_key[-3:]}")

genai.configure(api_key=api_key)

# 2. SENİN HESABINDA HANGİ MODELLER VAR?
print("\n📋 HESABINA TANIMLI MODELLER:")
mevcut_modeller = []
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
            mevcut_modeller.append(m.name)
except Exception as e:
    print(f"❌ Model listesi alınamadı: {e}")

# 3. TEK TEK BAĞLANTI TESTİ
print("\n🧪 BAĞLANTI TESTLERİ:")

test_listesi = [
    'models/gemini-2.0-flash-exp',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-flash-8b',
    'models/gemini-pro'
]

calisan_model = None

for model_adi in test_listesi:
    print(f"\n👉 Deneniyor: {model_adi}")
    if model_adi not in mevcut_modeller and ("models/" + model_adi) not in mevcut_modeller:
         print(f"   ⚠️ Bu model senin listende GÖRÜNMÜYOR. Yine de şansımızı deneyelim...")

    try:
        model = genai.GenerativeModel(model_adi)
        response = model.generate_content("Test mesajı: Merhaba.")
        print(f"   ✅ BAŞARILI! Cevap: {response.text.strip()}")
        calisan_model = model_adi
        break # Çalışanı bulduk, çıkabiliriz.
    except Exception as e:
        print(f"   ❌ BAŞARISIZ. Hata: {e}")

print("="*40)
if calisan_model:
    print(f"🚀 SONUÇ: app.py dosyasında '{calisan_model}' kullanmalısın.")
else:
    print("💀 SONUÇ: Hiçbir model çalışmadı. API Key veya Hesap sorunu var.")
print("="*40)