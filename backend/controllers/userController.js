import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/genarateToken.js";


// desc:    Auth user & get token
// route:   POST /api/users/login
// access:  public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }

})


// desc:    Get user profile
// route:   GET /api/users/profile
// access:  PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(401)
        throw new Error('User not found')
    }

})

// desc:    Get Update profile
// route:   PUT /api/users/profile
// access:  PRIVATE
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
       user.name = req.body.name || user.name
       user.email = req.body.email || user.email
       if(req.body.password) {
        user.password = req.body.password
       }

       const updatedUser = await user.save()

       res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id)
    })
    
    } else {
        res.status(401)
        throw new Error('User not found')
    }

})


// desc:    Register new user
// route:   POST /api/users
// access:  public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
        throw new Error('User already exists')
    }
    const user = await User.create({
        name, email, password
    })

    if (user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// desc:    Get all user
// route:   GET /api/users
// access:  PRIVATE/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// desc:    Delete user
// route:   DELETE /api/users/:id
// access:  PRIVATE/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({ message: 'User removed' }) 
    }else {
        res.status(404)
        throw new Error('User not found')
    }
})


// desc:    Get user by ID
// route:   GET /api/users/:id
// access:  PRIVATE/Admin
const getUserById= asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if(user){
        res.json(user)
    }else {
        res.status(404)
        throw new Error('User not found')
    }
})

// desc:    Update user
// route:   PUT /api/users/:id
// access:  PRIVATE/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
       user.name = req.body.name || user.name
       user.email = req.body.email || user.email
       user.isAdmin = req.body.isAdmin || user.isAdmin

       const updatedUser = await user.save()

       res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    })
    
    } else {
        res.status(401)
        throw new Error('User not found')
    }

})

export { 
    authUser, 
    getUserProfile, 
    registerUser, 
    updateUserProfile, 
    getUsers,
    deleteUser,
    getUserById,
    updateUser, 
}