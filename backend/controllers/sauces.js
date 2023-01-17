const Sauce = require('../models/sauces');
const fs = require('fs');
//const sauce = require('../models/sauce');

 exports.createSauce = (req, res, next) => {
  console.log(req.body)
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  console.log(sauceObject)
  //delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};
 

exports.getOneSauce = (req, res, next) => {
  console.log(req.body)
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
      console.log(sauce)
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
}; 

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

  exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};  






exports.LikeAndDislike = (req, res, next) => {
  console.log('je suis dans le controler like')


  //affichage du req.body
  console.log(req.body);

// recupéré l'id dans url de la requete
console.log(req.params);

//mise au formant de l'id pour aller chercher les donnée dans la base de donnée
console.log({_id : req.params.id})

//Aller chercher l'objet dans la base de donnée
Sauce.findOne({_id : req.params.id})
.then((objet) => {
  console.log("--->CONTENU resultat promise : objet");
  console.log(objet);
  //like = 1 (likes = +1)
  

  // si le userliked est False et si like === 1
 if (!objet.usersLiked.includes(req.body.userId) && req.body.like === 1){
console.log("-----> userId n'est pas dans la usersLiked BDD et requete front like a 1")
  /* else {
  console.log("false")
}  */

//mise à jour objet BDD
Sauce.updateOne(
  {_id : req.params.id},
  {
  $inc: {likes: 1},
  $push: {usersLiked: req.body.userId}
  }

)
.then(() => res.status(201).json({ message: "IDuser like +1"}))
.catch((error) => res.status(400).json({error}));

} /* else */

//like = 0 (lkes = 0, pas de vote)

  if (objet.usersLiked.includes(req.body.userId)  && req.body.like === 0){
  console.log("-----> userId est dans la usersLiked et like = 0");
  //}  
  
  //mise à jour objet BDD
  Sauce.updateOne(
    {_id : req.params.id},
    {
    $inc: {likes: -1},
    $pull: {usersLiked: req.body.userId}
    }
  
  )
  .then(() => res.status(201).json({ message: "IDuser like O"}))
  .catch((error) => res.status(400).json({error}));
  
} /* else */

//Like = -1 (dislikes = +1)

if (!objet.usersDisliked.includes(req.body.userId) && req.body.like === -1){
  console.log("-----> userId est dans la usersDisliked  et disLikes = 1")
    /* else {
    console.log("false")
  }  */
  
  //mise à jour objet BDD
  Sauce.updateOne(
    {_id : req.params.id},
    {
    $inc: {dislikes: 1},
    $push: {usersDisliked: req.body.userId}
    }
  
  )
  .then(() => res.status(201).json({ message: "Sauce disLike +1"}))
  .catch((error) => res.status(400).json({error}));

  } /* else */
// Après un like = -1 on met un like = 0, pas de vote on enlève le dislike
  
if (objet.usersDisliked.includes(req.body.userId)  && req.body.like === 0){
  console.log("-----> userId est dans  usersdisLiked et like = 0");
  //}  
  
  //mise à jour objet BDD
  Sauce.updateOne(
    {_id : req.params.id},
    {
    $inc: {dislikes: -1},
    $pull: {usersDisliked: req.body.userId}
    }
  
  )
  .then(() => res.status(201).json({ message: "IDuser dislike O"}))
  .catch((error) => res.status(400).json({error}));

  
  }
})



.catch((error) => {
  res.status(400).json({
    error: error
  });
});





}

//-------------------------------------------test de code--------------------------



