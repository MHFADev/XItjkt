// Three.js 3D Background Scene - TJKT Network Theme
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
        if (!canvas) {
            console.warn('Three.js canvas not found');
            return;
        }
        
        try {
            this.renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
                failIfMajorPerformanceCaveat: false
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        } catch (error) {
            console.warn('WebGL not available, hiding canvas:', error);
            canvas.style.display = 'none';
            this.renderer = null;
        }
    }

    setupLights() {
        // Ambient light with purple tint
        const ambientLight = new THREE.AmbientLight(0x8B5CF6, 0.5);
        this.scene.add(ambientLight);

        // Directional lights with networking theme colors
        const directionalLight1 = new THREE.DirectionalLight(0x8B5CF6, 0.8);
        directionalLight1.position.set(5, 5, 5);
        this.scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0xEC4899, 0.5);
        directionalLight2.position.set(-5, -5, 5);
        this.scene.add(directionalLight2);
    }

    createObjects() {
        this.createNetworkNodes();
        this.createServerRacks();
        this.createDataPackets();
        this.createNetworkGrid();
        this.createFloatingIcons();
    }

    createNetworkNodes() {
        // Create router/switch-like nodes
        const nodeGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.3);
        const positions = [
            [-3, 2, -2],
            [3, -1, -3],
            [-2, -2, -1],
            [2, 1, -2],
            [0, 3, -4]
        ];
        
        const colors = [0x8B5CF6, 0xEC4899, 0x10B981, 0x3B82F6, 0xF59E0B];

        positions.forEach((position, index) => {
            const material = new THREE.MeshLambertMaterial({
                color: colors[index],
                opacity: 0.7,
                transparent: true,
                emissive: colors[index],
                emissiveIntensity: 0.3
            });

            const node = new THREE.Mesh(nodeGeometry, material);
            node.position.set(...position);
            node.userData = {
                originalPosition: [...position],
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.01
                },
                floatSpeed: Math.random() * 0.008 + 0.004,
                floatOffset: index * Math.PI / 3,
                type: 'networkNode'
            };
            
            // Add LED lights effect
            const ledGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const ledMaterial = new THREE.MeshLambertMaterial({
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 1
            });
            
            for (let i = 0; i < 3; i++) {
                const led = new THREE.Mesh(ledGeometry, ledMaterial);
                led.position.set(0.25, 0.15 - i * 0.15, 0.16);
                node.add(led);
                
                led.userData = {
                    blinkOffset: i * Math.PI / 3,
                    blinkSpeed: 0.05
                };
            }
            
            this.scene.add(node);
            this.objects.push(node);
        });
    }

    createServerRacks() {
        // Create server rack representations
        for (let i = 0; i < 2; i++) {
            const rackGroup = new THREE.Group();
            
            // Main server body
            const serverGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
            const serverMaterial = new THREE.MeshLambertMaterial({
                color: 0x1e293b,
                opacity: 0.8,
                transparent: true
            });
            
            const server = new THREE.Mesh(serverGeometry, serverMaterial);
            rackGroup.add(server);
            
            // Add server slots (horizontal lines)
            for (let j = 0; j < 8; j++) {
                const slotGeometry = new THREE.BoxGeometry(0.82, 0.05, 0.42);
                const slotMaterial = new THREE.MeshBasicMaterial({
                    color: 0x8B5CF6,
                    opacity: 0.5,
                    transparent: true
                });
                const slot = new THREE.Mesh(slotGeometry, slotMaterial);
                slot.position.y = -0.5 + (j * 0.15);
                rackGroup.add(slot);
            }
            
            rackGroup.position.set(
                i === 0 ? -4 : 4,
                0,
                -6
            );
            
            rackGroup.userData = {
                originalPosition: [rackGroup.position.x, rackGroup.position.y, rackGroup.position.z],
                rotationSpeed: { x: 0, y: 0.005, z: 0 },
                floatSpeed: 0.003,
                floatOffset: i * Math.PI,
                type: 'server'
            };
            
            this.scene.add(rackGroup);
            this.objects.push(rackGroup);
        }
    }

    createDataPackets() {
        // Create small data packet cubes flying around
        const packetCount = 30;
        
        for (let i = 0; i < packetCount; i++) {
            const size = Math.random() * 0.1 + 0.05;
            const packetGeometry = new THREE.BoxGeometry(size, size, size);
            const packetMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x8B5CF6 : 0xEC4899,
                opacity: 0.6,
                transparent: true
            });
            
            const packet = new THREE.Mesh(packetGeometry, packetMaterial);
            packet.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            packet.userData = {
                velocity: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.05,
                    y: (Math.random() - 0.5) * 0.05,
                    z: (Math.random() - 0.5) * 0.05
                },
                type: 'dataPacket'
            };
            
            this.scene.add(packet);
            this.objects.push(packet);
        }
    }

    createNetworkGrid() {
        // Create grid pattern representing network topology
        const gridSize = 10;
        const divisions = 20;
        const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x8B5CF6, 0x334155);
        gridHelper.position.y = -3;
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        
        this.scene.add(gridHelper);
        this.objects.push(gridHelper);
    }

    createFloatingIcons() {
        // Create WiFi signal icon representation
        const wifiGroup = new THREE.Group();
        
        for (let i = 0; i < 3; i++) {
            const arcGeometry = new THREE.TorusGeometry(
                0.3 + i * 0.2,
                0.05,
                8,
                16,
                Math.PI
            );
            const arcMaterial = new THREE.MeshBasicMaterial({
                color: 0x10B981,
                opacity: 0.7 - i * 0.2,
                transparent: true
            });
            const arc = new THREE.Mesh(arcGeometry, arcMaterial);
            arc.rotation.x = Math.PI / 2;
            arc.position.y = -0.1 - i * 0.1;
            wifiGroup.add(arc);
        }
        
        wifiGroup.position.set(0, 0, -8);
        wifiGroup.scale.setScalar(0.5);
        wifiGroup.userData = {
            rotationSpeed: { x: 0, y: 0.01, z: 0 },
            type: 'wifi'
        };
        
        this.scene.add(wifiGroup);
        this.objects.push(wifiGroup);
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            if (!this.camera || !this.renderer) return;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        if (!this.renderer || !this.camera || !this.scene) {
            return;
        }
        requestAnimationFrame(() => this.animate());


        const time = Date.now() * 0.001;

        this.objects.forEach((object) => {
            const userData = object.userData;
            
            if (userData.type === 'networkNode') {
                // Rotate network nodes
                if (userData.rotationSpeed) {
                    object.rotation.x += userData.rotationSpeed.x;
                    object.rotation.y += userData.rotationSpeed.y;
                    object.rotation.z += userData.rotationSpeed.z;
                }
                
                // Float animation
                if (userData.originalPosition && userData.floatSpeed) {
                    const floatY = Math.sin(time * userData.floatSpeed + userData.floatOffset) * 0.3;
                    object.position.y = userData.originalPosition[1] + floatY;
                }
                
                // Animate LED lights
                object.children.forEach((led) => {
                    if (led.userData.blinkOffset !== undefined) {
                        const blink = Math.sin(time * led.userData.blinkSpeed + led.userData.blinkOffset);
                        led.material.emissiveIntensity = (blink + 1) * 0.5 + 0.5;
                    }
                });
            }
            
            if (userData.type === 'server') {
                // Rotate servers slowly
                if (userData.rotationSpeed) {
                    object.rotation.y += userData.rotationSpeed.y;
                }
                
                // Float animation
                if (userData.originalPosition && userData.floatSpeed) {
                    const floatY = Math.sin(time * userData.floatSpeed + userData.floatOffset) * 0.5;
                    object.position.y = userData.originalPosition[1] + floatY;
                }
            }
            
            if (userData.type === 'dataPacket') {
                // Move data packets
                object.position.x += userData.velocity.x;
                object.position.y += userData.velocity.y;
                object.position.z += userData.velocity.z;
                
                // Bounce off boundaries
                if (Math.abs(object.position.x) > 7) userData.velocity.x *= -1;
                if (Math.abs(object.position.y) > 5) userData.velocity.y *= -1;
                if (Math.abs(object.position.z) > 5) userData.velocity.z *= -1;
                
                // Rotate packets
                object.rotation.x += userData.rotationSpeed.x;
                object.rotation.y += userData.rotationSpeed.y;
                object.rotation.z += userData.rotationSpeed.z;
            }
            
            if (userData.type === 'wifi') {
                // Rotate WiFi icon
                object.rotation.y += userData.rotationSpeed.y;
                
                // Pulse animation
                const scale = 0.5 + Math.sin(time * 2) * 0.1;
                object.scale.setScalar(scale);
            }
        });

        // Camera movement based on mouse
        if (this.camera) {
            this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
            this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
            this.camera.lookAt(this.scene.position);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Three.js scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.THREE) {
        try {
            new ThreeScene();
        } catch (error) {
            console.warn('Three.js scene could not be initialized:', error);
            // Hide canvas on error
            const canvas = document.getElementById('three-canvas');
            if (canvas) canvas.style.display = 'none';
        }
    } else {
        console.warn('Three.js library not loaded');
        const canvas = document.getElementById('three-canvas');
        if (canvas) canvas.style.display = 'none';
    }
});
