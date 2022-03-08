import express, { Router } from "express";
const router = express.Router();
import {registrar} from '../controllers/usuarioController.js'

//AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIOS
router.post('/', registrar); //crea un nuevo usuario

export default router;