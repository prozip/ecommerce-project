import express from "express";
import { 
    paymentItems
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/').get(paymentItems)



export default router