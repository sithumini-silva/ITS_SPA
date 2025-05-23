document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');

    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        passwordIcon.classList.toggle('bi-eye-fill');
        passwordIcon.classList.toggle('bi-eye-slash-fill');
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Show loading state
        loginText.textContent = 'Authenticating...';
        loginSpinner.classList.remove('d-none');
        loginBtn.disabled = true;

        // Simulate authentication (replace with actual API call)
        setTimeout(() => {
            // This is just a demo - replace with real authentication
            if (username === 'sithu' && password === '123') {
                // Successful login
                showAlert('success', 'Login successful! Redirecting...');

                // Redirect to dashboard after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                // Failed login
                showAlert('danger', 'Invalid username or password');
                loginText.textContent = 'Login';
                loginSpinner.classList.add('d-none');
                loginBtn.disabled = false;
            }
        }, 1500);
    });

    // Contact admin link
    document.getElementById('contactAdmin').addEventListener('click', function(e) {
        e.preventDefault();
        showAlert('info', 'Please contact your system administrator to create an account.');
    });

    // Show alert function
    function showAlert(type, message) {
        // Remove any existing alerts first
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.querySelector('.login-body').appendChild(alertDiv);
    }
});