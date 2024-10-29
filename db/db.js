const mongoose = require('mongoose');
const Codigo = require('../models/Codigo'); // Asegúrate de que la ruta sea correcta

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://jairomoran01:R90D0GZ4l5FEWZpw@cluster0.ue0hm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión a MongoDB exitosa');

        //Inicialización de los datos de "números" después de la conexión exitosa
        await initializeCodigos();

    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1); // Termina el proceso si no se puede conectar
    }
};

// Función para generar un número aleatorio único entre 000 y 999
function generateUniqueRandomNumbers(count, min = 0, max = 999) {
    const numbers = new Set();
    while (numbers.size < count) {
        const randomNum = String(Math.floor(Math.random() * (max - min + 1) + min)).padStart(3, '0');
        numbers.add(randomNum);
    }
    return Array.from(numbers);
}

// Función para inicializar la colección "números" con números aleatorios
async function initializeCodigos() {
    try {
        // Elimina todos los registros previos en "números"
        await Codigo.deleteMany();

        // Genera 400 números aleatorios y únicos entre 000 y 999
        const randomNumbers = generateUniqueRandomNumbers(400);

        // Crear los datos para los 400 números ganadores de manera aleatoria
        const numerosGanadores = [];

        // Asignación de premios
        const premios = [
            { cantidad: 50, premio: '1 millón de pesos' },
            { cantidad: 150, premio: '50 mil pesos' },
            { cantidad: 200, premio: '10 mil pesos' }
        ];

        let index = 0;
        for (const { cantidad, premio } of premios) {
            for (let i = 0; i < cantidad; i++) {
                numerosGanadores.push({
                    codigo: randomNumbers[index++],
                    premio: premio,
                    estado: 'libre',
                    fecha: null,
                    hora: null
                });
            }
        }

        // Insertar los datos en la colección
        await Codigo.insertMany(numerosGanadores);

        console.log('Datos inicializados en la colección "números" con números aleatorios');
    } catch (error) {
        console.error('Error al inicializar datos:', error);
    }
}

module.exports = connectDB;