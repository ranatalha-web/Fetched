import { idToImageUrlMap } from "./data.js";

async function fetchListingDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");

  const loadingContainer = document.getElementById("loading-container");
  const errorContainer = document.getElementById("error-container");
  const listingDetailsContainer = document.getElementById("listingDetails");
  const imageGalleryContainer = document.getElementById(
    "image-gallery-container"
  );

  // Reset display states
  loadingContainer.style.display = "block";
  errorContainer.style.display = "none";
  listingDetailsContainer.style.display = "none";
  imageGalleryContainer.style.display = "none";

  if (!listingId) {
    showError("No listing ID provided.");
    return;
  }

  try {
    const response = await fetch(`/api/listings/${listingId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch listing details");
    }

    const listing = await response.json();

    let priceUSD = "Not Available";
    let pricePKR = "Not Available";

    if (listing.price) {
      let priceInUSD = 0;

      if (typeof listing.price === "string") {
        priceInUSD = parseFloat(listing.price.replace(/[^\d.-]/g, ""));
      } else if (typeof listing.price === "number") {
        priceInUSD = listing.price;
      }

      if (!isNaN(priceInUSD)) {
        priceUSD = `$${priceInUSD}`;
        pricePKR = (priceInUSD * 278.49).toFixed(2).toLocaleString();
      }
    }

    const numberOfBeds = listing.beds || "Not Available";
    const numberOfGuests = listing.guests || "Not Available";

    listingDetailsContainer.innerHTML = `
            <div class="listing-content">
              <img src="${
                idToImageUrlMap[listingId] || "https://via.placeholder.com/250"
              }" 
                   class="listing-image" alt="Listing Image" />
              <h2>${listing.name || "N/A"}</h2>
              <div class="icons">
                <span><i class="fa-solid fa-house house-icon"></i> Home</span>
                <span><i class="fa-solid fa-bed bed-icon"></i> ${numberOfBeds} Beds</span>
                <span><i class="fa-solid fa-user guest-icon"></i> ${numberOfGuests} Guests</span>
              </div>
              <p><span class="detail-label">Description:</span> <span class="detail-content description">${
                listing.description || "No description available"
              }</span></p>
              <p><span class="detail-label">House Rules:</span> <span class="detail-content house-rules">${
                listing.houseRules || "No specific house rules"
              }</span></p>
              <p><span class="detail-label">Address:</span> <span class="detail-content address">${
                listing.address || "Address not provided"
              }</span></p>
              <p><span class="detail-label">Price:</span> <span class="detail-content">USD: ${priceUSD} Or PKR: ${pricePKR}</span></p>
            </div>
          `;

    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = image.url || "https://via.placeholder.com/250";
        imgElement.alt = image.caption || "Listing Image";
        imageGalleryContainer.appendChild(imgElement);
      });
      imageGalleryContainer.style.display = "grid";
    }

    listingDetailsContainer.style.display = "block";
    loadingContainer.style.display = "none";
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  const loadingContainer = document.getElementById("loading-container");
  const errorContainer = document.getElementById("error-container");

  loadingContainer.style.display = "none";
  errorContainer.style.display = "block";
  errorContainer.textContent = message;
}

fetchListingDetails();
