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
const PARTICLE_COUNT = 350;
const PARTICLE_SIZE = 3.5;
const LINK_DISTANCE = 90; // Reduced link distance for smaller groups
const FLOAT_SPEED = 0.2;
const FORMATION_SPEED = 0.03;

// Idle State Machine
let idleState = 'SHAPE';
let nextSwitchTime = 0;

// Multi-Group Config
const NUM_GROUPS = 4; // 4 Corners
// Each group has its own shape type tracking if we want fully independent cycles?
// For simplicity, let's keep global transition rhythm but random shapes per group.

const SHAPES = ['circle', 'infinity', 'heart', 'star', 'spiral', 'scatter'];

class Particle {
    constructor(groupId) {
        this.resize();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * FLOAT_SPEED;
        this.vy = (Math.random() - 0.5) * FLOAT_SPEED;
        this.targetX = null;
        this.targetY = null;

        // Group ID optimization (0, 1, 2, 3)
        this.groupId = groupId;

        // Dynamic Colors based on group? Or random?
        // Let's keep random mix but maybe subtle Tint per group?
        // Random mix is safer.
        if (Math.random() > 0.6) {
            this.color = 'rgba(79, 70, 229, ';
        } else if (Math.random() > 0.3) {
            this.color = 'rgba(147, 51, 234, ';
        } else {
            this.color = 'rgba(20, 184, 166, ';
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
    animate(performance.now());
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const particlesPerGroup = Math.floor(PARTICLE_COUNT / NUM_GROUPS);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Assign group ID based on index
        const gId = Math.min(Math.floor(i / particlesPerGroup), NUM_GROUPS - 1);
        particles.push(new Particle(gId));
    }
}

// ---- TEXT LOGIC ---- //
async function setTextTarget(leftWord, rightWord) {
    await document.fonts.ready;
    particles.forEach(p => { p.targetX = null; p.targetY = null; });

    let leftCoords = getTextCoordinates(leftWord, width * 0.05, height / 2, 1.2);

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    const fontSize = Math.min(width, height) / 5 * 1.2;
    offCtx.font = `900 ${fontSize}px "Outfit", sans-serif`;
    const rightWidth = offCtx.measureText(rightWord).width;

    let rightCoords = getTextCoordinates(rightWord, width * 0.95 - rightWidth, height / 2, 1.2);

    const allCoords = [...leftCoords, ...rightCoords];

    // Shuffle
    for (let i = allCoords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCoords[i], allCoords[j]] = [allCoords[j], allCoords[i]];
    }

    // Reserve 25% for background
    const maxParticlesForText = Math.floor(particles.length * 0.75);
    const limit = Math.min(allCoords.length, maxParticlesForText);

    for (let i = 0; i < limit; i++) {
        particles[i].targetX = allCoords[i].x + (Math.random() * 3 - 1.5);
        particles[i].targetY = allCoords[i].y + (Math.random() * 3 - 1.5);
    }
}

function getTextCoordinates(text, startX, startY, fontScale) {
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = width;
    offCanvas.height = height;

    const fontSize = Math.min(width, height) / 5 * fontScale;
    offCtx.font = `900 ${fontSize}px "Outfit", sans-serif`;
    offCtx.textAlign = 'left';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#fff';

    offCtx.fillText(text, startX, startY);

    const imgData = offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let coords = [];
    const gap = 3;

    for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
            if (data[(y * width + x) * 4 + 3] > 200) {
                coords.push({ x, y });
            }
        }
    }
    return coords;
}

// ---- MULTI-GROUP SHAPE LOGIC ---- //
function setRandomNextShapes() {
    // Determine centers for 4 groups (Quadrants with padding)
    const paddingX = width * 0.15; // 15% from edge
    const paddingY = height * 0.2;  // 20% from edge

    // Centers: [Top-Left, Top-Right, Bottom-Left, Bottom-Right]
    // Or randomized slightly?
    const centers = [
        { x: paddingX, y: paddingY },                   // TL
        { x: width - paddingX, y: paddingY },           // TR
        { x: paddingX, y: height - paddingY },          // BL
        { x: width - paddingX, y: height - paddingY }   // BR
    ];

    // Radius for small shapes
    const r = Math.min(width, height) * 0.12;

    // Split particles by group
    const particlesPerGroup = Math.floor(PARTICLE_COUNT / NUM_GROUPS);

    for (let g = 0; g < NUM_GROUPS; g++) {
        // Pick random shape for this group
        const shapeType = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const cx = centers[g].x;
        const cy = centers[g].y;

        // Process particles belonging to this group
        const startIdx = g * particlesPerGroup;
        const endIdx = startIdx + particlesPerGroup;

        for (let i = startIdx; i < endIdx; i++) {
            // Handle overflow
            if (!particles[i]) continue;

            let tx, ty;
            // Local angle 0..2PI within group
            const angle = ((i - startIdx) / particlesPerGroup) * Math.PI * 2;

            if (shapeType === 'circle') {
                tx = cx + Math.cos(angle) * r;
                ty = cy + Math.sin(angle) * r;
            } else if (shapeType === 'infinity') {
                const scale = r * 1.5;
                const den = 1 + Math.sin(angle) * Math.sin(angle);
                tx = cx + (scale * Math.cos(angle)) / den;
                ty = cy + (scale * Math.sin(angle) * Math.cos(angle)) / den;
            } else if (shapeType === 'star') {
                const k = 5;
                const starR = r * (0.5 + 0.5 * Math.cos(k * angle));
                tx = cx + starR * Math.cos(angle);
                ty = cy + starR * Math.sin(angle);
            } else if (shapeType === 'heart') {
                const scale = r * 0.04;
                tx = cx + (16 * Math.pow(Math.sin(angle), 3)) * scale;
                ty = cy - (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * scale;
            } else if (shapeType === 'spiral') {
                const loops = 4;
                const spiralR = r * ((i - startIdx) / particlesPerGroup);
                const variableAngle = angle * loops;
                tx = cx + spiralR * Math.cos(variableAngle);
                ty = cy + spiralR * Math.sin(variableAngle);
            } else {
                tx = null; ty = null;
            }

            if (particles[i]) {
                particles[i].targetX = tx;
                particles[i].targetY = ty;
            }
        }
    }

    // Set next switch time
    nextSwitchTime = performance.now() + Math.random() * 4000 + 6000;
    idleState = 'SHAPE';
}

function scatterParticles(force = 5) {
    particles.forEach(p => {
        p.targetX = null;
        p.targetY = null;
        p.vx = (Math.random() - 0.5) * force;
        p.vy = (Math.random() - 0.5) * force;
    });
}

function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);

    if (!isHovering) {
        if (idleState === 'SHAPE') {
            if (timestamp > nextSwitchTime) {
                idleState = 'TRANSITION';
                scatterParticles(12);
                nextSwitchTime = timestamp + 1000;
            }
        } else if (idleState === 'TRANSITION') {
            if (timestamp > nextSwitchTime) {
                setRandomNextShapes();
            }
        }
    }

    particles.forEach(p => { p.update(); p.draw(); });

    // CRITICAL OPTIMIZATION: Only connect particles within same GROUP
    if (idleState !== 'TRANSITION' && !isHovering) {
        connectGroupedParticles();
    }

    requestAnimationFrame(animate);
}

function connectGroupedParticles() {
    // Check connections only within groups (N/4 complexity per group)
    // Particles are sorted by group index by construction [000..111..222..333]
    // unless we shuffled array. We haven't shuffled 'particles' array globally, only usage indices.
    // So linear scan is valid.

    // To be safe, use nested loop with group checks
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            // OPTIMIZATION: If group ID differs, break or skip.
            // Since array is ordered by group, if j's group > i's group, we can STOP checking j for this i.
            // Because all subsequent j's will also have different group.
            if (particles[i].groupId !== particles[j].groupId) break;

            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;

            if (Math.abs(dx) > LINK_DISTANCE || Math.abs(dy) > LINK_DISTANCE) continue;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < LINK_DISTANCE) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(100, 116, 139, ${0.15 - dist / LINK_DISTANCE * 0.15})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Event Listeners
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
});

const triggers = [
    { element: heroName, left: 'ER', right: 'EN' },
    { element: uniName, left: 'F', right: 'Ü' },
    { element: expFirat, left: 'F', right: 'Ü' },
    { element: expBorusan, left: 'BAK', right: 'MTAL' }
];

triggers.forEach(t => {
    if (t.element) {
        t.element.addEventListener('mouseenter', () => {
            isHovering = true;
            setTextTarget(t.left, t.right);
        });
        t.element.addEventListener('mouseleave', () => {
            isHovering = false;
            scatterParticles(4);
            idleState = 'TRANSITION';
            nextSwitchTime = performance.now() + 800;
        });
        t.element.addEventListener('click', () => {
            isHovering = true;
            setTextTarget(t.left, t.right);
        });
    }
});

init();
