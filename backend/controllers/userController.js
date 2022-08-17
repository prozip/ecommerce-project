import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/genarateToken.js";


// desc:    Auth user & get token
// route:   POST /api/users/login
// access:  public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})

    if (user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error('Invalid email or password')
    }
    
})


// desc:    Get user profile
// route:   GET /api/users/profile
// access:  PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
    res.send("yes")
    // const user = await User.findById(req.user._id)

    // if (user && (await user.matchPassword(password))){
    //     res.json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         isAdmin: user.isAdmin,
    //         token: generateToken(user._id)
    //     })
    // }else{
    //     res.status(401)
    //     throw new Error('Invalid email or password')
    // }
    
})

export {authUser, getUserProfile}