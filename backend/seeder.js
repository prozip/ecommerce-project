import mongoose from "mongoose";
import dotenv from 'dotenv'
import colors from 'colors'

// db
import users from "./data/users.js";
import products from "./data/products.js";

// model db
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

import connectDB from "./config/db.js";

dotenv.config()
connectDB()

const importData = async () =>{
    try{
        // clear all db
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        // add adminUser to all product
        const sampleProducts = products.map(product => {
            return {...product, user: adminUser}
        })

        await Product.insertMany(sampleProducts)

        console.log('Data Imported!'.green.inverse);
        process.exit()
    } catch(error){
        console.log(`${error}`.red.inverse);
        process.exit(1)
    }
}
const destroyData = async () =>{
    try{
        // clear all db
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data Destroyed!'.red.inverse);
        process.exit()
    } catch(error){
        console.log(`${error}`.red.inverse);
        process.exit(1)
    }
}

if (process.argv[2] === '-d'){
    destroyData()
}else{
    importData()
}