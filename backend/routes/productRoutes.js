import express from "express";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

const router = express.Router()

// desc:    Fetch all products
// route:   GET /api/products
// access   public

router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)

}))


// desc:    Fetch single product
// route:   GET /api/products/:id
// access   public
router.get('/:id', asyncHandler(async (req, res) => {
    // separate error: https://www.mongodb.com/community/forums/t/performance-let-mongodb-return-errors-instead-of-preventing-them/148121
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    } catch (error) {
        res.status(400).json({ message: 'Bad Request' })
    }
}))

export default router