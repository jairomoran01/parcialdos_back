const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Codigo = require('../models/Codigo');
const UserInfo = require('../models/UserInfo');
const Intento = require('../models/Intento');

// Configura el secreto para JWT
const jwtSecret = 'your_jwt_secret';

// Inicio de sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        const admin = await Admin.findOne({ email });

        const account = user || admin;

        if (!account) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, account.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const role = account instanceof User ? 'user' : 'admin';
        const token = jwt.sign({ id: account._id, role }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', role, token });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Creación de cuenta de usuario
const createAccount = async (req, res) => {
    const { email, password, nombre, celular, cedula, fechaNacimiento, ciudad } = req.body;

    if (!email || !password || !nombre || !celular || !cedula || !fechaNacimiento || !ciudad) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            role: 'user' // Añade un rol por defecto, por ejemplo "user"
        });
        const userInfo = new UserInfo({
            user_id: user._id,
            nombre,
            celular,
            cedula,
            fecha_de_nacimiento: fechaNacimiento,
            ciudad
        });

        await user.save();
        await userInfo.save();

        res.status(201).json({ message: 'Cuenta creada con éxito' });
    } catch (error) {
        console.error('Error al crear cuenta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Creación de cuenta de administrador
const createAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo administrador con el rol 'admin'
        const newAdmin = new Admin({
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Administrador creado exitosamente' });
    } catch (error) {
        console.error('Error al crear administrador:', error);
        res.status(500).json({ message: 'Error al intentar crear el administrador' });
    }
};

// Obtener todos los códigos
const getCodigos = async (req, res) => {
    try {
        const codigos = await Codigo.find();
        res.status(200).json(codigos);
    } catch (error) {
        console.error('Error al obtener códigos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Registrar un nuevo código
const registrarCodigo = async (req, res) => {
    const { codigo } = req.body;

    if (!/^\d{3}$/.test(codigo)) {
        return res.status(400).json({ message: 'El código debe ser un número de 3 dígitos entre 000 y 999' });
    }

    try {
        const nuevoCodigo = new Codigo({
            codigo,
            premio: 'Premio pendiente',
            estado: 'libre',
            fecha: new Date()
        });

        await nuevoCodigo.save();
        res.status(201).json({ message: 'Código registrado con éxito', nuevoCodigo });
    } catch (error) {
        console.error('Error al registrar código:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const validarCodigo = async (req, res) => {
    const { codigo } = req.body;

    try {
        // Buscar en la colección de números ganadores
        const numeroGanador = await Numero.findOne({ numero: codigo });

        if (numeroGanador) {
            if (numeroGanador.estado === 'libre') {
                // Marcar el número como quemado
                numeroGanador.estado = 'quemado';
                await numeroGanador.save();

                return res.status(200).json({
                    message: '¡Felicidades! Ganaste.',
                    premio: numeroGanador.premio,
                });
            } else {
                return res.status(400).json({ message: 'Este número ya ha sido reclamado.' });
            }
        }

        // Buscar en la colección de números no ganadores
        const numeroNoGanador = await NumeroNoGanador.findOne({ numero: codigo });

        if (numeroNoGanador) {
            return res.status(200).json({ message: 'Lo siento, no ganaste.' });
        }

        return res.status(400).json({ message: 'El número no es válido.' });
    } catch (error) {
        console.error('Error al validar código:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    login,
    createAccount,
    createAdmin,
    getCodigos,
    registrarCodigo,
    validarCodigo // Exportar la función
};
