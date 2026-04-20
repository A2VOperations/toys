import mongoose from 'mongoose';

const ToySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // Dropdown: Toys, Brand, etc.
  brand: { type: String, required: true },
  images: {
    type: [String],
    required: true,
  },
  stock: { type: Number, default: 1 },
  description: { type: String },
  gender: { type: String, enum: ['Boy', 'Girl', 'Unisex'] },
  age: { type: String },
  tags: { type: [String] },
  price: { type: Number, required: true },
}, { timestamps: true });

ToySchema.index({ createdAt: -1 });
ToySchema.index({ category: 1 });
ToySchema.index({ brand: 1 });
ToySchema.index({ gender: 1 });
ToySchema.index({ price: 1 });
ToySchema.index({ title: 1 });
ToySchema.index({ tags: 1 });

ToySchema.index({ createdAt: -1, _id: -1 }); // compound for pagination
ToySchema.index({ category: 1, createdAt: -1 }); // filtered listing

export default mongoose.models.Toy || mongoose.model('Toy', ToySchema);