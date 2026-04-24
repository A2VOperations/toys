import Toy from '../models/Toy';
import dbConnect from '../dbConfig/db';
import {
  uploadImageToCloudinary,
  deleteWithRetry,
} from '../lib/cloudinary';

const MAX_LIMIT = 200;
const MAX_PAGE  = 1000;

async function processImages(images) {
  if (!images?.length) return [];

  const results = await Promise.all(
    images.map((img) => {
      if (typeof img === 'string' && img.startsWith('http')) return img;
      return uploadImageToCloudinary(img);
    })
  );

  const failed = results.filter((r) => !r);
  if (failed.length) {
    throw new Error(`${failed.length} image(s) failed to upload to Cloudinary.`);
  }

  return results;
}

// Helper: parse a comma-separated param into a trimmed, non-empty array
function parseMulti(value) {
  if (!value) return [];
  return value.split(',').map((v) => v.trim()).filter(Boolean);
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
// GET TOYS
// ─────────────────────────────────────────
export const getToys = async (query = {}) => {
  await dbConnect();

  const {
    title, category, brand, gender, age, tags,
    page = 1, limit = 9, sortBy, latestUploaded,
    minPrice, maxPrice,
    fields,
  } = query;

  const mongoQuery = {};

  // ── Text search (partial, case-insensitive) ──────────────────────────────
  if (title) mongoQuery.title = { $regex: title, $options: 'i' };

  // ── Multi-value filters (comma-separated → $in) ──────────────────────────
  const categories = parseMulti(category);
  if (categories.length) {
    mongoQuery.category = categories.length === 1
      ? { $regex: `^${categories[0]}$`, $options: 'i' }
      : { $in: categories.map((c) => new RegExp(`^${c}$`, 'i')) };
  }

  const brands = parseMulti(brand);
  if (brands.length) {
    mongoQuery.brand = brands.length === 1
      ? { $regex: `^${brands[0]}$`, $options: 'i' }
      : { $in: brands.map((b) => new RegExp(`^${b}$`, 'i')) };
  }

  const genders = parseMulti(gender);
  if (genders.length) {
    mongoQuery.gender = genders.length === 1
      ? { $regex: `^${genders[0]}$`, $options: 'i' }
      : { $in: genders.map((g) => new RegExp(`^${g}$`, 'i')) };
  }

  const ages = parseMulti(age);
  if (ages.length) {
    mongoQuery.age = ages.length === 1
      ? { $regex: `^${ages[0]}$`, $options: 'i' }
      : { $in: ages.map((a) => new RegExp(`^${a}$`, 'i')) };
  }

  // Tags: match ANY of the selected tags ($in)
  const tagsArray = parseMulti(tags);
  if (tagsArray.length) {
    mongoQuery.tags = {
      $in: tagsArray.map((t) => new RegExp(`^${t}$`, 'i')),
    };
  }

  // ── Price range ───────────────────────────────────────────────────────────
  if (minPrice || maxPrice) {
    mongoQuery.price = {};
    if (minPrice) mongoQuery.price.$gte = Number(minPrice);
    if (maxPrice) mongoQuery.price.$lte = Number(maxPrice);
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  let sortQuery = { createdAt: -1 };
  if (sortBy === 'oldest' || latestUploaded === 'false') sortQuery = { createdAt: 1 };
  if (sortBy === 'price_asc')  sortQuery = { price:  1 };
  if (sortBy === 'price_desc') sortQuery = { price: -1 };
  if (sortBy === 'title_asc')  sortQuery = { title:  1 };
  if (sortBy === 'title_desc') sortQuery = { title: -1 };

  // ── Pagination ────────────────────────────────────────────────────────────
  const parsedPage  = Math.min(Math.max(1, parseInt(page,  10) || 1), MAX_PAGE);
  const parsedLimit = Math.min(Math.max(1, parseInt(limit, 10) || 9), MAX_LIMIT);
  const skip = (parsedPage - 1) * parsedLimit;

  const projection = fields
    ? fields.split(',').reduce((acc, f) => ({ ...acc, [f.trim()]: 1 }), {})
    : { description: 0 };

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
    pagination: {
      totalItems,
      totalPages,
      currentPage: parsedPage,
      pageSize: parsedLimit,
    },
  };
};

// ─────────────────────────────────────────
// GET HOME PAGE TOYS
// ─────────────────────────────────────────
export const getHomePageToys = async ({ limit = 20 } = {}) => {
  await dbConnect();

  const safeLimit = Math.min(Math.max(1, parseInt(limit, 10) || 20), MAX_LIMIT);

  const [toys, totalItems] = await Promise.all([
    Toy.find(
      {},
      { title: 1, category: 1, brand: 1, age: 1, price: 1, images: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .lean(),
    Toy.countDocuments(),
  ]);

  return { toys, totalItems };
};

// ─────────────────────────────────────────
// GET BY ID
// ─────────────────────────────────────────
export const getToyById = async (id) => {
  await dbConnect();
  return await Toy.findById(id).lean();
};

// ─────────────────────────────────────────
// UPDATE TOY
// ─────────────────────────────────────────
export const updateToy = async (id, body) => {
  await dbConnect();

  const {
    title, category, brand, stock, description,
    gender, age, tags, images, price,
  } = body;

  let imageUrls;

  if (images?.length) {
    const existing = await Toy.findById(id).select('images').lean();

    const keepUrls  = images.filter((img) => img.startsWith('http'));
    const newBase64 = images.filter((img) => !img.startsWith('http'));

    const uploadedUrls = await Promise.all(
      newBase64.map((img) => uploadImageToCloudinary(img))
    );

    imageUrls = [...keepUrls, ...uploadedUrls];

    const removedImages = existing?.images?.filter(
      (oldUrl) =>
        oldUrl.includes('cloudinary.com') &&
        !keepUrls.includes(oldUrl)
    );

    console.log("Images to be removed from Cloudinary during update:", removedImages);

    if (removedImages?.length) {
      await Promise.all(removedImages.map(deleteWithRetry));
      console.log("Update deletion attempts finished.");
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
// DELETE TOY
// ─────────────────────────────────────────
export const deleteToy = async (id) => {
  console.log("--- deleteToy Called ---", id);
  await dbConnect();

  const toy = await Toy.findById(id).select('images').lean();
  console.log("Toy found for deletion:", toy);

  if (!toy) {
    console.error("Toy not found for deletion:", id);
    throw new Error(`Toy not found: ${id}`);
  }

  if (toy?.images?.length) {
    const cloudinaryImages = toy.images.filter((url) => {
      const isCloudinary = url && typeof url === 'string' && url.includes('cloudinary.com');
      console.log(`Checking image: ${url} -> isCloudinary: ${isCloudinary}`);
      return isCloudinary;
    });

    console.log("Cloudinary images to delete:", cloudinaryImages);

    if (cloudinaryImages.length) {
      await Promise.all(cloudinaryImages.map(deleteWithRetry));
      console.log("All Cloudinary deletion attempts finished.");
    } else {
      console.log("No Cloudinary images found in the toy's images array.");
    }
  } else {
    console.log("Toy has no images or images array is empty.");
  }

  const result = await Toy.findByIdAndDelete(id);
  console.log("Database deletion result:", result ? "SUCCESS" : "FAILED");
  return result;
};