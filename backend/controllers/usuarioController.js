import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js';

const registrar = async (req, res)=>{

    //evitar registros duplicados
    const {email}= req.body;
    const existeUsuario = await Usuario.findOne({email});
    
    if(existeUsuario){
        const error = new Error('Usuario ya existe');
        return res.status(400).json({msg: error.message});
    }
    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save();
        res.json(usuarioAlmacenado);
    } catch (error) {
        console.log(error);
    }
    
};
const autenticar = async (req, res)=>{

    const {email, password}= req.body;

    //COMPROBAR SI EL EL USUARIO EXISTE
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});
    }
    //COMPROBAR SIE L USUARIO ESTA CONFIRMADO
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }
    //COMPROBAR EL PASSWORD
};
export {registrar, autenticar};