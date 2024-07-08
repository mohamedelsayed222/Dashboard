document.addEventListener('DOMContentLoaded', function() {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        const reportId = getReportIdFromURL();
        fetchReportDetails(adminToken, reportId);
    } else {
        window.location.href = 'login.html';
    }
});

function getReportIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('reportId');
}

function fetchReportDetails(token, reportId) {
    fetch(`http://localhost:3000/admin/reports/${reportId}`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            displayReportDetails(data.report);
            setupResponseForm(reportId);
        } else {
            showAlert('Error loading report details');
        }
    })
    .catch(error => {
        console.error('Error fetching report details:', error);
        showAlert('Error fetching report details');
    });
}

function displayReportDetails(report) {
    const reportContent = document.getElementById('reportContent');
    reportContent.innerHTML = `
        <img src="${report.reportImage?.secure_url}" alt="Report Image">
        <h3>${report.subject}</h3>
        <p>${report.message}</p>
        <p>Name: ${report.name}</p>
        <p>Email: ${report.email}</p>
        <p>Contact Number: ${report.contactNumber}</p>
    `;
}

function setupResponseForm(reportId) {
    const responseForm = document.getElementById('responseForm');
    responseForm.onsubmit = function(event) {
        event.preventDefault();
        sendResponse(reportId);
    };
}

function sendResponse(reportId) {
    const responseMessage = document.getElementById('responseMessage').value;
    fetch(`http://localhost:3000/admin/respond/${reportId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: responseMessage })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            showAlert('Response sent successfully', 'success');
        } else {
            showAlert('Error sending response');
        }
    })
    .catch(error => {
        console.error('Error sending response:', error);
        showAlert('Error sending response');
    });
}

function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}
