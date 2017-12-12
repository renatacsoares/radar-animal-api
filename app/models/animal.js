var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AnimalSchema   = new Schema({
    tipo: String,
    situacao: String,
    endereco: String
});

module.exports = mongoose.model('Animal', AnimalSchema);
