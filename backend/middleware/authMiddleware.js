import jwt from 'jsonwebtoken'

const protect = async (req, res, next) =>{
    let token
    console.log(req.headers.authorization)
    next()
}

export {protect}