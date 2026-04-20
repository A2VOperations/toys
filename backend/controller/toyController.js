import Toy from '../models/Toy';
import dbConnect from '../dbConfig/db';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '../lib/cloudinary';

// ─────────────────────────────────────────
// Shared: upload array of base64 → Cloudinary URLs
// Runs uploads in parallel for speed
// ─────────────────────────────────────────
async function processImages(images) {
  if (!images?.length) return [];

  // Separate already-uploaded URLs from new base64 strings
  const results = await Promise.all(
    images.map((img) => {
      if (img.startsWith("http")) return img; // already a Cloudinary URL
      return uploadImageToCloudinary(img);    // upload base64
    })
  );
  return results;
}

// ─────────────────────────────────────────
// ADD TOY
// ─────────────────────────────────────────
export const addToy = async (data) => {
  await dbConnect();

  const imageUrls = await processImages(data.images);

  const toy = new Toy({ ...data, images: imageUrls });
  return await toy.save();
};

// ─────────────────────────────────────────
// GET TOYS (with filtering + pagination)
// Optimized: projection to skip heavy fields when listing
// ─────────────────────────────────────────
export const getToys = async (query = {}) => {
  await dbConnect();

  const {
    title, category, brand, gender, age, tags,
    page = 1, limit = 9, sortBy, latestUploaded,
    minPrice, maxPrice,
    fields, // optional: comma-separated field projection
  } = query;

  const mongoQuery = {};

  if (title) mongoQuery.title = { $regex: title, $options: "i" };
  if (category) mongoQuery.category = category;
  if (brand) mongoQuery.brand = brand;
  if (gender) mongoQuery.gender = gender;
  if (age) mongoQuery.age = age;

  if (tags) {
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagsArray.length > 0) {
      mongoQuery.tags = {
        $in: tagsArray.map(t => new RegExp(`^${t}$`, 'i')),
      };
    }
  }

  if (minPrice || maxPrice) {
    mongoQuery.price = {};
    if (minPrice) mongoQuery.price.$gte = Number(minPrice);
    if (maxPrice) mongoQuery.price.$lte = Number(maxPrice);
  }

  let sortQuery = { createdAt: -1 };
  if (sortBy === "oldest" || latestUploaded === "false") sortQuery = { createdAt: 1 };
  if (sortBy === "price_asc")  sortQuery = { price: 1 };
  if (sortBy === "price_desc") sortQuery = { price: -1 };
  if (sortBy === "title_asc")  sortQuery = { title: 1 };
  if (sortBy === "title_desc") sortQuery = { title: -1 };

  const parsedPage  = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Projection: for listing pages we don't need `description`
  // (saves bandwidth on every list request)
  const projection = fields
    ? fields.split(",").reduce((acc, f) => ({ ...acc, [f.trim()]: 1 }), {})
    : { description: 0 }; // exclude heavy field by default on lists

  // Run count + fetch in parallel
  const [toys, totalItems] = await Promise.all([
    Toy.find(mongoQuery, projection)
      .sort(sortQuery)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Toy.countDocuments(mongoQuery),
  ]);

  const totalPages = Math.ceil(totalItems / parsedLimit) || 1;

  return {
    toys,
    pagination: { totalItems, totalPages, currentPage: parsedPage, pageSize: parsedLimit },
  };
};

// ─────────────────────────────────────────
// GET BY ID — full document including description
// ─────────────────────────────────────────
export const getToyById = async (id) => {
  await dbConnect();
  return await Toy.findById(id).lean();
};

// ─────────────────────────────────────────
// UPDATE TOY
// Replaces old Cloudinary images + uploads new ones
// ─────────────────────────────────────────
export const updateToy = async (id, body) => {
  await dbConnect();

  const {
    title, category, brand, stock, description,
    gender, age, tags, images, price,
  } = body;

  let imageUrls;

  if (images?.length) {
    // Get the existing toy to clean up old Cloudinary images
    const existing = await Toy.findById(id).select("images").lean();

    // Upload new images (parallel)
    imageUrls = await processImages(images);

    // Delete old Cloudinary images that are being replaced
    if (existing?.images?.length) {
      const oldCloudinaryImages = existing.images.filter(
        (url) => url.startsWith("https://res.cloudinary.com")
      );
      // Fire-and-forget deletion (don't block the update)
      Promise.all(oldCloudinaryImages.map(deleteImageFromCloudinary)).catch(
        (err) => console.error("Cloudinary cleanup error:", err)
      );
    }
  }

  return await Toy.findByIdAndUpdate(
    id,
    {
      title, category, brand, price,
      stock: Number(stock) || 0,
      description, gender, age,
      tags: tags || [],
      ...(imageUrls?.length ? { images: imageUrls } : {}),
    },
    { new: true, runValidators: true }
  );
};

// ─────────────────────────────────────────
// DELETE TOY — also removes images from Cloudinary
// ─────────────────────────────────────────
export const deleteToy = async (id) => {
  await dbConnect();

  const toy = await Toy.findById(id).select("images").lean();

  if (toy?.images?.length) {
    const cloudinaryImages = toy.images.filter(
      (url) => url.startsWith("https://res.cloudinary.com")
    );
    Promise.all(cloudinaryImages.map(deleteImageFromCloudinary)).catch(
      (err) => console.error("Cloudinary delete error:", err)
    );
  }

  return await Toy.findByIdAndDelete(id);
};