document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const majorInput = document.getElementById('major');
    const yearInput = document.getElementById('year');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const inputs = document.querySelectorAll('input');

    // UCNJ Colors
    const colors = {
        primary: '#9E1B32',
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };

    // Password toggle functionality
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    toggleConfirmPassword.addEventListener('click', () => {
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
        toggleConfirmPassword.classList.toggle('fa-eye');
        toggleConfirmPassword.classList.toggle('fa-eye-slash');
    });

    // Form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();

        if (validateForm()) {
            try {
                // Show loading state
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `
                    <i class="fas fa-circle-notch fa-spin"></i>
                    <span>Registering...</span>
                `;

                await simulateRegistration();
                
                // Show success
                showNotification('Registration successful!', 'success');
                submitBtn.innerHTML = `
                    <i class="fas fa-check"></i>
                    <span>Success!</span>
                `;
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    // Redirect to login page after successful registration
                    window.location.href = 'file.html';
                }, 2000);

            } catch (error) {
                showNotification('Registration failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Register';
            }
        }
    });

    // Form validation
    function validateForm() {
        let isValid = true;

        // Name validation
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else if (nameInput.value.length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        const passwordResult = validatePassword(passwordInput.value);
        if (!passwordResult.isValid) {
            showError(passwordInput, passwordResult.errors.join('\n'));
            isValid = false;
        }

        // Confirm Password validation
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        }

        // Major validation
        if (!majorInput.value.trim()) {
            showError(majorInput, 'Major is required');
            isValid = false;
        }

        // Year validation
        if (!yearInput.value.trim()) {
            showError(yearInput, 'Year is required');
            isValid = false;
        } else if (!isValidYear(yearInput.value)) {
            showError(yearInput, 'Please enter a valid year (1-4)');
            isValid = false;
        }

        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Year validation helper
    function isValidYear(year) {
        const yearNum = parseInt(year);
        return !isNaN(yearNum) && yearNum >= 1 && yearNum <= 4;
    }

    // Password validation function
    function validatePassword(password) {
        const requirements = {
            minLength: 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const errors = [];
        
        if (password.length < requirements.minLength) {
            errors.push(`Password must be at least ${requirements.minLength} characters`);
        }
        if (!requirements.hasUpperCase) {
            errors.push('Enter one uppercase letter');
        }
        if (!requirements.hasLowerCase) {
            errors.push('Enter one lowercase letter');
        }
        if (!requirements.hasNumbers) {
            errors.push('Enter one number');
        }
        if (!requirements.hasSpecialChar) {
            errors.push('Enter at least one special character');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Error handling
    function showError(input, message) {
        const field = input.parentElement.parentElement;
        const errorContainer = field.querySelector('.error-container');
        
        clearError(input);
        
        field.classList.add('error');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        errorContainer.appendChild(error);
    }

    function clearError(input) {
        const field = input.parentElement.parentElement;
        const errorContainer = field.querySelector('.error-container');
        field.classList.remove('error');
        if (errorContainer) {
            errorContainer.innerHTML = '';
        }
    }

    function clearAllErrors() {
        inputs.forEach(input => clearError(input));
    }

    // Input field handlers
    inputs.forEach(input => {
        const field = input.parentElement;

        input.addEventListener('focus', () => {
            field.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            field.classList.remove('focused');
        });

        input.addEventListener('input', () => {
            clearError(input);
        });
    });

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        const backgroundColor = type === 'success' ? colors.success : 
                              type === 'error' ? colors.error : 
                              type === 'info' ? colors.info : colors.primary;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '10px',
            color: 'white',
            backgroundColor,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Simulate registration
    function simulateRegistration() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.1 ? resolve() : reject();
            }, 1500);
        });
    }

    // Social login handlers
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`${platform} registration coming soon!`, 'info');
        });
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn, .social-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
});

