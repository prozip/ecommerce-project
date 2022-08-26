import express from "express";
import { 
    authUser, 
    getUserProfile, 
    registerUser, 
    updateUserProfile,
    getUsers,
    deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)

// protected route with middleware
router.route('/profile').get(protect,getUserProfile).put(protect, updateUserProfile)
//delete user
router.route('/:id').delete(protect, admin, deleteUser)

export default router