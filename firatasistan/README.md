# 🎓 Fırat Assistant (AI Lecture Mentor)

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-lightgrey)
![Groq AI](https://img.shields.io/badge/Groq-API-orange)
![Deploy](https://img.shields.io/badge/Deploy-Render-success)

**Fırat Assistant** is a specialized, web-based AI mentor designed for Software Engineering students. Unlike generic chatbots, it features **Context Switching** capabilities, allowing it to act as a **Senior Java Mentor** for programming tasks or a **Theoretical Academic** for Computer Science fundamentals.

🔗 **Live Demo:** [https://dersasistani.onrender.com](https://dersasistani.onrender.com)

---

## 🚀 Key Features

### 🧠 Dual-Mode AI Persona
* **☕ Algorithm Mode:** Acts as a Senior Java Developer. Focuses on Clean Code, algorithms, and practical implementation. Instead of giving direct answers, it uses the *Socratic Method* to guide the student.
* **💾 Computer Science Mode:** Acts as an Academic Professor. Focuses on theory (Binary systems, CPU architecture, memory management) with engineering analogies.

### 🎨 Modern Frontend Experience
* **ChatGPT-like Interface:** Clean, responsive design with a sidebar for chat history.
* **Local History:** Saves chat sessions securely in the browser's **LocalStorage** (No external database required).
* **Syntax Highlighting:** Automatically formats and colors code blocks (Java, Python, etc.) using `highlight.js`.
* **Markdown Support:** Renders rich text (bold, lists, headers) using `marked.js`.

---

## 🛠️ Tech Stack

* **Backend:** Python, Flask
* **AI Engine:** groq API
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Libraries:** `google-generativeai`, `python-dotenv`, `marked.js`, `highlight.js`
* **Deployment:** Render (Cloud Hosting)

---

## 📂 Project Structure

```bash
Firat-Asistan/
│
├── static/              # CSS and Image files
├── templates/
│   └── index.html       # Main application interface
├── app.py               # Flask backend & AI logic
├── requirements.txt     # Python dependencies
├── .env                 # API Keys (Not included in repo)
└── README.md            # Project documentation
```

## ⚙️ Installation (Run Locally)
If you want to run this project on your local machine:

### Clone the repository

git clone [https://github.com/erenmente/ders-asistan.git](https://github.com/erenmente/ders-asistan.git)
cd ders-asistan

## 🤝 Contributing
This project is open for educational purposes. Feel free to fork and improve!

Fork the Project

Create your Feature Branch (git checkout -b feature/NewFeature)

Commit your Changes (git commit -m 'Add some NewFeature')

Push to the Branch (git push origin feature/NewFeature)

Open a Pull Request

## 👤 Author
Eren Mente

Student at Fırat University - Software Engineering

GitHub: @erenmente
