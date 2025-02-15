// Authentication Handler
class AuthManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.errorMessage = document.getElementById('errorMessage');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Clear error message when user starts typing
        this.form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                this.errorMessage.style.display = 'none';
            });
        });
    }

    async handleLogin() {
        const email = this.form.querySelector('#email').value;
        const password = this.form.querySelector('#password').value;

        try {
            if (config.USE_MOCK_DATA) {
                // Mock authentication for testing
                if (email === 'admin@manomedia.com' && password === 'admin123') {
                    const mockUser = {
                        email: email,
                        role: 'admin',
                        id: '1'
                    };
                    this.handleSuccessfulLogin(mockUser);
                } else {
                    throw new Error('Invalid email or password');
                }
            } else {
                // Real Firebase authentication
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Get user role from Supabase
                // const { data, error } = await supabaseClient
                //     .from('users')
                //     .select('role')
                //     .eq('email', user.email)
                //     .single();
                
                // if (error) throw error;
                
                this.handleSuccessfulLogin({
                    email: user.email,
                    role: 'admin', // Replace with data.role in production
                    id: user.uid
                });
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    handleSuccessfulLogin(user) {
        // Store user session
        sessionStorage.setItem('userSession', JSON.stringify({
            email: user.email,
            role: user.role,
            id: user.id,
            loginTime: new Date().toISOString()
        }));

        // Redirect to dashboard
        window.location.href = 'pages/dashboard.html';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }
}

// Initialize AuthManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
