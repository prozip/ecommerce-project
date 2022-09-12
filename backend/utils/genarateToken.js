import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        algorithm: 'ES384',
        expiresIn: '30d'
    })
}

export default generateToken