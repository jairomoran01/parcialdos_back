const mongoose = require('mongoose');

const numeroNoGanadorSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
});

const NumeroNoGanador = mongoose.model('NumeroNoGanador', numeroNoGanadorSchema);
module.exports = NumeroNoGanador;
