import express from "express";
import { getHook
} from "../controllers/hookController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/').get(getHook)


export default router