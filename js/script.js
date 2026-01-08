document.getElementById('year').textContent = new Date().getFullYear();

// Navbar Scroll Effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        nav.classList.add('shadow-lg', 'bg-white/95', 'dark:bg-slate-900/95');
        nav.classList.remove('bg-white/80', 'dark:bg-slate-900/80');
    } else {
        nav.classList.remove('shadow-lg', 'bg-white/95', 'dark:bg-slate-900/95');
        nav.classList.add('bg-white/80', 'dark:bg-slate-900/80');
    }
});

// Mobile Menu
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
btn.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
    });
});

// Dark Mode Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark') {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon.classList.remove('hidden');
} else {
    document.documentElement.classList.remove('dark');
    themeToggleDarkIcon.classList.remove('hidden');
}

themeToggleBtn.addEventListener('click', function () {
    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    } else {
        // if NOT set via local storage previously
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
});

// Typing Effect
const textElement = document.getElementById('typing-text');
const texts = ['Yazılım Mühendisliği Öğrencisi', 'Java Geliştirici', 'Python Tutkunu', 'Backend Developer'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    if (!textElement) return; // Guard clause if element doesn't exist

    const currentText = texts[textIndex];

    if (isDeleting) {
        textElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        textElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener('DOMContentLoaded', type);

// Scroll to Top
const scrollTopBtn = document.getElementById('scroll-top-btn');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.remove('translate-y-20', 'opacity-0');
        } else {
            scrollTopBtn.classList.add('translate-y-20', 'opacity-0');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}



// ScrollSpy / Active Menu Logic
const sections = document.querySelectorAll('header[id], section[id]');
const navLinks = document.querySelectorAll('.space-x-8 a, #mobile-menu a');

window.addEventListener('scroll', () => {
    let current = '';

    // Find the current section
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // -100 offset to trigger slightly before the section hits top
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        // Reset styles
        link.classList.remove('text-brand-primary', 'font-bold');
        link.classList.add('text-brand-text', 'dark:text-slate-300');

        // Apply active style if href matches current section
        if (link.getAttribute('href').includes(current) && current !== '') {
            link.classList.add('text-brand-primary', 'font-bold');
            link.classList.remove('text-brand-text', 'dark:text-slate-300');
        }
    });
});

// Staggered Animation Logic
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('#skills .group, #experience .group, #projects .group');

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');

        // Add stagger delay for skills specifically
        if (el.closest('#skills')) {
            const delay = (index % 4) * 100; // Stagger per column/item
            el.style.transitionDelay = `${delay}ms`;
        }

        observer.observe(el);
    });
});