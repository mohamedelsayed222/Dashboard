document.addEventListener('DOMContentLoaded', function() {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        const adminInfo = parseJwt(adminToken);
        document.getElementById('adminName').textContent = adminInfo.userName;

        // Fetch properties from the API
        fetchProperties(adminToken);
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

function fetchProperties(token) {
    fetch('http://localhost:3000/admin/properties', {
        method: 'GET',
        headers: {
            'Authorization': ` ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            displayProperties(data.properties);
        } else {
            document.getElementById('propertiesList').textContent = 'Error loading properties';
        }
    })
    .catch(error => {
        console.error('Error fetching properties:', error);
        document.getElementById('propertiesList').textContent = 'Error';
    });
}

// function displayProperties(properties) {
//     const propertiesList = document.getElementById('propertiesList');
//     propertiesList.innerHTML = '';
//     properties.forEach(property => {
//         const propertyCard = document.createElement('div');
//         propertyCard.className = 'property-card';

//         const propertyImages = property.propertyImages.map(img => `<img src="${img.secure_url}" alt="Property Image">`).join('');
//         const propertyDetails = `
//             <h3>${property.description}</h3>
//             <p>Type: ${property.type}</p>
//             <p>Price: ${property.price} ${property.per}</p>
//             <p>Bedrooms: ${property.bedrooms}</p>
//             <p>Bathrooms: ${property.bathrooms}</p>
//         `;

//         propertyCard.innerHTML = propertyImages + propertyDetails;
//         propertiesList.appendChild(propertyCard);
//     });
// }


function displayProperties(properties) {
    const propertiesList = document.getElementById('propertiesList');
    propertiesList.innerHTML = '';
    properties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';

        const propertyImages = property.propertyImages.map(img => `<img src="${img.secure_url}" alt="Property Image">`).join('');

        const sliderHtml = `
            <div class="slider">
                <div class="slides">
                    ${propertyImages}
                </div>
                <button class="prev">&#10094;</button>
                <button class="next">&#10095;</button>
            </div>
        `;

        const propertyDetails = `
            <div class="property-details">
                <h3>${property.description}</h3>
                <p>Type: ${property.type}</p>
                <p>Price: ${property.price} ${property.per}</p>
                <p>Bedrooms: ${property.bedrooms}</p>
                <p>Bathrooms: ${property.bathrooms}</p>
                <p>Added By: ${property.addedBy.name}</p>
                <p>Status: ${property.propertyStatus}</p>
                <p>Address: ${property.address}</p>
            </div>
        `;

        propertyCard.innerHTML = sliderHtml + propertyDetails;
        propertiesList.appendChild(propertyCard);

        // Toggle details visibility on click
        propertyCard.addEventListener('click', () => {
            propertyCard.classList.toggle('active');
        });

        // Image Slider functionality
        const slides = propertyCard.querySelector('.slides');
        const prevBtn = propertyCard.querySelector('.prev');
        const nextBtn = propertyCard.querySelector('.next');
        let slideIndex = 0;

        function showSlides(index) {
            if (index < 0) {
                slideIndex = slides.children.length - 1;
            } else if (index >= slides.children.length) {
                slideIndex = 0;
            }
            slides.style.transform = `translateX(-${slideIndex * 100}%)`;
        }

        prevBtn.addEventListener('click', () => {
            slideIndex--;
            showSlides(slideIndex);
        });

        nextBtn.addEventListener('click', () => {
            slideIndex++;
            showSlides(slideIndex);
        });
    });
}
