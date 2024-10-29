const mongoose = require('mongoose');

const codigoSchema = new mongoose.Schema({
    codigo: { type: String, required: true },
    premio: { type: String, required: true },
    estado: { type: String, enum: ['libre', 'user_id'], required: true },
    fecha: { type: Date, default: Date.now },
});

const Codigo = mongoose.model('Codigo', codigoSchema);
module.exports = Codigo;
