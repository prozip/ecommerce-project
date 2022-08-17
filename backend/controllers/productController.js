import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";


// desc:    Fetch all products
// route:   GET /api/products
// access   public
const getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})

// desc:    Fetch single product
// route:   GET /api/products/:id
// access   public
const getProductById = asyncHandler(async (req, res) => {
    // separate error: https://www.mongodb.com/community/forums/t/performance-let-mongodb-return-errors-instead-of-preventing-them/148121

    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

export {getProduct, getProductById}
