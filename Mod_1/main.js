// 1. JavaScript Basics & Setup
console.log("Welcome to the Community Portal");
window.addEventListener('load', function() {
    alert("Page fully loaded. Welcome to our Community Portal!");
});

// 2. Event Data Management
const events = [
    { id: 1, name: "Summer Festival", date: "2023-07-15", seats: 100, category: "festival", fee: 5 },
    { id: 2, name: "Art Workshop", date: "2023-06-10", seats: 15, category: "workshop", fee: 15 },
    { id: 3, name: "Local Band Night", date: "2023-08-20", seats: 50, category: "concert", fee: 20 },
    { id: 4, name: "Sports Day", date: "2023-05-01", seats: 0, category: "sports", fee: 10 }
];

// 3. DOM Manipulation - Render Events
function renderEvents() {
    const container = document.getElementById('eventContainer');
    container.innerHTML = '';
    
    const today = new Date().toISOString().split('T')[0];
    const validEvents = events.filter(event => event.date >= today);
    
    validEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'col-md-6 col-lg-4 mb-4';
        
        const cardClass = event.seats > 0 ? 'event-card card h-100' : 'event-card card h-100 bg-light';
        
        eventCard.innerHTML = `
            <div class="${cardClass}">
                <img src="https://via.placeholder.com/300x200?text=${encodeURIComponent(event.name)}" 
                     class="card-img-top" alt="${event.name}">
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">
                        <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}<br>
                        <strong>Seats:</strong> ${event.seats > 0 ? event.seats : 'Sold Out'}<br>
                        <strong>Category:</strong> ${event.category}<br>
                        <strong>Fee:</strong> $${event.fee}
                    </p>
                </div>
                <div class="card-footer bg-transparent">
                    ${event.seats > 0 ? 
                        `<button class="btn btn-primary btn-sm register-btn" data-id="${event.id}">Register</button>` : 
                        '<span class="text-danger">Event Full</span>'}
                </div>
            </div>
        `;
        
        container.appendChild(eventCard);
    });
    
    // Add event listeners to register buttons
    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-id'));
            const event = events.find(e => e.id === eventId);
            
            if (event && event.seats > 0) {
                event.seats--;
                renderEvents();
                alert(`Successfully registered for ${event.name}`);
                
                // Pre-select this event type in the form
                document.getElementById('eventType').value = event.category;
                showEventFee(document.getElementById('eventType'));
            }
        });
    });
}

// 4. Form Handling
function validatePhone(input) {
    const phoneRegex = /^\d{10}$/;
    if (input.value && !phoneRegex.test(input.value)) {
        input.classList.add('is-invalid');
        input.nextElementSibling.textContent = 'Please enter a valid 10-digit phone number';
    } else {
        input.classList.remove('is-invalid');
    }
}

function showEventFee(select) {
    const fees = {
        workshop: '$15',
        festival: '$5',
        sports: '$10',
        concert: '$20'
    };
    
    const feeInput = document.getElementById('fee');
    feeInput.value = select.value ? fees[select.value] || 'Free' : '';
}

function countChars(textarea) {
    const charCount = document.getElementById('charCount');
    const remaining = 200 - textarea.value.length;
    charCount.textContent = `${textarea.value.length}/200 characters (${remaining} remaining)`;
    charCount.className = remaining < 0 ? 'form-text text-danger' : 'form-text';
}

function submitForm(event) {
    const form = document.getElementById('registrationForm');
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    
    // Form is valid, process registration
    event.preventDefault();
    const name = document.getElementById('name').value;
    const eventType = document.getElementById('eventType').value;
    
    document.getElementById('formOutput').textContent = 
        `Thank you, ${name}! Your registration for ${eventType} has been received.`;
    
    // Save preference to localStorage
    localStorage.setItem('preferredEventType', eventType);
    
    form.classList.remove('was-validated');
    form.reset();
}

// 5. User Preferences with localStorage
function loadPreferences() {
    const preferredEventType = localStorage.getItem('preferredEventType');
    if (preferredEventType) {
        document.getElementById('eventType').value = preferredEventType;
        showEventFee(document.getElementById('eventType'));
    }
}

function clearPreferences() {
    localStorage.removeItem('preferredEventType');
    sessionStorage.clear();
    alert('Your preferences have been cleared.');
    document.getElementById('eventType').value = '';
    document.getElementById('fee').value = '';
}

// 6. Image Gallery
function enlargeImage(img) {
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    document.getElementById('modalImage').src = img.src;
    document.querySelector('.modal-title').textContent = img.title;
    modal.show();
}

// 7. Video Handling
function videoReady() {
    document.getElementById('videoStatus').textContent = "Video ready to play!";
}

// 8. Geolocation
document.getElementById('findEventsBtn').addEventListener('click', function() {
    if (!navigator.geolocation) {
        document.getElementById('locationResult').innerHTML = 
            '<div class="alert alert-warning">Geolocation is not supported by your browser</div>';
        return;
    }
    
    document.getElementById('locationResult').innerHTML = 
        '<div class="spinner-border text-primary"></div> Finding nearby events...';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Simulate finding nearby events
            setTimeout(() => {
                const nearbyEvents = events.filter(event => event.seats > 0).slice(0, 2);
                let html = '<div class="alert alert-success">Found events near your location</div>';
                
                if (nearbyEvents.length > 0) {
                    html += '<ul class="list-group">';
                    nearbyEvents.forEach(event => {
                        html += `<li class="list-group-item">
                            <strong>${event.name}</strong> - ${new Date(event.date).toLocaleDateString()}
                            <button class="btn btn-sm btn-outline-primary float-end" 
                                    onclick="document.getElementById('eventType').value='${event.category}';showEventFee(document.getElementById('eventType'));document.getElementById('registration').scrollIntoView()">
                                Register
                            </button>
                        </li>`;
                    });
                    html += '</ul>';
                } else {
                    html = '<div class="alert alert-info">No upcoming events found near your location</div>';
                }
                
                document.getElementById('locationResult').innerHTML = html;
            }, 1500);
        },
        function(error) {
            let message = "Error getting your location: ";
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message += "You denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message += "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    message += "The request to get your location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    message += "An unknown error occurred.";
                    break;
            }
            document.getElementById('locationResult').innerHTML = 
                `<div class="alert alert-danger">${message}</div>`;
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
});

// 9. Page Unload Warning
window.addEventListener('beforeunload', function(e) {
    const form = document.getElementById('registrationForm');
    const inputs = Array.from(form.elements).filter(el => el.value && el.type !== 'submit');
    
    if (inputs.length > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved form data. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// 10. Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderEvents();
    loadPreferences();
    
    // Setup form submission
    document.getElementById('registrationForm').addEventListener('submit', submitForm);
    
    // Setup feedback form
    document.getElementById('feedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your feedback!');
        this.reset();
    });
    
    // Log form elements for debugging
    console.log('Form elements:', document.getElementById('registrationForm').elements);
});