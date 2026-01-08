// State Management
let currentMode = 'algo';
let currentChatId = Date.now();
let chats = JSON.parse(localStorage.getItem('firat_chats')) || [];

// Markdown Configuration
marked.setOptions({
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Migrate old chats if they don't have a mode
    chats.forEach(chat => {
        if (!chat.mode) chat.mode = 'algo';
    });
    localStorage.setItem('firat_chats', JSON.stringify(chats));

    loadLastChatForMode('algo');
    setupEventListeners();

    // Focus input on load
    document.getElementById('userInput').focus();
});

function setupEventListeners() {
    // Mode Switching
    document.getElementById('btn-algo').addEventListener('click', () => switchMode('algo'));
    document.getElementById('btn-bbg').addEventListener('click', () => switchMode('bbg'));

    // Chat Actions
    document.querySelector('.new-chat-btn').addEventListener('click', startNewChat);
    document.querySelector('.clear-all-btn').addEventListener('click', clearAllHistory);

    // Input Handling
    const input = document.getElementById('userInput');
    const sendBtn = document.querySelector('.send-btn');

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    sendBtn.addEventListener('click', sendMessage);

    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

function switchMode(mode) {
    if (currentMode === mode) return;

    // Save current state before switching
    localStorage.setItem(`last_chat_${currentMode}`, currentChatId);

    currentMode = mode;

    // Update UI Buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active-algo', 'active-bbg');
    });

    const activeBtn = document.getElementById(mode === 'algo' ? 'btn-algo' : 'btn-bbg');
    activeBtn.classList.add(mode === 'algo' ? 'active-algo' : 'active-bbg');

    loadLastChatForMode(mode);
}

function loadLastChatForMode(mode) {
    const lastChatId = localStorage.getItem(`last_chat_${mode}`);
    const modeChats = chats.filter(c => c.mode === mode);

    if (lastChatId && modeChats.find(c => c.id == lastChatId)) {
        loadChat(parseInt(lastChatId));
    } else if (modeChats.length > 0) {
        loadChat(modeChats[0].id);
    } else {
        startNewChat();
    }
    renderHistory();
}

function startNewChat() {
    currentChatId = Date.now();
    const chatBox = document.getElementById('chatBox');

    const welcomeMsg = currentMode === 'algo'
        ? "Yeni bir algoritma problemi mi? Hadi çözelim! 🚀"
        : "Bilgisayar bilimlerinin derinliklerine inmeye hazır mısın? 💾";

    chatBox.innerHTML = `
        <div class="message ai-message">
            <div class="avatar ai">AI</div>
            <div class="msg-content">${welcomeMsg}</div>
        </div>`;

    // Update history selection
    renderHistory();
}

async function sendMessage() {
    const inputField = document.getElementById('userInput');
    const sendBtn = document.querySelector('.send-btn');
    const chatBox = document.getElementById('chatBox');
    const message = inputField.value.trim();

    if (message === "") return;

    // UI Updates
    inputField.value = "";
    inputField.disabled = true;
    sendBtn.disabled = true;

    appendMessage('user', message);
    saveToHistory(message, 'user');

    // Loading Indicator
    const loadingId = 'loading-' + Date.now();
    const loadingHTML = `
        <div class="message ai-message" id="${loadingId}">
            <div class="avatar ai">...</div>
            <div class="msg-content">
                <i class="fas fa-circle-notch fa-spin"></i> Düşünüyor...
            </div>
        </div>`;
    chatBox.insertAdjacentHTML('beforeend', loadingHTML);
    scrollToBottom();

    try {
        const response = await fetch('/firatasistan/sor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, mode: currentMode })
        });

        const data = await response.json();

        // Remove loading
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();

        // Create empty message container
        const msgId = 'msg-' + Date.now();
        const msgHTML = `
            <div class="message ai-message">
                <div class="avatar ai">AI</div>
                <div class="msg-content" id="${msgId}"></div>
            </div>
        `;
        chatBox.insertAdjacentHTML('beforeend', msgHTML);

        // Type out the response
        await typeText(document.getElementById(msgId), data.response);

        saveToHistory(data.response, 'ai');

    } catch (error) {
        console.error("Chat Error:", error);
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();

        appendMessage('ai', "⚠️ Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
    }
}

async function typeText(element, text) {
    const words = text.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
        currentText += words[i] + ' ';
        element.innerHTML = marked.parse(currentText);

        // Highlight code blocks dynamically
        element.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        scrollToBottom();

        // Small delay for typing effect
        await new Promise(resolve => setTimeout(resolve, 30));
    }

    // Final render to ensure everything is correct and add copy buttons
    element.innerHTML = marked.parse(text);
    element.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
        addCopyButton(block);
    });
    scrollToBottom();
}

function addCopyButton(block) {
    // Wrapper for code block
    const pre = block.parentElement;
    if (pre.previousElementSibling && pre.previousElementSibling.classList.contains('code-header')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';

    // Header with copy button
    const header = document.createElement('div');
    header.className = 'code-header';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="far fa-copy"></i> Kopyala';

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(block.innerText).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i> Kopyala';
            }, 2000);
        });
    });

    header.appendChild(copyBtn);

    // Insert wrapper
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
}

function appendMessage(sender, text) {
    const chatBox = document.getElementById('chatBox');
    const isUser = sender === 'user';
    const content = isUser ? text : marked.parse(text);

    const msgHTML = `
        <div class="message ${isUser ? 'user-message' : 'ai-message'}">
            <div class="avatar ${isUser ? 'user' : 'ai'}">
                ${isUser ? '<i class="fas fa-user"></i>' : 'AI'}
            </div>
            <div class="msg-content">${content}</div>
        </div>
    `;

    chatBox.insertAdjacentHTML('beforeend', msgHTML);

    // Highlight code blocks and add copy button
    chatBox.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
        addCopyButton(block);
    });

    scrollToBottom();
}

function scrollToBottom() {
    const chatBox = document.getElementById('chatBox');
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- History Management ---

function saveToHistory(text, sender) {
    let chat = chats.find(c => c.id === currentChatId);

    if (!chat) {
        chat = {
            id: currentChatId,
            title: text.substring(0, 30) + (text.length > 30 ? "..." : ""),
            mode: currentMode, // Save mode with chat
            messages: []
        };
        chats.unshift(chat);
    }
    chat.messages.push({ sender, text });
    localStorage.setItem('firat_chats', JSON.stringify(chats));

    // Also update last active chat for this mode
    localStorage.setItem(`last_chat_${currentMode}`, currentChatId);

    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = "";

    // Filter chats by current mode
    const filteredChats = chats.filter(c => c.mode === currentMode);

    if (filteredChats.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:var(--text-dim); font-size:0.9rem;'>Bu modda henüz geçmiş yok.</div>";
        return;
    }

    filteredChats.forEach(chat => {
        const item = document.createElement('div');
        item.className = `history-item ${chat.id === currentChatId ? 'active' : ''}`;
        item.onclick = () => loadChat(chat.id);

        item.innerHTML = `
            <div class="history-title">
                <i class="far fa-message"></i> ${chat.title}
            </div>
            <i class="fas fa-trash delete-chat-btn" title="Sil"></i>
        `;

        // Delete button logic
        const deleteBtn = item.querySelector('.delete-chat-btn');
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        };

        list.appendChild(item);
    });
}

function loadChat(id) {
    currentChatId = id;
    const chat = chats.find(c => c.id === id);
    if (!chat) return;

    // Ensure we switch to the chat's mode if loaded directly (though UI prevents this mostly)
    if (chat.mode !== currentMode) {
        // This block might be redundant with current UI logic but good for safety
        currentMode = chat.mode;
    }

    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = "";

    chat.messages.forEach(msg => {
        appendMessage(msg.sender, msg.text);
    });

    // Update last active chat
    localStorage.setItem(`last_chat_${currentMode}`, currentChatId);

    renderHistory(); // To update active state
}

function deleteChat(id) {
    if (!confirm("Bu sohbeti silmek istediğine emin misin?")) return;

    chats = chats.filter(c => c.id !== id);
    localStorage.setItem('firat_chats', JSON.stringify(chats));

    if (currentChatId === id) {
        // If we deleted the current chat, try to load another one or start new
        const modeChats = chats.filter(c => c.mode === currentMode);
        if (modeChats.length > 0) {
            loadChat(modeChats[0].id);
        } else {
            startNewChat();
        }
    } else {
        renderHistory();
    }
}

function clearAllHistory() {
    if (!confirm("Bu moddaki TÜM geçmiş silinecek! Emin misin?")) return;

    // Only delete chats for the current mode
    chats = chats.filter(c => c.mode !== currentMode);
    localStorage.setItem('firat_chats', JSON.stringify(chats));

    startNewChat();
    renderHistory();
}

function downloadChat() {
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat || chat.messages.length === 0) {
        alert("İndirilecek sohbet bulunamadı.");
        return;
    }

    let content = `Fırat Asistan Sohbet Geçmişi\n`;
    content += `Konu: ${chat.title}\n`;
    content += `Tarih: ${new Date(chat.id).toLocaleString()}\n`;
    content += `Mod: ${chat.mode === 'algo' ? 'Algoritma' : 'BBG'}\n`;
    content += `----------------------------------------\n\n`;

    chat.messages.forEach(msg => {
        const sender = msg.sender === 'user' ? 'SEN' : 'ASİSTAN';
        content += `[${sender}]:\n${msg.text}\n\n`;
        content += `----------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firat_asistan_${chat.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
