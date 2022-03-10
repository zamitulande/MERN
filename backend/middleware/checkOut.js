import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';

const checkOut = async (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(" ")[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.usuario = await Usuario.findById(decode.id).select('-password -confirmado -token -createdAt -updatedAt -__v')
            return next();
        } catch (error) {
            return res.status(404).json({msg: 'hubo un error'})
        }
    }
    if(!token){
        const error = new Error ('Token no valido');
        res.status(401).json(({meg: error.message}))
    }
    next()
};

export default checkOut;