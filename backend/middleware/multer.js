const multer = require('multer');

// Différents types d'images que l'ont peut obtenir
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ 
  destination: (req, file, callback) => { // enregistre l'image dans le dossier 'images' du back
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // enleve tout les espaces et crée un nom de fichier avec son extension
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// renvoie un fichier image unique
module.exports = multer({storage: storage}).single('image');