const express = require('express');
const auth = require('../middleware/auth'); // a verifier
// const auth = require('auth');
const router = express.Router();
const multer = require('../middleware/multer-config');


const saucesCtrl = require('../controllers/sauces');


//--------- Route pour créer un nouvel objet ----------

router.post('/', auth, multer, saucesCtrl.createSauce);

//--------Route pour voir un objet spécifique dans la base de données

router.get('/:id', auth, saucesCtrl.getOneSauce);


//-----------Route pour modification d'un objet existant

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//----------------Route pour supprimer un objet

router.delete('/:id', auth, saucesCtrl.deleteSauce);

//----------Route pour chercher les objets dans la base de données------------

router.get('/', auth, saucesCtrl.getAllSauce);

//-------------Route pour les likes et dislikes----------

router.post('/:id/like', auth, saucesCtrl.LikeAndDislike);

module.exports = router;