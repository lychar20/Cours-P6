const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');

const stuffRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path'); // (ca regle le pb d'en bas)

const app = express();
app.use(helmet({crossOriginResourcePolicy: false,}));

mongoose.connect('mongodb+srv://lychar20:borgiasOZ1664@cluster0.wzq2x9b.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  //------------Le code commence en dessous



  app.use('/api/sauces', stuffRoutes);   //app.use('/api/stuff', stuffRoutes);
  app.use('/api/auth', userRoutes); 
  app.use('/images', express.static(path.join(__dirname, 'images'))); // bug bient d'ici

module.exports = app;