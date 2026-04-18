import Toy from '../models/Toy';
import dbConnect from '../dbConfig/db';

export const addToy = async (data) => {
  await dbConnect();
  const toy = new Toy(data);
  return await toy.save();
};

export const getToys = async (query = {}) => {
  await dbConnect();
  
  const {
    title, category, brand, gender, age, tags,
    page = 1, limit = 9, sortBy, latestUploaded,
    minPrice, maxPrice
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
        $in: tagsArray.map(t => new RegExp(`^${t}$`, 'i'))
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
  if (sortBy === "title_asc") sortQuery = { title: 1 };
  if (sortBy === "title_desc") sortQuery = { title: -1 };

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const toys = await Toy.find(mongoQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(parsedLimit);

  const totalItems = await Toy.countDocuments(mongoQuery);
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

// ── NEW: single toy ──────────────────────────────────────────
export const getToyById = async (id) => {
  await dbConnect();
  return await Toy.findById(id);
};

export const updateToy = async (id, body) => {
  await dbConnect();
  const { title, category, brand, stock, description, gender, age, tags, images, price } = body;

  return await Toy.findByIdAndUpdate(
    id,
    {
      title, category, brand, price,  // ← ADD
      stock: Number(stock) || 0,
      description, gender, age,
      tags: tags || [],
      ...(images?.length > 0 ? { images } : {}),
    },
    { new: true, runValidators: true }
  );
};

export const deleteToy = async (id) => {
  await dbConnect();
  return await Toy.findByIdAndDelete(id);
};