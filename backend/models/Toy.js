import mongoose from 'mongoose';

const ToySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // Dropdown: Toys, Brand, etc.
  brand: { type: String, required: true },
  images: {
    type: [String],
    required: true,
  },
  stock: { type: Number, default: 3 },
  description: { type: String },
  gender: { type: String, enum: ['Boy', 'Girl', 'Unisex'] },
  age: { type: String },
  tags: { type: [String] },
  price: { type: Number, required: true },
}, { timestamps: true });

ToySchema.index({ createdAt: -1 });

export default mongoose.models.Toy || mongoose.model('Toy', ToySchema);