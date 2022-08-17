import express from "express";
import { authUser, getUserProfile, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/').post(registerUser)
router.post('/login', authUser)

// protected route with middleware
router.route('/profile').get(protect,getUserProfile)



export default router