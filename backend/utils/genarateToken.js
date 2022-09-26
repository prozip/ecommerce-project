import jwt from 'jsonwebtoken'
import fs from 'fs'

const generateToken = (id) => {
    var privateKey = fs.readFileSync('private.pem');
    return jwt.sign({ id }, privateKey, {
        algorithm: 'ES384',
        expiresIn: '30d'
    })
}

export default generateToken