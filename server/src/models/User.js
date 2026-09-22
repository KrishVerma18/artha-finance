import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getDbStatus } from '../config/db.js';
import { localUserStore } from './store.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    mobile: {
      type: String,
      trim: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'kn', 'ta', 'te'],
      default: 'en',
    },
    preferredTheme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    notificationPreferences: {
      budgetAlerts: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      unusualSpendAlerts: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

export const UserModel = {
  async findOne(filter) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseUser.findOne(filter);
      } catch (e) {
        // Fall back if mongo disconnected
      }
    }
    return await localUserStore.findOne(filter);
  },

  async findById(id) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseUser.findById(id);
      } catch (e) {}
    }
    return await localUserStore.findById(id);
  },

  async create(data) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseUser.create(data);
      } catch (e) {}
    }
    return await localUserStore.create(data);
  },

  async findByIdAndUpdate(id, update, options = { new: true }) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseUser.findByIdAndUpdate(id, update, options);
      } catch (e) {}
    }
    return await localUserStore.findByIdAndUpdate(id, update, options);
  },

  async matchPassword(user, enteredPassword) {
    if (!user || !user.passwordHash) return false;
    return await bcrypt.compare(enteredPassword, user.passwordHash);
  },

  sanitize(user) {
    if (!user) return null;
    const clean = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
    delete clean.passwordHash;
    return clean;
  },
};

export default MongooseUser;
