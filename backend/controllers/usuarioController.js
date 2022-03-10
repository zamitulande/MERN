import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';

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
    if(await usuario.comprobarPassword(password)){
       res.json({
           _id : usuario._id,
           nomre : usuario.nombre,
           email : usuario.email,
           token : generarJWT(usuario._id),
       })
    }else{
        const error = new Error('El password es incorrrecto');
        return res.status(403).json({msg: error.message});
    }
};
const confirmar = async (req, res)=>{
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token});
    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(403).json({msg: error.message});
    }
   try {
      usuarioConfirmar.confirmado = true; 
      usuarioConfirmar.token = ""; 
      await usuarioConfirmar.save();
      res.json({msg: 'usuario confirmado correctamente'});
   } catch (error) {
       console.log(error);
   }
};
const olvidePassword = async (req, res)=>{
    const {email}= req.body;
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});
    }
    try {
        usuario.token = generarId();
        await usuario.save();
        res.json({msg: 'Se ha enviado un correo con instrucciones'})
    } catch (error) {
        console.log(error)
    }
};
const comprobarToken = async  (req, res)=>{
    const {token} = req.params;

    const tokenValido = await Usuario.findOne({token});
    if(tokenValido){
       res.json({msg : 'token valido, El usuario si existe'})
    }else{
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }
};
const nuevoPassword = async (req, res)=>{
    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({token});
    if(usuario){
      usuario.password = password;
      usuario.token= '';
      try {
        await usuario.save();
        res.json({msg: 'password modificado correctamente'})  
      } catch (error) {
          console.log(error)
      }
    }else{
        const error = new Error('Token no es valido');
        return res.status(404).json({msg: error.message});
    }
};
const perfil = async (req, res)=>{
   const {usuario}= req;
   res.json(usuario)
};
export {registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil};