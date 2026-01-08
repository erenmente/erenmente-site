import os
from groq import Groq
from prompts import ALGO_PROMPT, BBG_PROMPT

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        if not self.api_key:
            print("⚠️ API Anahtarı bulunamadı!")
        else:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"❌ Groq Client Başlatma Hatası: {e}")

    def get_response(self, user_input, mode):
        if not self.client:
            return "Sunucu Hatası: API Anahtarı eksik veya yapılandırılamadı."

        system_content = ALGO_PROMPT if mode == 'algo' else BBG_PROMPT

        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_content
                    },
                    {
                        "role": "user",
                        "content": user_input
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
            )
            return completion.choices[0].message.content

        except Exception as e:
            print(f"❌ Groq Hatası: {e}")
            return "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar dene."
