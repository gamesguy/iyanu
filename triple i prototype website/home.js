document.addEventListener('DOMContentLoaded', () => {
    const signInLink = document.querySelector('.sign-in-link');
    const userWelcome = document.querySelector('.user-welcome');
    const welcomeMessage = document.querySelector('.welcome-message');
    const logoutLink = document.querySelector('.logout-link');
    const productGrid = document.querySelector('.product-grid');

    // Function to update the UI based on user session
    function updateUserUI() {
        fetch('/user')
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    signInLink.style.display = 'none';
                    userWelcome.style.display = 'flex';
                    welcomeMessage.textContent = `Welcome, ${data.user.name}`;
                    logoutLink.style.display = 'inline';
                } else {
                    signInLink.style.display = 'inline';
                    userWelcome.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    }

    // Example function to filter products
    function filterProducts(category) {
        const allProducts = [...productGrid.children];
        allProducts.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Adding event listeners for category filtering
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const category = event.target.dataset.category;
            filterProducts(category);
        });
    });

    // Check user session on page load
    updateUserUI();
});
