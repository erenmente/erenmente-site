const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Triggers
const heroName = document.getElementById('hero-name');
const uniName = document.getElementById('uni-name');
const expFirat = document.getElementById('exp-firat');
const expBorusan = document.getElementById('exp-borusan');

let width, height;
let particles = [];
let isHovering = false;

// Configs
// HIGH DENSITY for legible text
const isMobile = window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 600 : 1200;

const PARTICLE_SIZE = isMobile ? 2.5 : 2.0;
const FLOAT_SPEED = 0.2;
const FORMATION_SPEED = 0.04;

const NUM_GROUPS = 4;

class Particle {
    constructor(groupId) {
        this.resize();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * FLOAT_SPEED;
        this.vy = (Math.random() - 0.5) * FLOAT_SPEED;
        this.targetX = null;
        this.targetY = null;
        this.groupId = groupId;

        if (Math.random() > 0.6) {
            this.color = 'rgba(79, 70, 229,';
        } else if (Math.random() > 0.3) {
            this.color = 'rgba(147, 51, 234,';
        } else {
            this.color = 'rgba(20, 184, 166,';
        }
        this.alpha = Math.random() * 0.5 + 0.3;
    }

    resize() {
        if (typeof width === 'undefined') {
            width = window.innerWidth;
            height = window.innerHeight;
        }
    }

    update() {
        if (this.targetX !== null && this.targetY !== null) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;

            this.x += dx * FORMATION_SPEED;
            this.y += dy * FORMATION_SPEED;

            if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
                this.x += (Math.random() - 0.5) * 1.5;
                this.y += (Math.random() - 0.5) * 1.5;
            }
        } else {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, PARTICLE_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
    }
}

function init() {
    resize();
    createParticles();
    setRandomNextShapes();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const particlesPerGroup = Math.floor(PARTICLE_COUNT / NUM_GROUPS);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const gId = Math.min(Math.floor(i / particlesPerGroup), NUM_GROUPS - 1);
        particles.push(new Particle(gId));
    }
}

// ---- TEXT LOGIC ---- //
async function setTextTarget(textOrLeft, rightWord) {
    await document.fonts.ready;
    particles.forEach(p => { p.targetX = null; p.targetY = null; });

    let allCoords = [];
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    // Case 1: Split Text (Eren | Mente)
    if (rightWord) {
        let leftCoords = getTextCoordinates(textOrLeft, width * 0.05, height / 2, 1.2);

        const splitFontSize = Math.min(width, height) / 4 * 1.2;
        offCtx.font = `900 ${splitFontSize}px "Arial Black", sans-serif`;
        const rightWidth = offCtx.measureText(rightWord).width;
        let rightCoords = getTextCoordinates(rightWord, width * 0.95 - rightWidth, height / 2, 1.2);

        allCoords = [...leftCoords, ...rightCoords];
    }
    // Case 2: Single Word (Hovered Word)
    else {
        const word = textOrLeft;
        let targetFontSize = 150;
        offCtx.font = `900 ${targetFontSize}px "Arial Black", sans-serif`;
        let textMetrics = offCtx.measureText(word);

        if (textMetrics.width > width * 0.9) {
            targetFontSize = (width * 0.9) / textMetrics.width * targetFontSize;
        }

        const baseSize = Math.min(width, height) / 4;
        const requiredScale = targetFontSize / baseSize;

        offCtx.font = `900 ${targetFontSize}px "Arial Black", sans-serif`;
        const finalWidth = offCtx.measureText(word).width;

        const startX = (width - finalWidth) / 2;
        const startY = height * 0.85;

        allCoords = getTextCoordinates(word, startX, startY, requiredScale);
    }

    for (let i = allCoords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCoords[i], allCoords[j]] = [allCoords[j], allCoords[i]];
    }

    const maxParticlesForText = Math.floor(particles.length * 0.85);
    const limit = Math.min(allCoords.length, maxParticlesForText);

    for (let i = 0; i < limit; i++) {
        particles[i].targetX = allCoords[i].x + (Math.random() * 2 - 1);
        particles[i].targetY = allCoords[i].y + (Math.random() * 2 - 1);
    }
}

function getTextCoordinates(text, startX, startY, fontScale) {
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = width;
    offCanvas.height = height;

    const fontSize = Math.min(width, height) / 4 * fontScale;
    offCtx.font = `900 ${fontSize}px "Arial Black", sans-serif`;
    offCtx.textAlign = 'left';
    offCtx.textBaseline = 'middle';

    const isDark = document.documentElement.classList.contains('dark');
    offCtx.fillStyle = isDark ? '#ffffff' : '#4f46e5';
    offCtx.fillText(text, startX, startY);

    const imgData = offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let coords = [];
    const gap = 2;

    for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
            if (data[(y * width + x) * 4 + 3] > 200) {
                coords.push({ x, y });
            }
        }
    }
    return coords;
}


// ---- SHAPE LOGIC ---- //
function getCircleCoordinates(cx, cy, radius) {
    const coords = [];
    const circumference = 2 * Math.PI * radius;
    const count = Math.floor(circumference / 2); // 2px spacing

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        coords.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius
        });
    }
    return coords;
}

function getTriangleCoordinates(cx, cy, sideLength) {
    const coords = [];
    const heightTri = sideLength * (Math.sqrt(3) / 2);
    // cy is center, adjust for gravity center
    const adjustedCy = cy + heightTri / 6;

    const v1 = { x: cx, y: adjustedCy - heightTri / 1.2 };
    const v2 = { x: cx - sideLength / 2, y: adjustedCy + heightTri / 2 };
    const v3 = { x: cx + sideLength / 2, y: adjustedCy + heightTri / 2 };

    // Estimate particles per shape side roughly
    const perSide = 40;

    // Side 1: v1 -> v2
    for (let i = 0; i < perSide; i++) {
        const t = i / perSide;
        coords.push({
            x: v1.x + (v2.x - v1.x) * t,
            y: v1.y + (v2.y - v1.y) * t
        });
    }
    // Side 2: v2 -> v3
    for (let i = 0; i < perSide; i++) {
        const t = i / perSide;
        coords.push({
            x: v2.x + sideLength * t,
            y: v2.y
        });
    }
    // Side 3: v3 -> v1
    for (let i = 0; i < perSide; i++) {
        const t = i / perSide;
        coords.push({
            x: v3.x + (v1.x - v3.x) * t,
            y: v3.y + (v1.y - v3.y) * t
        });
    }

    return coords;
}

function getStarCoordinates(cx, cy, outerRadius, innerRadius) {
    const coords = [];
    const spikes = 5;
    const step = Math.PI / spikes;

    // Fixed count for consistent shape
    const pointsPerSegment = 15;

    for (let i = 0; i < spikes; i++) {
        let ang = i * 2 * Math.PI / spikes - Math.PI / 2;
        let nextAng = ang + step;

        let x1 = cx + Math.cos(ang) * outerRadius;
        let y1 = cy + Math.sin(ang) * outerRadius;

        let x2 = cx + Math.cos(nextAng) * innerRadius;
        let y2 = cy + Math.sin(nextAng) * innerRadius;

        // Outer to Inner
        for (let j = 0; j < pointsPerSegment; j++) {
            let t = j / pointsPerSegment;
            coords.push({
                x: x1 + (x2 - x1) * t,
                y: y1 + (y2 - y1) * t
            });
        }

        ang = nextAng;
        nextAng = ang + step;

        x1 = x2;
        y1 = y2;
        x2 = cx + Math.cos(nextAng) * outerRadius;
        y2 = cy + Math.sin(nextAng) * outerRadius;

        // Inner to Outer
        for (let j = 0; j < pointsPerSegment; j++) {
            let t = j / pointsPerSegment;
            coords.push({
                x: x1 + (x2 - x1) * t,
                y: y1 + (y2 - y1) * t
            });
        }
    }
    return coords;
}

function getHeartCoordinates(cx, cy, scale) {
    const coords = [];
    const pointCount = 150; // Fixed count

    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        coords.push({
            x: cx + x * scale,
            y: cy + y * scale
        });
    }
    return coords;
}

function setShapeTarget(shapeType) {
    // Clear existing targets first
    particles.forEach(p => { p.targetX = null; p.targetY = null; });

    // Don't do side shapes on mobile (too narrow)
    if (width < 768) return;

    let coords = [];
    const minDim = Math.min(width, height);

    // Define Left and Right Centers
    const leftCx = width * 0.15;
    const rightCx = width * 0.85;
    const commonCy = height * 0.5;

    // Helper to get coords for a type at a pos
    const getCoords = (type, cx, cy) => {
        if (type === 'circle') return getCircleCoordinates(cx, cy, minDim * 0.20); // Smaller on sides
        if (type === 'triangle') return getTriangleCoordinates(cx, cy, minDim * 0.35);
        if (type === 'star') return getStarCoordinates(cx, cy, minDim * 0.20, minDim * 0.10);
        if (type === 'heart') return getHeartCoordinates(cx, cy, minDim * 0.015);
        return [];
    };

    // Combine Left and Right shapes
    const leftCoords = getCoords(shapeType, leftCx, commonCy);
    const rightCoords = getCoords(shapeType, rightCx, commonCy);
    coords = [...leftCoords, ...rightCoords];

    // Shuffle coords for random assignment
    for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
    }

    // Assign to particles
    const limit = Math.min(coords.length, particles.length);
    for (let i = 0; i < limit; i++) {
        particles[i].targetX = coords[i].x + (Math.random() * 5 - 2.5);
        particles[i].targetY = coords[i].y + (Math.random() * 5 - 2.5);
    }
}


// ---- CYCLE LOGIC ---- //
let shapeInterval;
let currentShapeIndex = 0;
const shapes = ['circle', 'triangle', 'star', 'heart'];

function startShapeCycle() {
    if (shapeInterval) clearInterval(shapeInterval);

    // Immediate set
    setShapeTarget(shapes[currentShapeIndex]);

    shapeInterval = setInterval(() => {
        if (!isHovering) {
            currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
            setShapeTarget(shapes[currentShapeIndex]);
        }
    }, 8000); // Change every 8 seconds
}

function stopShapeCycle() {
    if (shapeInterval) clearInterval(shapeInterval);
}


function init() {
    resize();
    createParticles();

    // Start with a random shape instead of scattering
    currentShapeIndex = Math.floor(Math.random() * shapes.length);
    startShapeCycle();

    animate();
}

// Modify scatter to resume cycle after delay
function scatterParticles(force) {
    // If we were hovering, we are now stopping
    // But we don't want to immediately snap to shape, we want a smooth disperse then shape

    // First, clear targets to let them float freely
    particles.forEach(p => {
        // Give a little push away from center or random
        p.vx += (Math.random() - 0.5) * force;
        p.vy += (Math.random() - 0.5) * force;
        p.targetX = null;
        p.targetY = null;
    });

    // After a short delay, find the next shape
    setTimeout(() => {
        if (!isHovering) {
            setShapeTarget(shapes[currentShapeIndex]);
        }
    }, 1500);
}

// Event Listeners
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resize();
        init();
    }, 200);
});

// Triggers
const hoverEren = document.getElementById('hover-eren');
const hoverMente = document.getElementById('hover-mente');

const triggers = [
    { element: hoverEren, left: 'ER', right: 'EN' },
    { element: hoverMente, left: 'MEN', right: 'TE' },
    { element: uniName, left: 'F', right: 'Ü' },
    { element: expFirat, left: 'F', right: 'Ü' },
    { element: expBorusan, left: 'BAK', right: 'MTAL' }
];

triggers.forEach(t => {
    if (t.element) {
        t.element.addEventListener('mouseenter', () => {
            isHovering = true;
            stopShapeCycle(); // Stop cycling when user interacts
            setTextTarget(t.left, t.right);
        });
        t.element.addEventListener('mouseleave', () => {
            isHovering = false;
            scatterParticles(4); // will auto-resume cycle
            startShapeCycle(); // Ensure it restarts
        });
        t.element.addEventListener('click', () => {
            isHovering = true;
            stopShapeCycle();
            setTextTarget(t.left, t.right);
        });
    }
});

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
window.animate = animate;

init();

// Theme Observer
const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            if (window.particleResizeTimeout) clearTimeout(window.particleResizeTimeout);
            window.particleResizeTimeout = setTimeout(() => {
                init();
            }, 100);
        }
    });
});
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
});
