// Three.js 3D Background Scene
class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.createObjects();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
    }

    setupRenderer() {
        const canvas = document.getElementById('three-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    createObjects() {
        // Create floating geometric shapes
        this.createFloatingShapes();
        this.createParticles();
        this.createWaveform();
        this.createYinYang3D();
    }

    createFloatingShapes() {
        const shapes = [
            { geometry: new THREE.BoxGeometry(0.5, 0.5, 0.5), position: [-3, 2, -2] },
            { geometry: new THREE.SphereGeometry(0.3, 32, 32), position: [3, -1, -3] },
            { geometry: new THREE.ConeGeometry(0.3, 0.8, 8), position: [-2, -2, -1] },
            { geometry: new THREE.OctahedronGeometry(0.4), position: [2, 1, -2] },
            { geometry: new THREE.TorusGeometry(0.3, 0.1, 8, 16), position: [0, 3, -4] }
        ];

        shapes.forEach((shape, index) => {
            const isDark = document.documentElement.classList.contains('dark');
            const material = new THREE.MeshLambertMaterial({
                color: isDark ? 0xffffff : 0x000000,
                opacity: 0.1,
                transparent: true
            });

            const mesh = new THREE.Mesh(shape.geometry, material);
            mesh.position.set(...shape.position);
            mesh.userData = { 
                originalPosition: [...shape.position],
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005,
                floatOffset: index * Math.PI / 3
            };
            
            this.scene.add(mesh);
            this.objects.push(mesh);
        });
    }

    createParticles() {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;

            // Color
            const isDark = document.documentElement.classList.contains('dark');
            const color = isDark ? 1 : 0;
            colors[i3] = color;
            colors[i3 + 1] = color;
            colors[i3 + 2] = color;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.objects.push(particles);
    }

    createWaveform() {
        const waveGeometry = new THREE.PlaneGeometry(10, 10, 50, 50);
        const positions = waveGeometry.attributes.position.array;
        
        // Store original positions for wave animation
        waveGeometry.userData = { originalPositions: [...positions] };

        const isDark = document.documentElement.classList.contains('dark');
        const waveMaterial = new THREE.MeshLambertMaterial({
            color: isDark ? 0xffffff : 0x000000,
            opacity: 0.05,
            transparent: true,
            wireframe: true
        });

        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.rotation.x = -Math.PI / 4;
        wave.position.z = -8;
        
        this.scene.add(wave);
        this.objects.push(wave);
    }

    createYinYang3D() {
        // Create main yin-yang circle
        const yinYangGroup = new THREE.Group();
        
        // Yin side (black)
        const yinGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32, 1, false, 0, Math.PI);
        const yinMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        const yinMesh = new THREE.Mesh(yinGeometry, yinMaterial);
        yinMesh.rotation.y = Math.PI;
        yinYangGroup.add(yinMesh);
        
        // Yang side (white)
        const yangGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32, 1, false, 0, Math.PI);
        const yangMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const yangMesh = new THREE.Mesh(yangGeometry, yangMaterial);
        yinYangGroup.add(yangMesh);
        
        // Small yin circle (white dot on black side)
        const smallYinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.31, 32);
        const smallYinMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const smallYinMesh = new THREE.Mesh(smallYinGeometry, smallYinMaterial);
        smallYinMesh.position.set(-1, 0, 0);
        yinYangGroup.add(smallYinMesh);
        
        // Small yang circle (black dot on white side)
        const smallYangGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.31, 32);
        const smallYangMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.9
        });
        const smallYangMesh = new THREE.Mesh(smallYangGeometry, smallYangMaterial);
        smallYangMesh.position.set(1, 0, 0);
        yinYangGroup.add(smallYangMesh);
        
        // Large yin semicircle (black on white side)
        const largeYinGeometry = new THREE.CylinderGeometry(1, 1, 0.31, 32, 1, false, 0, Math.PI);
        const largeYinMesh = new THREE.Mesh(largeYinGeometry, yinMaterial);
        largeYinMesh.position.set(1, 0, 0);
        largeYinMesh.rotation.y = Math.PI;
        yinYangGroup.add(largeYinMesh);
        
        // Large yang semicircle (white on black side)
        const largeYangGeometry = new THREE.CylinderGeometry(1, 1, 0.31, 32, 1, false, 0, Math.PI);
        const largeYangMesh = new THREE.Mesh(largeYangGeometry, yangMaterial);
        largeYangMesh.position.set(-1, 0, 0);
        yinYangGroup.add(largeYangMesh);
        
        // Position the yin-yang in the background
        yinYangGroup.position.set(0, 0, -10);
        yinYangGroup.rotation.x = Math.PI / 2;
        
        // Store reference for animation
        yinYangGroup.userData = {
            isYinYang: true,
            rotationSpeed: 0.005
        };
        
        this.scene.add(yinYangGroup);
        this.objects.push(yinYangGroup);
        
        // Create multiple smaller yin-yang symbols floating around
        for (let i = 0; i < 3; i++) {
            const smallYinYang = yinYangGroup.clone();
            smallYinYang.scale.setScalar(0.3);
            smallYinYang.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
                -15 + Math.random() * -5
            );
            smallYinYang.userData = {
                isYinYang: true,
                rotationSpeed: 0.01 + Math.random() * 0.02,
                floatSpeed: 0.002 + Math.random() * 0.005,
                floatOffset: i * Math.PI / 1.5,
                originalPosition: [...smallYinYang.position.toArray()]
            };
            
            this.scene.add(smallYinYang);
            this.objects.push(smallYinYang);
        }
    }

    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Theme change
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => {
            setTimeout(() => {
                this.updateThemeColors();
            }, 100);
        });
    }

    updateThemeColors() {
        const isDark = document.documentElement.classList.contains('dark');
        
        this.objects.forEach(object => {
            // Skip yin-yang objects as they should maintain their black/white colors
            if (object.userData && object.userData.isYinYang) {
                return;
            }
            
            if (object.material) {
                if (object.material.color) {
                    object.material.color.setHex(isDark ? 0xffffff : 0x000000);
                }
                if (object.material.vertexColors && object.geometry.attributes.color) {
                    const colors = object.geometry.attributes.color.array;
                    const color = isDark ? 1 : 0;
                    
                    for (let i = 0; i < colors.length; i += 3) {
                        colors[i] = color;
                        colors[i + 1] = color;
                        colors[i + 2] = color;
                    }
                    object.geometry.attributes.color.needsUpdate = true;
                }
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Animate floating shapes
        this.objects.forEach((object, index) => {
            if (object.userData && object.userData.rotationSpeed) {
                // Rotation
                object.rotation.x += object.userData.rotationSpeed.x;
                object.rotation.y += object.userData.rotationSpeed.y;
                object.rotation.z += object.userData.rotationSpeed.z;

                // Floating movement
                const floatY = Math.sin(time * object.userData.floatSpeed + object.userData.floatOffset) * 0.5;
                object.position.y = object.userData.originalPosition[1] + floatY;

                // Mouse interaction
                const mouseInfluence = 0.1;
                object.position.x += (this.mouse.x * mouseInfluence - object.position.x) * 0.05;
                object.rotation.y += this.mouse.x * 0.01;
            }

            // Animate particles
            if (object.type === 'Points') {
                object.rotation.y += 0.002;
                object.rotation.x += 0.001;
            }

            // Animate wave
            if (object.geometry && object.geometry.userData && object.geometry.userData.originalPositions) {
                const positions = object.geometry.attributes.position.array;
                const originalPositions = object.geometry.userData.originalPositions;

                for (let i = 0; i < positions.length; i += 3) {
                    const x = originalPositions[i];
                    const y = originalPositions[i + 1];
                    
                    positions[i + 2] = Math.sin((x + time) * 0.5) * Math.cos((y + time) * 0.5) * 0.1;
                }
                
                object.geometry.attributes.position.needsUpdate = true;
            }
            
            // Animate yin-yang symbols
            if (object.userData && object.userData.isYinYang) {
                // Main rotation
                object.rotation.z += object.userData.rotationSpeed;
                
                // Floating movement for smaller yin-yangs
                if (object.userData.floatSpeed && object.userData.originalPosition) {
                    const floatY = Math.sin(time * object.userData.floatSpeed + object.userData.floatOffset) * 2;
                    const floatX = Math.cos(time * object.userData.floatSpeed * 0.7 + object.userData.floatOffset) * 1;
                    
                    object.position.x = object.userData.originalPosition[0] + floatX;
                    object.position.y = object.userData.originalPosition[1] + floatY;
                    
                    // Additional rotation for smaller ones
                    object.rotation.x += 0.002;
                    object.rotation.y += 0.003;
                }
            }
        });

        // Camera movement based on mouse
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Three.js scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if WebGL is supported
    if (window.THREE && window.WebGLRenderingContext) {
        try {
            new ThreeScene();
        } catch (error) {
            console.warn('Three.js scene could not be initialized:', error);
        }
    }
});
