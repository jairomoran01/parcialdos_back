const mongoose = require('mongoose');

const numeroSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    estado: { type: String, enum: ['libre', 'quemado'], default: 'libre' },
    premio: { type: Number, required: true },
    fecha: { type: Date, default: Date.now },
});

const Numero = mongoose.model('Numero', numeroSchema);
module.exports = Numero;