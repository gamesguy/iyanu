document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    console.log('Login form submitted');

    const email = event.target.email.value;
    const password = event.target.password.value;

    // Debugging: Print the email and password to the console
    console.log('Email entered:', email);
    console.log('Password entered:', password);

    try {
        const response = await fetch('/login-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Debugging: Check if the fetch request was made
        console.log('Request sent to /login-user');

        const result = await response.json();

        // Debugging: Check the response status and result
        console.log('Response status:', response.status);
        console.log('Response result:', result);

        if (result.success) {
            console.log('Login successful, redirecting to /welcome');
            window.location.href = '/welcome';
        } else {
            console.log('Login failed:', result.message);
            alert(result.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});
