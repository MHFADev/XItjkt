// EmailJS Integration - Free Email Service
// Setup: emailjs.com - gratis dan mudah digunakan

class EmailJSService {
    constructor() {
        // EmailJS Public Key - nanti akan diset
        this.publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // User perlu daftar di emailjs.com
        this.serviceId = 'YOUR_SERVICE_ID';
        this.templateId = 'YOUR_TEMPLATE_ID';
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Load EmailJS library
            if (!window.emailjs) {
                await this.loadEmailJS();
            }
            
            // Initialize EmailJS with public key
            if (this.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
                emailjs.init(this.publicKey);
                this.initialized = true;
                console.log('EmailJS initialized successfully');
            } else {
                console.warn('EmailJS: Please setup your API keys');
                this.setupDemoMode();
            }
        } catch (error) {
            console.error('EmailJS initialization failed:', error);
            this.setupDemoMode();
        }
    }

    loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupDemoMode() {
        // Demo mode - shows success message but doesn't actually send email
        this.initialized = true;
        console.log('EmailJS running in demo mode');
    }

    async sendEmail(formData) {
        if (!this.initialized) {
            throw new Error('EmailJS not initialized');
        }

        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: 'hilmimax109@gmail.com',
            reply_to: formData.email,
            subject: `Portfolio Feedback dari ${formData.name}`
        };

        try {
            // If running in demo mode (keys not set)
            if (this.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
                console.log('Demo Mode - Email would be sent with:', templateParams);
                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                return {
                    status: 200,
                    text: 'Demo: Email sent successfully'
                };
            }

            // Real EmailJS send
            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            console.log('Email sent successfully:', response);
            return response;

        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
}

// Enhanced Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.emailService = new EmailJSService();
        this.form = document.getElementById('contact-form');
        this.submitBtn = null;
        this.responseDiv = null;
        this.init();
    }

    init() {
        if (this.form) {
            this.submitBtn = this.form.querySelector('.form-submit');
            this.responseDiv = document.getElementById('form-response');
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.setupFormEnhancements();
        }
    }

    setupFormEnhancements() {
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearErrors.bind(this));
        });

        // Add character counter for message
        const messageField = this.form.querySelector('#message');
        if (messageField) {
            this.addCharacterCounter(messageField);
        }
    }

    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        
        // Remove previous error styling
        field.classList.remove('border-red-500', 'border-green-500');
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Field ini wajib diisi');
            return false;
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Format email tidak valid');
            return false;
        }
        
        // Show success styling
        field.classList.add('border-green-500');
        this.clearFieldError(field);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500');
        
        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-red-500 text-sm mt-1';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    clearErrors() {
        const errorDivs = this.form.querySelectorAll('.field-error');
        errorDivs.forEach(div => div.remove());
    }

    addCharacterCounter(textarea) {
        const counter = document.createElement('div');
        counter.className = 'text-sm text-gray-500 mt-1';
        counter.id = 'char-counter';
        textarea.parentNode.appendChild(counter);

        const updateCounter = () => {
            const length = textarea.value.length;
            const maxLength = 500;
            counter.textContent = `${length}/${maxLength} karakter`;
            
            if (length > maxLength * 0.9) {
                counter.className = 'text-sm text-yellow-500 mt-1';
            } else if (length > maxLength) {
                counter.className = 'text-sm text-red-500 mt-1';
            } else {
                counter.className = 'text-sm text-gray-500 mt-1';
            }
        };

        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    async handleSubmit(event) {
        event.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showResponse('error', 'Mohon perbaiki kesalahan pada form');
            return;
        }

        // Get form data
        const formData = {
            name: this.form.querySelector('#name').value.trim(),
            email: this.form.querySelector('#email').value.trim(),
            message: this.form.querySelector('#message').value.trim()
        };

        // Show loading state
        this.setLoadingState(true);

        try {
            // Send email via EmailJS
            await this.emailService.sendEmail(formData);

            // Show success message
            this.showResponse('success', '🎉 Pesan berhasil dikirim ke hilmimax109@gmail.com! Terima kasih atas feedback Anda.');
            
            // Reset form
            this.form.reset();
            this.clearErrors();
            
            // Clear character counter
            const counter = document.getElementById('char-counter');
            if (counter) {
                counter.textContent = '0/500 karakter';
                counter.className = 'text-sm text-gray-500 mt-1';
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showResponse('error', '❌ Gagal mengirim email. Silakan coba lagi nanti.');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        const submitText = this.submitBtn.querySelector('.submit-text');
        const submitLoader = this.submitBtn.querySelector('.submit-loader');

        if (loading) {
            submitText.style.opacity = '0';
            submitLoader.classList.remove('hidden');
            this.submitBtn.disabled = true;
            this.submitBtn.style.transform = 'scale(0.95)';
        } else {
            submitText.style.opacity = '1';
            submitLoader.classList.add('hidden');
            this.submitBtn.disabled = false;
            this.submitBtn.style.transform = 'scale(1)';
        }
    }

    showResponse(type, message) {
        if (!this.responseDiv) return;

        this.responseDiv.className = `mt-4 p-4 rounded-lg ${
            type === 'success' 
                ? 'bg-green-100 border border-green-300 text-green-800' 
                : 'bg-red-100 border border-red-300 text-red-800'
        }`;
        
        this.responseDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        this.responseDiv.classList.remove('hidden');

        // Auto hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                this.responseDiv.classList.add('hidden');
            }, 5000);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});