import express from 'express';
import {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  exportTransactionsCsv,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All transaction routes require authentication
router.use(protect);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.get('/export', exportTransactionsCsv);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
