import { idToImageUrlMap } from './data.js';  // Correct path assuming data.js is in the same directory

// Array of image IDs
const images = [
    { id: '288678' },
    { id: '288723' },
    { id: '288726' }
];

const galleryContainer = document.getElementById('image-gallery');

// Loop through images and dynamically create image gallery
images.forEach((image) => {
    const imageUrl = idToImageUrlMap[image.id];
    if (imageUrl) {
        const colDiv = document.createElement('div');
        colDiv.classList.add('col-md-4');
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Room Image ${image.id}`;
        img.classList.add('img-fluid', 'mb-4');
        
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('d-flex', 'justify-content-between');
        
        const viewDetailBtn = document.createElement('a');
        viewDetailBtn.classList.add('btn', 'btn-md', 'rounded', 'py-2', 'px-4');
        viewDetailBtn.style.backgroundColor = '#989549';
        viewDetailBtn.href = '#';
        viewDetailBtn.textContent = 'View Detail';
        
        const bookNowBtn = document.createElement('a');
        bookNowBtn.classList.add('btn', 'btn-md', 'btn-dark', 'rounded', 'py-2', 'px-4');
        bookNowBtn.href = '#';
        bookNowBtn.textContent = 'Book Now';
        bookNowBtn.addEventListener('click', () => openBookingModal(image.id));
        
        btnContainer.appendChild(viewDetailBtn);
        btnContainer.appendChild(bookNowBtn);
        
        colDiv.appendChild(img);
        colDiv.appendChild(btnContainer);
        galleryContainer.appendChild(colDiv);
    }
});

// Function to open the booking modal
function openBookingModal(imageId) {
    const modal = new bootstrap.Modal(document.getElementById('calendar-popup'));
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const guestsInput = document.getElementById('guests');
    
    checkinInput.value = '';
    checkoutInput.value = '';
    guestsInput.value = 1;
    
    modal.show();

    flatpickr(checkinInput, {
        dateFormat: 'Y-m-d',
    });

    flatpickr(checkoutInput, {
        dateFormat: 'Y-m-d',
    });

    const confirmBookingButton = document.getElementById('confirm-booking');
    confirmBookingButton.onclick = () => {
        const checkin = checkinInput.value;
        const checkout = checkoutInput.value;
        const guests = guestsInput.value;

        if (!checkin || !checkout || !guests) {
            alert('Please fill in all the fields.');
            return;
        }

        alert(`Booking confirmed for image ID ${imageId} with ${guests} guest(s).`);
        modal.hide();
    };
}
