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

  if (title)    mongoQuery.title    = { $regex: title, $options: 'i' };
  if (category) mongoQuery.category = category;
  if (brand)    mongoQuery.brand    = brand;
  if (gender)   mongoQuery.gender   = gender;
  if (age)      mongoQuery.age      = age;

  if (tags) {
    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (tagsArray.length > 0) {
      mongoQuery.tags = {
        $in: tagsArray.map((t) => new RegExp(`^${t}$`, 'i')),
      };
    }
  }

  if (minPrice || maxPrice) {
    mongoQuery.price = {};
    if (minPrice) mongoQuery.price.$gte = Number(minPrice);
    if (maxPrice) mongoQuery.price.$lte = Number(maxPrice);
  }

  let sortQuery = { createdAt: -1 };
  if (sortBy === 'oldest' || latestUploaded === 'false') sortQuery = { createdAt: 1 };
  if (sortBy === 'price_asc')  sortQuery = { price:  1 };
  if (sortBy === 'price_desc') sortQuery = { price: -1 };
  if (sortBy === 'title_asc')  sortQuery = { title:  1 };
  if (sortBy === 'title_desc') sortQuery = { title: -1 };

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

  // Run both in parallel
  const [toys, totalItems] = await Promise.all([
    Toy.find(
      {},
      { title: 1, category: 1, brand: 1, age: 1, price: 1, images: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .lean(),
    Toy.countDocuments(), // ← real total count
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

    // Split into kept old URLs vs new base64 uploads
    const keepUrls  = images.filter((img) => img.startsWith('http'));
    const newBase64 = images.filter((img) => !img.startsWith('http'));

    // Upload only new images
    const uploadedUrls = await Promise.all(
      newBase64.map((img) => uploadImageToCloudinary(img))
    );

    // Final image list
    imageUrls = [...keepUrls, ...uploadedUrls];

    // Find old images that were actually removed
    const removedImages = existing?.images?.filter(
      (oldUrl) =>
        oldUrl.startsWith('https://res.cloudinary.com') &&
        !keepUrls.includes(oldUrl)
    );

    // ── await so Next.js doesn't kill the function before deletion completes ──
    if (removedImages?.length) {
      await Promise.all(removedImages.map(deleteWithRetry));
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
  await dbConnect();

  const toy = await Toy.findById(id).select('images').lean();
  if (!toy) throw new Error(`Toy not found: ${id}`);

  if (toy?.images?.length) {
    const cloudinaryImages = toy.images.filter((url) =>
      url.startsWith('https://res.cloudinary.com')
    );

    if (cloudinaryImages.length) {
      await Promise.all(cloudinaryImages.map(deleteWithRetry)); // ← await + deleteWithRetry
    }
  }

  return await Toy.findByIdAndDelete(id);
};