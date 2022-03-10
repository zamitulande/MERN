import express, { Router } from "express";
const router = express.Router();
import {registrar, autenticar, confirmar} from '../controllers/usuarioController.js'

//AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIOS
router.post('/', registrar); //crea un nuevo usuario
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);

export default router;