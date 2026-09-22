import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../.data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class LocalCollection {
  constructor(collectionName) {
    this.name = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(`Error loading collection ${this.name}:`, e.message);
    }
    return [];
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error(`Error saving collection ${this.name}:`, e.message);
    }
  }

  _filterData(filter = {}) {
    return this.data.filter((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if (key === '_id' || key === 'id') {
          if (item._id !== val && item.id !== val) return false;
        } else if (val && typeof val === 'object' && !(val instanceof Date)) {
          if (val.$gte !== undefined && item[key] < val.$gte) return false;
          if (val.$lte !== undefined && item[key] > val.$lte) return false;
          if (val.$in !== undefined && !val.$in.includes(item[key])) return false;
          if (val.$regex !== undefined) {
            const flags = val.$options || '';
            const regex = new RegExp(val.$regex, flags);
            if (!regex.test(item[key])) return false;
          }
        } else if (item[key] !== val) {
          return false;
        }
      }
      return true;
    });
  }

  async find(filter = {}) {
    const matched = this._filterData(filter);
    // Deep clone so external mutations don't corrupt in-memory store
    const cloned = JSON.parse(JSON.stringify(matched));

    // Ensure array can be used directly or through .results, and supports chaining
    Object.defineProperty(cloned, 'results', {
      value: cloned,
      enumerable: false,
      writable: true,
    });

    cloned.sort = function (sortObj) {
      if (!sortObj) return this;
      const [field, order] = Object.entries(sortObj)[0] || ['createdAt', -1];
      Array.prototype.sort.call(this, (a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (field === 'date' || field === 'createdAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (valA < valB) return order === 1 ? -1 : 1;
        if (valA > valB) return order === 1 ? 1 : -1;
        return 0;
      });
      return this;
    };

    cloned.skip = function (count) {
      if (count > 0) {
        this.splice(0, count);
      }
      return this;
    };

    cloned.limit = function (count) {
      if (count > 0) {
        this.splice(count);
      }
      return this;
    };

    return cloned;
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list && list.length > 0 ? { ...list[0] } : null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(doc) {
    const now = new Date().toISOString();
    const newDoc = {
      _id: doc._id || crypto.randomUUID(),
      ...doc,
      createdAt: doc.createdAt || now,
      updatedAt: now,
    };
    this.data.push(newDoc);
    this.save();
    return { ...newDoc };
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const idx = this.data.findIndex((item) => item._id === id || item.id === id);
    if (idx === -1) return null;

    const current = this.data[idx];
    const fieldsToUpdate = update.$set ? { ...update.$set } : { ...update };
    delete fieldsToUpdate._id;
    delete fieldsToUpdate.id;

    const updated = {
      ...current,
      ...fieldsToUpdate,
      updatedAt: new Date().toISOString(),
    };

    this.data[idx] = updated;
    this.save();
    return { ...updated };
  }

  async findByIdAndDelete(id) {
    const idx = this.data.findIndex((item) => item._id === id || item.id === id);
    if (idx === -1) return null;
    const deleted = this.data.splice(idx, 1)[0];
    this.save();
    return deleted;
  }

  async deleteMany(filter = {}) {
    const beforeCount = this.data.length;
    this.data = this.data.filter((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] === val) return false;
      }
      return true;
    });
    this.save();
    return { deletedCount: beforeCount - this.data.length };
  }

  async countDocuments(filter = {}) {
    const list = await this.find(filter);
    return list ? list.length : 0;
  }
}

export const localUserStore = new LocalCollection('users');
export const localTransactionStore = new LocalCollection('transactions');
export const localBudgetStore = new LocalCollection('budgets');
export const localOtpStore = new LocalCollection('otps');
