// welcome.js
document.addEventListener('DOMContentLoaded', () => {
    const userWelcomeElement = document.getElementById('user-welcome');

    async function fetchUserInfo() {
        try {
            const response = await fetch('/get-user-info');
            const data = await response.json();

            if (data.username) {
                userWelcomeElement.textContent = `Welcome, ${data.username}`;
            } else {
                window.location.href = '/'; // Redirect to home if no username is found
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            window.location.href = '/'; // Redirect to home on error
        }
    }

    fetchUserInfo();
});
