var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var crypto       = require('crypto');

var UsuarioSchema   = new Schema({
    nome: String,
    login: String,
    senhaHasheada: String,
    salt: String,
    email: String,
    cpf: Number,
    rg: Number,
    endereco: String,
    complemento: String,
    cidade: String,
    estado: String
});

UsuarioSchema
  .virtual('senha')
  .set(function(senha) {
    this._senha = senha;
    this.salt = this.makeSalt();
    this.senhaHasheada = this.encryptPassword(senha);
  })
  .get(function(){
    return this._senha;
  });

UsuarioSchema.methods = {
  authenticate: function(senhaAberta) {
    return this.encryptPassword(senhaAberta) == this.senhaHasheada;
  },

  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
