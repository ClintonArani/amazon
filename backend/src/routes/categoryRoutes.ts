import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import {authMiddleware,adminMiddleware} from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create',authMiddleware,adminMiddleware, createCategory);
router.get('/all', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id',authMiddleware, adminMiddleware, deleteCategory);

export default router;