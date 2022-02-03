const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// Schéma des données reçu par login, connexion
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});


// Evite d'avoir plusieurs utilisateurs avec la même adresse mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);