import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 image to Cloudinary.
 * Returns the optimized secure URL.
 */
export async function uploadImageToCloudinary(base64String, folder = "toy-store") {
  const result = await cloudinary.uploader.upload(base64String, {
    folder,
    transformation: [
      { width: 800, height: 800, crop: "limit" }, // never store huge originals
      { quality: "auto:good" },                   // smart compression
      { fetch_format: "auto" },                   // auto WebP/AVIF for browsers
    ],
  });
  return result.secure_url; // e.g. https://res.cloudinary.com/...
}

/**
 * Delete an image from Cloudinary by its public_id.
 * public_id is embedded in the URL: /toy-store/<public_id>
 */
export function extractPublicId(cloudinaryUrl) {
  // e.g. https://res.cloudinary.com/demo/image/upload/v123/toy-store/abc123.webp
  const parts = cloudinaryUrl.split("/upload/");
  if (parts.length < 2) return null;
  // strip version segment (v12345/) and extension
  return parts[1].replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
}

export async function deleteImageFromCloudinary(cloudinaryUrl) {
  const publicId = extractPublicId(cloudinaryUrl);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };