document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        const loginMessage = document.getElementById('loginMessage');
        if (data.status) {
            // Save adminToken to local storage
            localStorage.setItem('adminToken', data.data.adminToken);
            // Display success message
            loginMessage.textContent = data.message;
            loginMessage.style.color = 'green';
            // Redirect to the dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 7000);
        } else {
            // Display error message
            loginMessage.textContent = data.message;
            loginMessage.style.color = 'red';
            loginMessage.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.textContent = 'An error occurred. Please try again.';
        loginMessage.style.color = 'red';
        loginMessage.style.display = 'block';
    });
});
