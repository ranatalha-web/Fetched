import { idToImageUrlMap } from "../data.js";

// Function to get image URL by ID
function getImageUrlById(id) {
  return idToImageUrlMap[id] || "https://via.placeholder.com/300"; // Fallback to placeholder if ID is not found
}

// Function to fetch image details
async function fetchImages() {
  const loading = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const gallery = document.getElementById("gallery");

  try {
    loading.style.display = "block"; // Show loading message

    // Sample data simulating what you might fetch (this should be replaced with your data source)
    const images = [
      { id: "288675" },
      { id: "288676" },
      { id: "288677" },
      { id: "288678" },
      { id: "288679" },
      { id: "288681" },
      { id: "288682" },
      { id: "288683" },
      { id: "288684" },
      { id: "288685" },
      { id: "288686" },
      { id: "288687" },
      { id: "288688" },
      { id: "288689" },
      { id: "288690" },
      { id: "288691" },
      { id: "288723" },
      { id: "288724" },
      { id: "288726" },
      { id: "288977" },
      { id: "305055" },
      { id: "305069" },
      { id: "305327" },
      { id: "306032" },
      { id: "306543" },
      { id: "307143" },
      { id: "309909" },
      { id: "323227" },
      { id: "323229" },
      { id: "323258" },
      { id: "323261" },
    ];

    gallery.innerHTML = ""; // Clear previous content
    loading.style.display = "none"; // Hide loading message

    if (images.length === 0) {
      errorElement.textContent = "No images found.";
      errorElement.style.display = "block";
      return;
    }

    images.forEach((image) => {
      const container = document.createElement("div");
      container.className = "listing-card";

      // Create img element
      const img = document.createElement("img");
      img.alt = image.title || "No Title"; // Fallback if title is missing

      // Use the image URL from the map, or fallback to a placeholder
      img.src = getImageUrlById(image.id);
      img.className = "listing-image";

      // Create button container
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";

      const viewDetailsButton = document.createElement("button");
      viewDetailsButton.textContent = "View Details";
      viewDetailsButton.className = "view-details-btn";
      viewDetailsButton.onclick = () => {
        window.location.href = `details.html?id=${image.id}`; // Navigate to details page
      };

      const bookNowButton = document.createElement("button");
      bookNowButton.textContent = "Book Now";
      bookNowButton.className = "book-now-btn";
      bookNowButton.onclick = () => {
        openBookingModal(image.id); // Trigger the modal for booking
      };

      // Append both buttons to the container
      buttonContainer.appendChild(viewDetailsButton);
      buttonContainer.appendChild(bookNowButton);
      container.appendChild(img);
      container.appendChild(buttonContainer);
      gallery.appendChild(container);
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    errorElement.textContent = `Failed to load images: ${error.message}`;
    errorElement.style.display = "block";
    loading.style.display = "none"; // Hide loading message on error
  }
}

// Function to open the booking modal
function openBookingModal(imageId) {
  const modal = new bootstrap.Modal(document.getElementById("calendar-popup"));
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const guestsInput = document.getElementById("guests");

  // Set the modal inputs based on the image ID or other data
  // For now, you can pass additional information or keep it dynamic
  checkinInput.value = "";
  checkoutInput.value = "";
  guestsInput.value = 1;

  // Show the modal
  modal.show();

  // Initialize flatpickr for date fields only when modal is opened
  flatpickr(checkinInput, {
    dateFormat: "Y-m-d", // You can customize the format
  });

  flatpickr(checkoutInput, {
    dateFormat: "Y-m-d",
  });

  // Handle the Confirm Booking button
  const confirmBookingButton = document.querySelector(".btn-dark");
  confirmBookingButton.onclick = () => {
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const guests = guestsInput.value;

    if (!checkin || !checkout || !guests) {
      alert("Please fill in all the fields.");
      return;
    }

    // Process the booking (e.g., send data to a server or redirect)
    alert(`Booking confirmed for image ID ${imageId} with ${guests} guest(s).`);
    modal.hide(); // Close the modal after booking
  };
}

window.onload = fetchImages; // Fetch images when the window loads