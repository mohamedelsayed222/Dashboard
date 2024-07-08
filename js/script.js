document.addEventListener('DOMContentLoaded', function() {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        const adminInfo = parseJwt(adminToken);
        document.getElementById('adminName').textContent = adminInfo.userName;

        // Fetch counts from the API
        fetchCounts(adminToken);
    } else {
        window.location.href = 'login.html';
    }
});

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function fetchCounts(token) {
    fetch('http://localhost:3000/admin/counts', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            document.getElementById('usersCount').textContent = data.users;
            document.getElementById('propertiesCount').textContent = data.properties;
            document.getElementById('servicesCount').textContent = data.services;
        }
    })
    .catch(error => {
        console.error('Error fetching counts:', error);
        document.getElementById('usersCount').textContent = 'Error';
        document.getElementById('propertiesCount').textContent = 'Error';
        document.getElementById('servicesCount').textContent = 'Error';
    });
}
