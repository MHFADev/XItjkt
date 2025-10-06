// Animation Controller - Class Website Edition
class AnimationController {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.konamiIndex = 0;
        this.clickCount = 0;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupInteractiveElements();
        this.setupEasterEggs();
        this.setupCursorEffects();
        this.setupHoverAnimations();
        this.startAnimationLoop();
    }

    // 1. Loading Screen Animation
    setupLoadingScreen() {
        const hideLoading = () => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        };
        
        // Hide after window load
        window.addEventListener('load', () => {
            setTimeout(hideLoading, 1000);
        });
        
        // Failsafe: hide after 3 seconds regardless
        setTimeout(hideLoading, 3000);
    }

    // 2. Theme Toggle Animation
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

        themeToggle?.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Fun animation
            themeToggle.style.transform = 'scale(0.8) rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
            
            // Create sparkles
            this.createSparkles(themeToggle.getBoundingClientRect());
        });
    }

    // 3. Mobile Menu Animation
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuBtn?.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.style.opacity = '0';
                
                requestAnimationFrame(() => {
                    mobileMenu.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
                    mobileMenu.style.maxHeight = '400px';
                    mobileMenu.style.opacity = '1';
                });
            } else {
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.style.opacity = '0';
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            }
        });
        
        // Close menu when clicking a link
        mobileMenu?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.style.opacity = '0';
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            });
        });
    }

    // 4. Scroll-triggered Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.animate-fade-in-up, .animate-scale-in, .animate-slide-in-left, .animate-slide-in-right').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // 5. Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 6. Interactive Elements
    setupInteractiveElements() {
        // Hover effects for cards
        document.querySelectorAll('.glass-card, .hover-lift').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Click ripple effect
        document.querySelectorAll('.glass-card, button').forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }

    // 7. Easter Eggs (Fun Features!)
    setupEasterEggs() {
        // Konami Code Easter Egg
        document.addEventListener('keydown', (e) => {
            if (e.key === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.activateKonamiCode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });

        // Secret Click Counter on Logo
        document.querySelector('nav a')?.addEventListener('click', (e) => {
            this.clickCount++;
            if (this.clickCount === 10) {
                e.preventDefault();
                this.showSecretMessage();
                this.clickCount = 0;
            }
        });

        // Shake elements on hold
        document.querySelectorAll('.network-node').forEach(node => {
            let holdTimer;
            
            node.addEventListener('mousedown', () => {
                holdTimer = setTimeout(() => {
                    this.shakeElement(node);
                    this.createHeartExplosion(node);
                }, 1000);
            });
            
            node.addEventListener('mouseup', () => {
                clearTimeout(holdTimer);
            });
            
            node.addEventListener('mouseleave', () => {
                clearTimeout(holdTimer);
            });
        });

        // Double-click any section title for fun
        document.querySelectorAll('h2').forEach(title => {
            title.addEventListener('dblclick', () => {
                this.rainbowText(title);
            });
        });
    }

    // 8. Cursor Effects
    setupCursorEffects() {
        // Create custom cursor trail
        let cursorTrail = [];
        const maxTrailLength = 10;
        
        document.addEventListener('mousemove', (e) => {
            // Add cursor position to trail
            cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            // Limit trail length
            if (cursorTrail.length > maxTrailLength) {
                cursorTrail.shift();
            }
            
            // Create trail particle occasionally
            if (Math.random() < 0.1) {
                this.createCursorParticle(e.clientX, e.clientY);
            }
        });

        // Magnetic effect on buttons
        document.querySelectorAll('a, button').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
    }

    // 9. Hover Animations
    setupHoverAnimations() {
        // Floating animation on icons
        document.querySelectorAll('i.fa').forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = 'wiggle 0.5s ease-in-out';
                }, 10);
            });
        });

        // Glow effect on hover
        document.querySelectorAll('.cute-badge, .support-dev-btn').forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(236, 72, 153, 0.4)';
            });
            
            badge.addEventListener('mouseleave', () => {
                badge.style.boxShadow = '';
            });
        });
    }

    // 10. Animation Loop
    startAnimationLoop() {
        const animate = () => {
            const time = Date.now() * 0.001;
            
            // Animate floating elements
            document.querySelectorAll('.sparkle, .cursor-particle').forEach(particle => {
                const life = parseFloat(particle.dataset.life || 0);
                if (life > 1) {
                    particle.remove();
                } else {
                    particle.dataset.life = life + 0.02;
                    particle.style.opacity = 1 - life;
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Helper Functions
    createRipple(event, element) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        
        const rect = element.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.background = 'rgba(139, 92, 246, 0.4)';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple 0.6s linear';
        circle.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(circle);
        
        setTimeout(() => circle.remove(), 600);
    }

    createSparkles(rect) {
        for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.position = 'fixed';
            sparkle.style.width = '6px';
            sparkle.style.height = '6px';
            sparkle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            sparkle.style.borderRadius = '50%';
            sparkle.style.left = rect.left + rect.width / 2 + 'px';
            sparkle.style.top = rect.top + rect.height / 2 + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            sparkle.dataset.life = '0';
            
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            sparkle.dataset.vx = vx;
            sparkle.dataset.vy = vy;
            
            document.body.appendChild(sparkle);
            
            const animateSparkle = () => {
                const life = parseFloat(sparkle.dataset.life);
                if (life > 1) {
                    sparkle.remove();
                    return;
                }
                
                sparkle.dataset.life = life + 0.02;
                const currentLeft = parseFloat(sparkle.style.left);
                const currentTop = parseFloat(sparkle.style.top);
                sparkle.style.left = (currentLeft + parseFloat(sparkle.dataset.vx) * 0.05) + 'px';
                sparkle.style.top = (currentTop + parseFloat(sparkle.dataset.vy) * 0.05) + 'px';
                sparkle.style.opacity = 1 - life;
                
                requestAnimationFrame(animateSparkle);
            };
            
            animateSparkle();
        }
    }

    createCursorParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(139, 92, 246, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.dataset.life = '0';
        
        document.body.appendChild(particle);
    }

    activateKonamiCode() {
        // Secret animation when Konami code is entered
        document.body.style.animation = 'rainbow 2s linear infinite';
        this.showNotification('🎮 Kode Konami Aktif! XI TJKT 1 Terbaik! 🎮', 'success');
        
        // Add floating hearts
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFloatingHeart();
            }, i * 100);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }

    showSecretMessage() {
        this.showNotification('🎉 Kamu menemukan Easter Egg! XI TJKT 1 Keren Abis! 🎉', 'success');
        this.createConfetti();
    }

    shakeElement(element) {
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    rainbowText(element) {
        const originalText = element.textContent;
        element.innerHTML = '';
        
        for (let char of originalText) {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animation = 'rainbow-text 2s linear infinite';
            span.style.animationDelay = `${Math.random() * 2}s`;
            element.appendChild(span);
        }
        
        setTimeout(() => {
            element.textContent = originalText;
        }, 3000);
    }

    createHeartExplosion(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '❤️';
                heart.style.position = 'fixed';
                heart.style.left = rect.left + rect.width / 2 + 'px';
                heart.style.top = rect.top + rect.height / 2 + 'px';
                heart.style.fontSize = '20px';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '9999';
                heart.dataset.life = '0';
                
                const angle = (Math.PI * 2 * i) / 8;
                heart.dataset.vx = Math.cos(angle) * 3;
                heart.dataset.vy = Math.sin(angle) * 3;
                
                document.body.appendChild(heart);
                
                const animateHeart = () => {
                    const life = parseFloat(heart.dataset.life);
                    if (life > 1) {
                        heart.remove();
                        return;
                    }
                    
                    heart.dataset.life = life + 0.02;
                    const currentLeft = parseFloat(heart.style.left);
                    const currentTop = parseFloat(heart.style.top);
                    heart.style.left = (currentLeft + parseFloat(heart.dataset.vx)) + 'px';
                    heart.style.top = (currentTop + parseFloat(heart.dataset.vy)) + 'px';
                    heart.style.opacity = 1 - life;
                    
                    requestAnimationFrame(animateHeart);
                };
                
                animateHeart();
            }, i * 50);
        }
    }

    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.textContent = '💜';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.bottom = '-50px';
        heart.style.fontSize = '30px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = 'float-up 3s linear';
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 3000);
    }

    createConfetti() {
        const colors = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-20px';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = 'confetti-fall 3s linear';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    showNotification(message, type = 'info') {
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
            animation: slide-down 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slide-up 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes rainbow-text {
        0% { color: #8B5CF6; }
        25% { color: #EC4899; }
        50% { color: #10B981; }
        75% { color: #3B82F6; }
        100% { color: #8B5CF6; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px) rotate(-5deg); }
        75% { transform: translateX(10px) rotate(5deg); }
    }
    
    @keyframes float-up {
        to {
            bottom: 100%;
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes confetti-fall {
        to {
            top: 100%;
            transform: translateY(100px) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes slide-down {
        from {
            top: -100px;
            opacity: 0;
        }
        to {
            top: 100px;
            opacity: 1;
        }
    }
    
    @keyframes slide-up {
        from {
            top: 100px;
            opacity: 1;
        }
        to {
            top: -100px;
            opacity: 0;
        }
    }
    
    @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }
`;
document.head.appendChild(animationStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});
