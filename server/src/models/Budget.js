import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';
import { localBudgetStore } from './store.js';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Budget category is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Budget limit amount is required'],
      min: [1, 'Budget must be at least 1'],
    },
    period: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    month: {
      type: Number, // 1 to 12
      default: () => new Date().getMonth() + 1,
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const MongooseBudget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export const BudgetModel = {
  async find(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return MongooseBudget.find(filter);
      } catch (e) {}
    }
    return await localBudgetStore.find(filter);
  },

  async findOne(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseBudget.findOne(filter);
      } catch (e) {}
    }
    return await localBudgetStore.findOne(filter);
  },

  async findById(id) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseBudget.findById(id);
      } catch (e) {}
    }
    return await localBudgetStore.findById(id);
  },

  async create(data) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseBudget.create(data);
      } catch (e) {}
    }
    return await localBudgetStore.create(data);
  },

  async findByIdAndUpdate(id, update, options = { new: true }) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseBudget.findByIdAndUpdate(id, update, options);
      } catch (e) {}
    }
    return await localBudgetStore.findByIdAndUpdate(id, update, options);
  },

  async findByIdAndDelete(id) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseBudget.findByIdAndDelete(id);
      } catch (e) {}
    }
    return await localBudgetStore.findByIdAndDelete(id);
  },

  async deleteMany(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseBudget.deleteMany(filter);
      } catch (e) {}
    }
    return await localBudgetStore.deleteMany(filter);
  },
};

export default MongooseBudget;
