document.addEventListener('DOMContentLoaded', function() {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        const adminInfo = parseJwt(adminToken);
        document.getElementById('adminName').textContent = adminInfo.userName;

        // Fetch reports from the API
        fetchReports(adminToken);
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

function fetchReports(token) {
    fetch('http://localhost:3000/admin/reports', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            displayReports(data.reports);
        } else {
            displayAlert('Error loading reports', 'error');
        }
    })
    .catch(error => {
        console.error('Error fetching reports:', error);
        displayAlert('Error fetching reports', 'error');
    });
}

function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = '';
    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        reportCard.setAttribute('data-report-id', report._id); // Store report ID

        const reportDetails = `
            <img src="${report.reportImage?.secure_url}" alt="Report Image" class="report-image">
            <h3>${report.subject}</h3>
            <p>${report.message}</p>
            <p>Name: ${report.name}</p>
            <p>Email: ${report.email}</p>
            <p>Contact Number: ${report.contactNumber}</p>
            <p>Created At: ${new Date(report.createdAt).toLocaleString()}</p>
        `;

        reportCard.innerHTML = reportDetails;
        reportsList.appendChild(reportCard);

        // Add click event listener to each report card
        reportCard.addEventListener('click', function() {
            const reportId = report._id;
            redirectToReportDetails(reportId);
        });
    });
}

function redirectToReportDetails(reportId) {
    window.location.href = `reportDetails.html?reportId=${reportId}`;
}

function displayAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}
