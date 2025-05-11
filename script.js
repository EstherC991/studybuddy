document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.querySelector('.login');
    const registerBtn = document.querySelector('.register');
    const socialBtns = document.querySelectorAll('.social-btn');
    const inputs = document.querySelectorAll('input');

    // UCNJ Colors
    const colors = {
        primary: '#9E1B32',
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };

    // Simple password toggle
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();

        if (validateForm()) {
            try {
                // Show loading state
                loginBtn.disabled = true;
                const originalText = loginBtn.innerHTML;
                loginBtn.innerHTML = `
                    <i class="fas fa-circle-notch fa-spin"></i>
                    <span>Logging in...</span>
                `;

                await simulateLogin();
                
                // Show success
                showNotification('Login successful!', 'success');
                loginBtn.innerHTML = `
                    <i class="fas fa-check"></i>
                    <span>Success!</span>
                `;
                
                setTimeout(() => {
                    window.location.href = 'home.html';
            }, 1500); // redirect to home page after successfull login

            } catch (error) {
                showNotification('Login failed. Please try again.', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Login';
            }
        }
    });

    // method to do form validation
    function validateForm() {
        let isValid = true;

        // Username validation
        if (!usernameInput.value.trim()) {
            showError(usernameInput, 'Username is required');
            isValid = false;
        } else if (usernameInput.value.length < 3) {
            showError(usernameInput, 'Username must be at least 3 characters');
            isValid = false;
        }

        // Password validation
        const passwordResult = validatePassword(passwordInput.value);
        if (!passwordResult.isValid) {
            showError(passwordInput, passwordResult.errors.join('\n'));
            isValid = false;
        }

        return isValid;
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
        const field = input.parentElement.parentElement; // Get the input-group
        const errorContainer = field.querySelector('.error-container');
        
        // Clear existing error first
        clearError(input);
        
        field.classList.add('error');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = 'red'; // Show the error message in red color
        errorContainer.appendChild(error);
    }

    function clearError(input) {
        const field = input.parentElement.parentElement; // Get the input-group
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

    // Enhanced notification system
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

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Simulate login
    function simulateLogin() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.1 ? resolve() : reject();
            }, 1500);
        });
    }

    // Register button handler
registerBtn.addEventListener('click', () => {
    window.location.href = 'register.html';

    });

    // Social login handlers
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`${platform} login coming soon!`, 'info');
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
