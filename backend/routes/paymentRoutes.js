import express from "express";
import { 
    paymentItems, zaloPaymentItems
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/momo').get(paymentItems)
router.route('/zalo').get(zaloPaymentItems)




export default router