import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(base64String, folder = "toy-store") {
  const result = await cloudinary.uploader.upload(base64String, {
    folder,
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
  });
  return result.secure_url;
}

export function extractPublicId(cloudinaryUrl) {
  // e.g. https://res.cloudinary.com/demo/image/upload/v123/toy-store/abc123.webp
  const parts = cloudinaryUrl.split("/upload/");
  if (parts.length < 2) return null;
  // strip version segment (v12345/) and extension
  return parts[1].replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
}

export async function deleteImageFromCloudinary(cloudinaryUrl) {
  const publicId = extractPublicId(cloudinaryUrl);
  if (!publicId) {
    console.error("Could not extract public ID from:", cloudinaryUrl);
    return;
  }

  // Await the destruction
  const result = await cloudinary.uploader.destroy(publicId);
  
  console.log("Cloudinary response:", result);

  // CRITICAL: Cloudinary returns 'not found' as a successful (but empty) operation.
  // If you want to ensure the file was actually deleted, check for 'ok'.
  if (result?.result !== 'ok' && result?.result !== 'not found') {
    throw new Error(`Cloudinary delete failed: ${result?.result}`);
  }
}


export async function deleteWithRetry(url, retries = 2) {
  for (let i = 1; i <= retries; i++) {
    try {
      await deleteImageFromCloudinary(url);
      console.log("Cloudinary delete success:", url);
      return;
    } catch (err) {
      if (i === retries) {
        console.error(`Cloudinary delete failed after ${retries} attempts:`, url, err.message);
      } else {
        console.warn(`Cloudinary delete attempt ${i} failed, retrying in 1s...`);
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }
}

export { cloudinary };