# 🎓 Eren Mente - Portfolio Monorepo

Welcome to my personal portfolio repository! This project serves as a central hub showcasing my web development skills, featuring a main portfolio site and two distinct sub-projects hosted under the same domain.

**Live Site:** [erenmente.com](https://erenmente.com)

---

## 📂 Project Structure

This repository is structured as a monorepo containing three main components:

| Project | Path | Description | Tech Stack |
|---------|------|-------------|------------|
| **Main Portfolio** | `/` | My personal landing page with skills, and contact info. | HTML5, Tailwind CSS |
| **Fırat Assistant** | `/firatasistan` | AI-powered lecture assistant for students. | Python (Flask), Groq API, JS |
| **Digital Menu** | `/sepetsepetyemek` | Interactive QR menu system for restaurants. | HTML, CSS, Vanilla JS |

---

## 🚀 1. Main Portfolio (Root)
A modern, responsive personal website designed to showcase my journey as a Software Engineering student.

### Features
- **Responsive Design:** Built with Tailwind CSS for mobile-first responsiveness.
- **Dark Mode:** Fully supported dark/light theme switching.
- **Project Showcase:** 3D card effects to highlight featured projects.
- **Project Showcase:** 3D card effects to highlight featured projects.

---

## 🤖 2. Fırat Assistant (`/firatasistan`)
*Path: `/api` (Backend), `/api/templates` (Frontend)*

An AI chatbot designed to assist students with algorithm problems and computer science concepts.

### Key Features
- **Dual Mode:** 
    - `Algo Mode`: Solves coding problems.
    - `BBG Mode`: Explains CS concepts.
- **Streaming Responses:** Real-time text generation for a natural chat experience.
- **Context Memory:** Remembers previous messages in the conversation.
- **Code Highlighting:** Auto-detects and highlights code blocks with a "Copy" button.
- **Tech Stack:** Serverless Python (Flask) on Vercel, Groq LLaMA API.

---

## 🍽️ 3. Digital Menu (`/sepetsepetyemek`)
*Path: `/sepetsepetyemek`*

A frontend-heavy simulation of a digital restaurant menu system, perfect for QR code integration.

### Key Features
- **Dynamic Cart:** Add/remove items with real-time total calculation.
- **Search & Filter:** Instant filtering by category or search term.
- **QR Code Generation:** Generates a unique QR code for the menu link.
- **Offline Capable:** Uses `localStorage` to persist simulated cart data.
- **Tech Stack:** Vanilla JavaScript, Bootstrap 5, SweetAlert2.

---

## 🛠️ Setup & Deployment

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/erenmente/erenmente-com.git
   ```
2. Open `index.html` in your browser or use a live server.
3. For Python backend (`api/index.py`), install dependencies:
   ```bash
   pip install -r api/requirements.txt
   python api/index.py
   ```

### Vercel Deployment configuration
The project uses `vercel.json` to handle routing for the Python backend and static files:
- `/firatasistan/*` -> Rewrites to Flask API.
- `/sepetsepetyemek/*` -> Serves static menu files.

---

## 👤 Author
**Muhammet Eren Mente**  
*Software Engineering Student @ Fırat University*

- [LinkedIn](https://www.linkedin.com/in/erenmente/)
- [GitHub](https://github.com/erenmente)
- [Email](mailto:muhammeterenmente@gmail.com)
