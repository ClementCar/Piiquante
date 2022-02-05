const Sauce = require('../models/Sauce');
const fs = require('fs');


// création de sauce
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

// avoir toutes les sauces de la base de données
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

// avoir une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié '}))
        .catch(error => res.status(400).json({ error }));
};

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

// aimer ou non une sauce
exports.likeSauce = (req, res, next) => {
    if ( req.body.like === 0 ) {
        Sauce.findOne({ _id: req.params.id})
          .then(sauce => {
              if (sauce.usersLiked.includes(req.body.userId)) {
                  // $inc: Incrémente la valeur du champ de la quantité spécifiée
                  // $pull: Supprime tous les éléments de tableau qui correspondent à une requête spécifiée
                  Sauce.updateOne({ _id: req.params.id}, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }})
                    .then(() => res.status(200).json({ message: 'Like supprimé '}))
                    .catch(error => res.status(400).json({ error }));
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id}, { $inc: { likes: 1 }, $pull: { usersDisliked: req.body.userId }})
                    .then(() => res.status(200).json({ message: 'Dislike supprimé '}))
                    .catch(error => res.status(400).json({ error }));
              }
          })
          .catch(error => res.status(400).json({ error }));
    }
    if ( req.body.like === 1 ) {
        // push: Ajoute un élément à un tableau
        Sauce.updateOne({ _id: req.params.id }, {$inc: { likes: 1}, $push: { usersLiked: req.body.userId }}) 
            .then(() => res.status(200).json({ message: 'Sauce aimé '}))
            .catch(error => res.status(400).json({ error }));
    }
    if( req.body.like === -1 ) {
        Sauce.updateOne({ _id: req.params.id }, {$inc: { likes: -1 }, $push: { usersDisliked: req.body.userId }}) 
            .then(() => res.status(200).json({ message: 'Sauce non aimé '}))
            .catch(error => res.status(400).json({ error }));
    }
};