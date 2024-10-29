const express = require('express');
const router = express.Router();
const { login, createAdmin, createAccount, getCodigos, registrarCodigo, validarNumero } = require('../controllers/sorteoController');

router
    .post('/login', login) // Ruta para login
    .post('/registro', createAccount) // Nueva ruta para crear cuentas
    .post('/createAdmin', createAdmin) // Nueva ruta para crear administradores
    .get('/codigos', getCodigos)
    .post('/codigos', registrarCodigo)
    .post('/validar-codigo', validarNumero);

module.exports = router;
