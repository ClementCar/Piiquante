const Sauce = require('../models/Sauce');


// création de 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, // Copie les champs de la requête sans l'id car il va être génerer pas mongoDB
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Crée L'url de l'image
    });
    sauce.save()
        .then(() => res.status(201).json({ message : 'Sauce enregistré '}))
        .catch(error => res.status(400).json({ error })); 
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}