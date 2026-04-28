import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES } from '../../constants/productCategories';

const ToySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: PRODUCT_CATEGORIES },
  brand: { type: String },
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
ToySchema.index({ category: 1 });
ToySchema.index({ brand: 1 });
ToySchema.index({ gender: 1 });
ToySchema.index({ price: 1 });
ToySchema.index({ title: 1 });
ToySchema.index({ tags: 1 });

ToySchema.index({ createdAt: -1, _id: -1 }); // compound for pagination
ToySchema.index({ category: 1, createdAt: -1 }); // filtered listing

export default mongoose.models.Toy || mongoose.model('Toy', ToySchema);
