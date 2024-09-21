document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/register-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const result = await response.json();
                if (result.success) {
                    window.location.href = '/welcome'; // Redirect to welcome page
                } else {
                    alert(result.message || 'Registration failed'); // Show error message
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.'); // Show generic error
            }
        });
    }
});
