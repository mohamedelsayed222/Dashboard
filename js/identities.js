document.addEventListener('DOMContentLoaded', function() {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        const adminInfo = parseJwt(adminToken);
        document.getElementById('adminName').textContent = adminInfo.userName;

        // Fetch identities from the API
        fetchIdentities(adminToken);
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

function fetchIdentities(token) {
    fetch('http://localhost:3000/admin/identities', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            displayIdentities(data.identities);
        } else {
            document.getElementById('identitiesList').textContent = 'Error loading identities';
        }
    })
    .catch(error => {
        console.error('Error fetching identities:', error);
        document.getElementById('identitiesList').textContent = 'Error';
    });
}

function displayIdentities(identities) {
    const identitiesList = document.getElementById('identitiesList');
    identitiesList.innerHTML = '';
    identities.forEach(identity => {
        const identityCard = createIdentityCard(identity);
        identitiesList.appendChild(identityCard);
    });
}

function createIdentityCard(identity) {
    const identityCard = document.createElement('div');
    identityCard.className = 'identity-card';

    const identityImages = identity.identityImages.map(img => `<img src="${img.secure_url}" alt="Identity Image">`).join('');
    const userInfo = `
        <div class="user-info">
            <p>Name: ${identity.userId.name}</p>
            <p>Email: ${identity.userId.email}</p>
            <p>Phone Number: ${identity.phoneNumberVerification.phoneNumber}</p>
        </div>
    `;
    const verificationButtons = `
        <div class="verification-buttons">
            <button class="verify-btn" onclick="verifyIdentity('${identity._id}')">Verify</button>
            <button class="reject-btn" onclick="rejectIdentity('${identity._id}')">Reject</button>
        </div>
    `;

    identityCard.innerHTML = identityImages + userInfo + verificationButtons;
    return identityCard;
}

// function verifyIdentity(identityId) {
//     const apiUrl = `http://localhost:3000/admin/checkIdentity/${identityId}`;

//     fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//             'Authorization': `${localStorage.getItem('adminToken')}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: 'verified' })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Identity verified:', data);
//         // Optionally update UI or notify user
//     })
//     .catch(error => {
//         console.error('Error verifying identity:', error);
//     });
// }

// function rejectIdentity(identityId) {
//     const apiUrl = `http://localhost:3000/admin/checkIdentity/${identityId}`;

//     fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//             'Authorization': `${localStorage.getItem('adminToken')}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: 'rejected' })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Identity rejected:', data);
//         // Optionally update UI or notify user
//     })
//     .catch(error => {
//         console.error('Error rejecting identity:', error);
//     });
// }


function verifyIdentity(identityId) {
    const apiUrl = `http://localhost:3000/admin/checkIdentity/${identityId}`;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'verified' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            showAlert('success', data.message);
        } else {
            showAlert('error', data.message);
        }
    })
    .catch(error => {
        console.error('Error verifying identity:', error);
        showAlert('error', 'An error occurred while verifying the identity');
    });
}

function rejectIdentity(identityId) {
    const apiUrl = `http://localhost:3000/admin/checkIdentity/${identityId}`;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            showAlert('success', data.message);
        } else {
            showAlert('error', data.message);
        }
    })
    .catch(error => {
        console.error('Error rejecting identity:', error);
        showAlert('error', 'An error occurred while rejecting the identity');
    });
}

function showAlert(type, message) {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}