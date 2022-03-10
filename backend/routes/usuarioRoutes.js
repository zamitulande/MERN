import express from "express";
const router = express.Router();
import {registrar, autenticar, confirmar, olvidePassword,comprobarToken, nuevoPassword, perfil} from '../controllers/usuarioController.js'
import checkOut from "../middleware/checkOut.js";

//AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIOS
router.post('/', registrar); //crea un nuevo usuario
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
router.get('/perfil', checkOut, perfil)

export default router;