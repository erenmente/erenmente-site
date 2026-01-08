# 🍽️ Digital Restaurant Menu & Ordering System

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Language](https://img.shields.io/badge/Language-JavaScript-yellow)
![Framework](https://img.shields.io/badge/Style-Bootstrap5-blue)

A modern, responsive, and interactive digital menu application designed for restaurants. This Single Page Application (SPA) allows customers to browse the menu, filter by category, search for items, manage a shopping cart, and generate a QR code for easy access.

## 🔗 Live Demo
🚀 **[Click here to view the live project](https://erenmente.github.io/yemek-sepeti-js/)**

---

## ✨ Features

### 🛒 Dynamic Shopping Cart
- **Add/Remove Items:** Users can easily add items to the cart and remove them with a single click.
- **Persistent Storage:** Uses **LocalStorage** to save the cart state. Even if the page is refreshed or the browser is closed, the cart data remains intact.
- **Real-time Calculation:** Automatically calculates the total price as items are added or removed.

### 🔍 Search & Filtering
- **Instant Search:** A responsive search bar that filters menu items in real-time as the user types.
- **Category Filtering:** Tab-based filtering (e.g., Main Dishes, Soups, Desserts) for better user experience.

### 📱 QR Code Generation
- **Dynamic QR:** Generates a unique QR code for the current page URL using `qrcode.js`.
- **High-Quality Download:** Includes a feature to download the QR code as a high-resolution PNG, ready to be printed and placed on restaurant tables.

### 🎨 UI/UX Enhancements
- **SweetAlert2 Integration:** Replaced standard browser alerts with beautiful, animated, and responsive popups for confirmation and success messages.
- **Responsive Design:** Fully responsive layout built with **Bootstrap 5**, ensuring it works perfectly on mobile, tablet, and desktop.

---

## 🛠️ Technologies Used

* **HTML5** - Semantic structure.
* **CSS3 & Bootstrap 5** - Styling and responsive grid system.
* **JavaScript (ES6+)** - Logic, DOM manipulation, and LocalStorage management.
* **JSON** - Simulating backend data (storing menu items).
* **SweetAlert2** - For aesthetic alerts and modals.
* **QRCode.js** - For generating client-side QR codes.

---

## 📂 Project Structure

```text
├── index.html        # Main HTML structure
├── app.js            # Main JavaScript logic (Fetch, Cart, Filtering)
├── data.json         # Menu data source
├── img/              # Folder for food images
└── README.md         # Project documentation
```
# Project documentation
🚀 How to Run Locally
Clone the repository

Bash

git clone [https://github.com/erenmente/yemek-sepeti-js.git](https://github.com/erenmente/yemek-sepeti-js.git)
Open the project Open the folder in your code editor (VS Code, IntelliJ, etc.).

Run the application You can open index.html directly in your browser. Note: For the best experience (to avoid CORS issues with JSON fetching), it is recommended to use "Live Server" extension.

![Menu View](img/qrcode.png)

👤 Author
Eren Mente

Computuer Engineering Student at Fırat University

GitHub: @erenmente

Copyright © 2025. All rights reserved.
