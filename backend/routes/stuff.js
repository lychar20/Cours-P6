const express = require('express');
const auth = require('../middleware/auth'); // a verifier
// const auth = require('auth');
const router = express.Router();
const multer = require('../middleware/multer-config');


const stuffCtrl = require('../controllers/stuff');


//--------- Route pour créer un nouvel objet ----------

router.post('/', auth, multer, stuffCtrl.createThing);

//--------Route pour voir un objet spécifique dans la base de données

router.get('/:id', auth, stuffCtrl.getOneThing);


//-----------Route pour modification d'un objet existant

router.put('/:id', auth, multer, stuffCtrl.modifyThing);

//----------------Route pour supprimer un objet

router.delete('/:id', stuffCtrl.deleteThing);

//----------Route pour chercher les objets dans la base de données------------

router.get('/', auth, stuffCtrl.getAllStuff);

module.exports = router;