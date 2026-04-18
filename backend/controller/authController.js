import User from '../models/User';
import dbConnect from '../dbConfig/db';
import bcrypt from 'bcryptjs';

export const loginUser = async (data) => {
  await dbConnect();
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  return { name: user.name, email: user.email, mobile: user.mobile };
};

export const getUserByEmail = async (email) => {
  await dbConnect();
  return await User.findOne({ email }).select('-password');
};

export const updateUser = async (email, data) => {
  await dbConnect();
  const { name, mobile, currentPassword, newPassword } = data;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Current password is incorrect");
    user.password = await bcrypt.hash(newPassword, 12);
  }
  user.name   = name   || user.name;
  user.mobile = mobile ?? user.mobile;
  return await user.save();
};