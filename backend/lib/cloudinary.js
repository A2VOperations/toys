import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function validateCloudinaryConfig() {
  const missing = [
    ["CLOUDINARY_CLOUD_NAME", process.env.CLOUDINARY_CLOUD_NAME],
    ["CLOUDINARY_API_KEY", process.env.CLOUDINARY_API_KEY],
    ["CLOUDINARY_API_SECRET", process.env.CLOUDINARY_API_SECRET],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(
      `Cloudinary configuration is missing: ${missing.join(", ")}. Add these environment variables in Vercel and redeploy.`
    );
  }
}

export async function uploadImageToCloudinary(base64String, folder = "toy-store") {
  validateCloudinaryConfig();

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
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') return null;
  
  // Clean URL in case of spaces
  const url = cloudinaryUrl.trim();
  
  // Split by /upload/ to get the path part
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  // The part after /upload/ contains [transformations/][vversion/]public_id.extension
  const pathPart = parts[1];
  const segments = pathPart.split("/");

  // Identify the version segment (starts with 'v' followed by digits)
  // Usually the version segment is the last one before the public ID starts.
  let versionIndex = -1;
  for (let i = 0; i < segments.length; i++) {
    if (/^v\d+$/.test(segments[i])) {
      versionIndex = i;
    }
  }

  let publicIdSegments;
  if (versionIndex !== -1) {
    // Public ID starts after the version segment
    publicIdSegments = segments.slice(versionIndex + 1);
  } else {
    // If no version found, skip segments that look like transformations
    // Common Cloudinary transformation prefixes
    const transformPrefixes = new Set(['c','w','h','q','f','r','e','b','o','l','u','p','x','y','d','g','ac','af','ar','bo','co','dl','dn','du','eo','fl','fn','if','ki','so','sp','vc','vs']);
    
    let firstNonTransformIndex = 0;
    while (firstNonTransformIndex < segments.length - 1) {
      const seg = segments[firstNonTransformIndex];
      // If it contains , or = or matches prefix_value pattern, it's likely a transformation
      if (seg.includes(",") || seg.includes("=")) {
        firstNonTransformIndex++;
        continue;
      }
      const underscoreParts = seg.split('_');
      if (underscoreParts.length >= 2 && transformPrefixes.has(underscoreParts[0])) {
        firstNonTransformIndex++;
        continue;
      }
      break;
    }
    publicIdSegments = segments.slice(firstNonTransformIndex);
  }

  if (!publicIdSegments.length) return null;

  // Join back, remove extension, and decode
  const publicIdWithExt = publicIdSegments.join("/");
  // Remove extension (everything after the last dot in the last segment)
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
  
  return decodeURIComponent(publicId);
}

export async function deleteImageFromCloudinary(cloudinaryUrl) {
  validateCloudinaryConfig();

  console.log("--- Cloudinary Deletion Debug ---");
  console.log("Full URL:", cloudinaryUrl);
  
  const publicId = extractPublicId(cloudinaryUrl);
  if (!publicId) {
    console.error("FAILED to extract public ID. URL format might be unsupported.");
    return;
  }

  console.log("Extracted Public ID:", publicId);
  console.log("Cloud Config (partial):", { 
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? "PRESENT" : "MISSING" 
  });

  try {
    // Attempt deletion as 'image' (default)
    let result = await cloudinary.uploader.destroy(publicId);
    console.log("Primary Deletion Response:", result);

    // If result is 'not found', try with resource_type: 'raw' or 'video' just in case
    if (result?.result === 'not found') {
      console.log("Not found as 'image', trying as 'raw'...");
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      console.log("Raw Deletion Response:", result);
    }
    
    if (result?.result === 'not found') {
      console.log("Not found as 'raw', trying as 'video'...");
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      console.log("Video Deletion Response:", result);
    }

    if (result?.result !== 'ok' && result?.result !== 'not found') {
      throw new Error(`Cloudinary error: ${result?.result}`);
    }
    
    if (result?.result === 'ok') {
      console.log("SUCCESS: Image deleted from Cloudinary.");
    } else {
      console.warn("WARNING: Cloudinary returned 'not found'. Image might already be deleted or ID is wrong.");
    }
  } catch (err) {
    console.error("Cloudinary Destroy EXCEPTION:", err.message);
    throw err;
  }
  console.log("---------------------------------");
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
