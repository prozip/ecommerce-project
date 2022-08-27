import express from "express";
import { 
    getProduct, 
    getProductById,
    deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/').get(getProduct)
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct)

export default router