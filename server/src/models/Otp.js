import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';
import { localOtpStore } from './store.js';

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      index: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseOtp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

export const OtpModel = {
  async findOne(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseOtp.findOne(filter);
      } catch (e) {}
    }
    return await localOtpStore.findOne(filter);
  },

  async create(data) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseOtp.create(data);
      } catch (e) {}
    }
    return await localOtpStore.create(data);
  },

  async findByIdAndUpdate(id, update, options = { new: true }) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseOtp.findByIdAndUpdate(id, update, options);
      } catch (e) {}
    }
    return await localOtpStore.findByIdAndUpdate(id, update, options);
  },

  async deleteMany(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseOtp.deleteMany(filter);
      } catch (e) {}
    }
    return await localOtpStore.deleteMany(filter);
  },
};

export default MongooseOtp;
