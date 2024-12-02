import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { idToImageUrlMap } from "./public/data.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HostawayListingManager {
  constructor() {
    this.app = express();
    this.apiBaseUrl =
      process.env.HOSTAWAY_API_URL || "https://api.example.com/listings";
    this.authToken = process.env.AUTHORIZATION_TOKEN || "default-token";
    this.port = process.env.PORT || 3000;
    this.images = [];
    this.listings = [];

    // Middleware
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, "public")));

    // Routes
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.get("/images", (req, res) => this.getImages(req, res));
    this.app.get("/api/listings", (req, res) => this.getAllListings(req, res));
    this.app.get("/api/listings/:id", (req, res) =>
      this.getListingById(req, res)
    );
    this.app.get("/api/listings/:id/images", (req, res) =>
      this.getListingImagesById(req, res)
    );
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });
    this.app.get("/details.html", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "details.html"));
    });
  }

  async fetchData(type = "images") {
    try {
      const response = await axios.get(this.apiBaseUrl, {
        headers: {
          Authorization: this.authToken,
          "Content-Type": "application/json",
        },
      });

      return typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;
    } catch (error) {
      console.error(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Fetch Error:`,
        error.message
      );
      throw new Error(`Failed to fetch ${type}`);
    }
  }

  extractImages(data) {
    if (data?.status === "success" && Array.isArray(data.result)) {
      return data.result
        .map((listing) => {
          const imageUrl = this.extractListingImage(listing);
          return {
            id: listing.id || Date.now(),
            url: imageUrl || idToImageUrlMap[listing.id],
            title: listing.name || "Untitled Listing",
          };
        })
        .filter((image) => image.url);
    }
    return this.getFallbackImages();
  }

  extractListings(data) {
    if (data?.status === "success" && Array.isArray(data.result)) {
      return data.result.map((listing) => ({
        id: listing.id || Date.now().toString(),
        name: listing.name || "Unnamed Listing",
        description: listing.description || "No description available",
        address: listing.address || "Address not provided",
        price: listing.price || "Price not provided",
        houseRules: listing.houseRules || "No specific house rules",
        imageUrl: idToImageUrlMap[listing.id] || null,
      }));
    }
    return [];
  }

  extractListingImage(listing) {
    const imageFields = ["imageUrl", "photo", "thumbnailUrl", "coverImageUrl"];
    for (const field of imageFields) {
      if (listing[field]) return listing[field];
    }
    const arrayFields = ["images", "photos", "gallery"];
    for (const field of arrayFields) {
      if (Array.isArray(listing[field]) && listing[field].length > 0) {
        const firstImage = listing[field][0];
        return typeof firstImage === "string"
          ? firstImage
          : firstImage.url || null;
      }
    }
    return null;
  }

  async getImages(req, res) {
    try {
      const data = await this.fetchData("images");
      this.images = this.extractImages(data);
      res.json(this.images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllListings(req, res) {
    try {
      const data = await this.fetchData("listings");
      this.listings = this.extractListings(data);
      res.json(this.listings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListingById(req, res) {
    const { id } = req.params;
    try {
      if (!this.listings.length) {
        const data = await this.fetchData("listings");
        this.listings = this.extractListings(data);
      }
      const listing = this.listings.find((l) => l.id.toString() === id);
      if (listing) {
        listing.imageUrl =
          listing.imageUrl ||
          idToImageUrlMap[listing.id] ||
          "https://via.placeholder.com/250";
        res.json(listing);
      } else {
        res.status(404).json({ error: "Listing not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListingImagesById(req, res) {
    const { id } = req.params;
    try {
      const data = await this.fetchData("images");
      const images = this.extractImages(data);
      const listingImages = images.filter((img) => img.id.toString() === id);
      res.json(
        listingImages.length
          ? listingImages
          : [{ url: "https://via.placeholder.com/250?text=No+Image" }]
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  startServer() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

const manager = new HostawayListingManager();
manager.startServer();
