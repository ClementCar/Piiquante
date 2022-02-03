const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// Création de nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // crypte le mot de passe en faisant 10 tours dans la fonction hash
    .then(hash => {
        const user = new User({ // crée un utilisateur grace au modele
          email: req.body.email,
          password: hash
        });
        user.save() // enregistre le nouvel utilisateur dans la base de données
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // recherche l'email dans la base de données
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // Cherche si l'encryptage du mot de passe est fait à partir de la même base
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({ // Création de token d'authentification 
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};