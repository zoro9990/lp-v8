// ===== THREE.JS SCENE FOR LOOT CRATE POPUP =====
let scene, camera, renderer, outerShell, crystalCore, particles, ring1, ring2;
let pointLight, pointLight2;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let animationId = null;
let isInitialized = false;

// ===== INITIALIZE THREE.JS SCENE =====
function initThreeJSScene() {
    const container = document.getElementById('threejs-container');
    if (!container || isInitialized) return;
    
    isInitialized = true;
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 7.5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(256, 256);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create objects
    createAnomalyObjects();
    createParticles();
    addLights();
    
    // Events
    document.addEventListener('mousemove', onMouseMove);
    
    // Start
    animate();
}

// ===== CREATE ANOMALY OBJECTS =====
function createAnomalyObjects() {
    // 1. Crystal Core (Octahedron)
    const coreGeo = new THREE.OctahedronGeometry(1.5, 0);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0x880000,
        transparent: true,
        opacity: 0.9,
        shininess: 100,
        flatShading: true
    });
    crystalCore = new THREE.Mesh(coreGeo, coreMat);
    scene.add(crystalCore);
    
    // 2. Outer Wireframe Shell (Icosahedron)
    const shellGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const shellMat = new THREE.MeshBasicMaterial({
        color: 0xff2222,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    outerShell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(outerShell);
    
    // 3. Energy Rings
    const ringGeo1 = new THREE.TorusGeometry(3.6, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
    ring1 = new THREE.Mesh(ringGeo1, ringMat);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);
    
    const ringGeo2 = new THREE.TorusGeometry(4.0, 0.04, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff5555, transparent: true, opacity: 0.3 });
    ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);
}

// ===== CREATE PARTICLES =====
function createParticles() {
    const count = 100;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        // Distribute particles in a spherical volume
        const radius = 2 + Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xff3333,
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// ===== ADD LIGHTS =====
function addLights() {
    pointLight = new THREE.PointLight(0xff0000, 3, 20);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    
    pointLight2 = new THREE.PointLight(0xff5555, 2, 20);
    pointLight2.position.set(4, 4, 4);
    scene.add(pointLight2);
    
    const ambient = new THREE.AmbientLight(0x220000, 1);
    scene.add(ambient);
}

// ===== MOUSE MOVE =====
function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

// ===== ANIMATION LOOP =====
function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (!outerShell || !crystalCore || !particles || !ring1 || !ring2) return;
    
    const time = Date.now() * 0.001;
    
    // Smooth camera rotation based on mouse
    targetRotationX += (mouseY * 0.2 - targetRotationX) * 0.05;
    targetRotationY += (mouseX * 0.2 - targetRotationY) * 0.05;
    
    scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.1;
    scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.1;
    
    // Fast outer shell rotation
    outerShell.rotation.x += 0.008;
    outerShell.rotation.y += 0.012;
    
    // Chaotic crystal core rotation
    crystalCore.rotation.x -= 0.02;
    crystalCore.rotation.y += 0.015;
    crystalCore.rotation.z += 0.01;
    
    // Pulse core aggressively
    const coreScale = 1 + Math.sin(time * 8) * 0.05;
    crystalCore.scale.set(coreScale, coreScale, coreScale);
    
    // Rotate rings opposing each other
    ring1.rotation.z -= 0.02;
    ring1.rotation.x = Math.PI / 2 + Math.sin(time * 2) * 0.15;
    
    ring2.rotation.z += 0.03;
    ring2.rotation.y = Math.PI / 4 + Math.cos(time * 3) * 0.2;
    
    // Erratic particle movement
    particles.rotation.y += 0.005;
    particles.rotation.x -= 0.003;
    particles.rotation.z = Math.sin(time) * 0.1;
    
    // Glitching lights
    pointLight.intensity = Math.sin(time * 10) * 1.5 + 2.5;
    pointLight2.intensity = Math.random() > 0.9 ? 4 : (Math.cos(time * 5) * 0.5 + 1.5);
    
    renderer.render(scene, camera);
}

// ===== CLEANUP =====
function cleanupScene() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    if (scene) {
        scene.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                Array.isArray(obj.material) 
                    ? obj.material.forEach(m => m.dispose()) 
                    : obj.material.dispose();
            }
        });
        while (scene.children.length) scene.remove(scene.children[0]);
    }
    
    if (renderer) {
        renderer.dispose();
        const container = document.getElementById('threejs-container');
        container?.removeChild(renderer.domElement);
    }
    
    scene = camera = renderer = outerShell = crystalCore = particles = ring1 = ring2 = null;
    isInitialized = false;
}

// ===== MODAL CONTROL =====
let modalShown = false;
let exitIntentTriggered = false;

function showModal() {
    if (modalShown) return;
    
    const modal = document.getElementById('lootModal');
    if (modal) {
        modal.classList.add('show');
        modalShown = true;
        setTimeout(initThreeJSScene, 150);
    }
}

function hideModal() {
    const modal = document.getElementById('lootModal');
    if (modal) {
        modal.classList.remove('show');
        // Stop animation immediately to save GPU
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        setTimeout(cleanupScene, 400);
    }
}

// ===== AUTO SHOW REMOVED =====
// ===== EXIT INTENT REMOVED =====

// ===== CLOSE EVENTS =====
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeModal')?.addEventListener('click', hideModal);
    
    document.getElementById('lootModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'lootModal') hideModal();
    });
});

// ===== KEYBOARD CLOSE =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
});

// ===== GLOBAL EXPORTS =====
window.showLootModal = showModal;
window.hideLootModal = hideModal;