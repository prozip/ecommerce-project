import express from "express";
import { 
    paymentItems, zaloPaymentItems, vnpayPaymentItems, vnpayPaymentCheck
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/momo').get(paymentItems)
router.route('/zalo').get(zaloPaymentItems)
router.route('/vnpay').get(vnpayPaymentItems)
router.route('/vnpay_check').get(vnpayPaymentCheck)




export default router