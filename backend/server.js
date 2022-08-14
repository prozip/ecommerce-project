import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import colors from 'colors'

import productRoutes from './routes/productRoutes.js'

dotenv.config()
connectDB()

const app = express()
app.get('/', (req, res) => {
    res.send('API is running...')
})
app.use('/api/products', productRoutes)

// default port: 5000
const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`Server running in ${process.env.NODE_ENV} on PORT ${PORT}`
    .yellow.bold))