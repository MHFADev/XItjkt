// Cute Interactions & Fun Features for XI TJKT 1
class CuteInteractions {
    constructor() {
        this.clickCount = 0;
        this.mascotMessages = [
            "Hai! Aku maskot XI TJKT 1! 🤖",
            "Website ini keren kan? 😎",
            "Coba cari Easter Egg! 🥚",
            "Klik 10x untuk surprise! 🎁",
            "XI TJKT 1 is the BEST! 🏆",
            "Jangan lupa support dev ya! ❤️",
            "Networking is cool! 🌐",
            "Have fun exploring! 🎨",
            "Psst... tekan Konami code! 🎮",
            "Double-click judul untuk efek rainbow! 🌈"
        ];
        this.currentMessageIndex = 0;
        this.heartCount = 0;
        this.init();
    }

    init() {
        this.setupMascot();
        this.setupClickCounter();
        this.setupShakeToReveal();
        this.setupDoubleClickEffects();
        this.setupHoverSounds();
        this.setupRandomFloatingElements();
        this.setupCelebrations();
        this.showMascotAfterDelay();
    }

    setupMascot() {
        const mascot = document.getElementById('cute-mascot');
        const bubble = document.getElementById('mascot-bubble');
        
        if (!mascot) return;
        
        mascot.addEventListener('click', () => {
            this.clickCount++;
            document.getElementById('click-count').textContent = this.clickCount;
            
            // Show random message
            this.currentMessageIndex = Math.floor(Math.random() * this.mascotMessages.length);
            bubble.textContent = this.mascotMessages[this.currentMessageIndex];
            bubble.style.display = 'block';
            
            // Create sparkles
            this.createSparkles(mascot.getBoundingClientRect());
            
            // Hide bubble after 3 seconds
            setTimeout(() => {
                bubble.style.display = 'none';
            }, 3000);
            
            // Special effects at milestones
            if (this.clickCount === 10) {
                this.triggerConfetti();
                this.showNotification('🎉 10 Klik! Kamu dapat badge "Curious Explorer"! 🎉');
            } else if (this.clickCount === 50) {
                this.triggerFireworks();
                this.showNotification('🎆 50 Klik! Kamu dapat badge "Super Clicker"! 🎆');
            } else if (this.clickCount === 100) {
                this.triggerRainbowMode();
                this.showNotification('🌈 100 Klik! Rainbow Mode Activated! 🌈');
            }
        });
        
        // Show bubble on hover
        mascot.addEventListener('mouseenter', () => {
            bubble.textContent = this.mascotMessages[this.currentMessageIndex];
            bubble.style.display = 'block';
        });
        
        mascot.addEventListener('mouseleave', () => {
            setTimeout(() => {
                bubble.style.display = 'none';
            }, 1000);
        });
    }

    showMascotAfterDelay() {
        setTimeout(() => {
            const mascot = document.getElementById('cute-mascot');
            const counter = document.getElementById('fun-counter');
            if (mascot) {
                mascot.style.display = 'block';
                mascot.style.animation = 'slideInLeft 0.5s ease-out';
            }
            if (counter) {
                counter.style.display = 'block';
                counter.style.animation = 'slideInLeft 0.5s ease-out';
            }
        }, 2000);
    }

    setupClickCounter() {
        // Count all clicks on page
        document.addEventListener('click', (e) => {
            // Don't count mascot clicks twice
            if (!e.target.closest('#cute-mascot')) {
                this.clickCount++;
                document.getElementById('click-count').textContent = this.clickCount;
            }
            
            // Create mini heart on click
            this.createMiniHeart(e.clientX, e.clientY);
        });
    }

    setupShakeToReveal() {
        let shakeCount = 0;
        let lastShake = 0;
        
        window.addEventListener('devicemotion', (e) => {
            const acceleration = e.accelerationIncludingGravity;
            const now = Date.now();
            
            if (now - lastShake > 1000) {
                const total = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
                
                if (total > 30) {
                    shakeCount++;
                    lastShake = now;
                    
                    if (shakeCount === 3) {
                        this.revealSecretMessage();
                        shakeCount = 0;
                    }
                }
            }
        });
    }

    setupDoubleClickEffects() {
        // Double-click on sections for fun effects
        document.querySelectorAll('section').forEach(section => {
            let clickTimeout;
            let clickCount = 0;
            
            section.addEventListener('click', () => {
                clickCount++;
                
                if (clickCount === 2) {
                    this.createBurstEffect(section);
                    clickCount = 0;
                }
                
                clearTimeout(clickTimeout);
                clickTimeout = setTimeout(() => {
                    clickCount = 0;
                }, 500);
            });
        });
    }

    setupHoverSounds() {
        // Fun hover effects with visual feedback
        document.querySelectorAll('.glass-card, .network-node, button, a').forEach(element => {
            element.addEventListener('mouseenter', () => {
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'hover-ripple';
                ripple.style.cssText = `
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(139, 92, 246, 0.3);
                    pointer-events: none;
                    animation: ripple-expand 0.6s ease-out;
                `;
                element.style.position = 'relative';
                element.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    setupRandomFloatingElements() {
        // Create random floating emojis
        const emojis = ['💻', '🌐', '📡', '🔌', '💾', '🖥️', '⚡', '🚀', '✨', '⭐'];
        
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
            }
        }, 3000);
    }

    setupCelebrations() {
        // Celebrate when scrolling to certain sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.celebrated) {
                    this.miniCelebration(entry.target);
                    entry.target.dataset.celebrated = 'true';
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    // Helper Functions
    createSparkles(rect) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top + rect.height / 2}px;
                    font-size: 20px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: sparkle-float 1s ease-out forwards;
                `;
                
                const angle = (Math.PI * 2 * i) / 5;
                sparkle.style.setProperty('--tx', Math.cos(angle) * 50 + 'px');
                sparkle.style.setProperty('--ty', Math.sin(angle) * 50 + 'px');
                
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 50);
        }
    }

    createMiniHeart(x, y) {
        this.heartCount++;
        
        // Only show hearts occasionally
        if (this.heartCount % 5 !== 0) return;
        
        const heart = document.createElement('div');
        heart.textContent = ['❤️', '💜', '💖', '💕'][Math.floor(Math.random() * 4)];
        heart.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 16px;
            pointer-events: none;
            z-index: 9999;
            animation: heart-float 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }

    createFloatingEmoji(emoji) {
        const floater = document.createElement('div');
        floater.textContent = emoji;
        floater.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            bottom: -50px;
            font-size: 30px;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
            animation: float-up-slow 8s linear forwards;
        `;
        
        document.body.appendChild(floater);
        setTimeout(() => floater.remove(), 8000);
    }

    createBurstEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 8px;
                height: 8px;
                background: linear-gradient(135deg, #8B5CF6, #EC4899);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            
            const angle = (Math.PI * 2 * i) / 12;
            const distance = 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.animation = `burst-out 0.8s ease-out forwards`;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }

    miniCelebration(element) {
        // Small celebration when entering a section
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.textContent = '🎊';
                confetti.style.cssText = `
                    position: fixed;
                    left: ${rect.left + Math.random() * rect.width}px;
                    top: ${rect.top}px;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: mini-confetti 1.5s ease-out forwards;
                `;
                
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 1500);
            }, i * 200);
        }
    }

    triggerConfetti() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.textContent = ['🎉', '🎊', '✨', '⭐'][Math.floor(Math.random() * 4)];
                confetti.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: -50px;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: confetti-fall 3s linear forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    triggerFireworks() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * (window.innerHeight / 2);
                
                for (let j = 0; j < 20; j++) {
                    const firework = document.createElement('div');
                    firework.style.cssText = `
                        position: fixed;
                        left: ${x}px;
                        top: ${y}px;
                        width: 4px;
                        height: 4px;
                        background: hsl(${Math.random() * 360}, 100%, 50%);
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 9999;
                    `;
                    
                    const angle = (Math.PI * 2 * j) / 20;
                    const distance = 50 + Math.random() * 50;
                    firework.style.animation = 'firework 1s ease-out forwards';
                    firework.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
                    firework.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
                    
                    document.body.appendChild(firework);
                    setTimeout(() => firework.remove(), 1000);
                }
            }, i * 300);
        }
    }

    triggerRainbowMode() {
        document.body.style.animation = 'rainbow-bg 3s linear';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }

    revealSecretMessage() {
        this.showNotification('📱 Kamu menemukan fitur shake! XI TJKT 1 Keren! 📱');
        this.triggerConfetti();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            z-index: 10000;
            animation: notification-slide 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 90%;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notification-slide-out 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Add CSS animations
const cuteStyles = document.createElement('style');
cuteStyles.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes sparkle-float {
        to {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
        }
    }
    
    @keyframes heart-float {
        to {
            transform: translateY(-100px);
            opacity: 0;
        }
    }
    
    @keyframes float-up-slow {
        to {
            bottom: 100%;
            opacity: 0;
        }
    }
    
    @keyframes burst-out {
        to {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
        }
    }
    
    @keyframes mini-confetti {
        to {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes confetti-fall {
        to {
            top: 100%;
            opacity: 0;
        }
    }
    
    @keyframes firework {
        to {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
        }
    }
    
    @keyframes rainbow-bg {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
    }
    
    @keyframes notification-slide {
        from {
            top: -100px;
            opacity: 0;
        }
        to {
            top: 100px;
            opacity: 1;
        }
    }
    
    @keyframes notification-slide-out {
        from {
            top: 100px;
            opacity: 1;
        }
        to {
            top: -100px;
            opacity: 0;
        }
    }
    
    @keyframes ripple-expand {
        to {
            transform: scale(8);
            opacity: 0;
        }
    }
`;
document.head.appendChild(cuteStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CuteInteractions();
});
