const mongoose = require('mongoose');

const numeroSchema = new mongoose.Schema({
    numero: { type: Number, required: true, unique: true },
    estado: { type: String, enum: ['libre', 'user_id'], required: true, default: 'libre' },
    premio: { type: String, enum: ['1 millón', '50 mil', '10 mil'], required: true },
    fecha: { type: Date },
    hora: { type: String },
});

const Numero = mongoose.model('Numero', numeroSchema);
module.exports = Numero;
