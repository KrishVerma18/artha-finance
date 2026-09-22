import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';
import { localTransactionStore } from './store.js';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 200,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });

const MongooseTransaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export const TransactionModel = {
  async find(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return MongooseTransaction.find(filter);
      } catch (e) {}
    }
    return await localTransactionStore.find(filter);
  },

  async findOne(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseTransaction.findOne(filter);
      } catch (e) {}
    }
    return await localTransactionStore.findOne(filter);
  },

  async findById(id) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseTransaction.findById(id);
      } catch (e) {}
    }
    return await localTransactionStore.findById(id);
  },

  async create(data) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseTransaction.create(data);
      } catch (e) {}
    }
    return await localTransactionStore.create(data);
  },

  async findByIdAndUpdate(id, update, options = { new: true }) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseTransaction.findByIdAndUpdate(id, update, options);
      } catch (e) {}
    }
    return await localTransactionStore.findByIdAndUpdate(id, update, options);
  },

  async findByIdAndDelete(id) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseTransaction.findByIdAndDelete(id);
      } catch (e) {}
    }
    return await localTransactionStore.findByIdAndDelete(id);
  },

  async deleteMany(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseTransaction.deleteMany(filter);
      } catch (e) {}
    }
    return await localTransactionStore.deleteMany(filter);
  },

  async countDocuments(filter = {}) {
    if (!getDbStatus().isInMemoryFallback) {
      try {
        return await MongooseTransaction.countDocuments(filter);
      } catch (e) {}
    }
    return await localTransactionStore.countDocuments(filter);
  },
};

export default MongooseTransaction;
