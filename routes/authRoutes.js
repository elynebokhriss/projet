const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Page d'inscription
router.get('/signup', (req, res) => res.render('signup.twig'));
router.post('/signup', authController.signup);

// Page de connexion
router.get('/', (req, res) => res.render('login.twig'));
router.post('/login', authController.login);
// Page d'édition de l'utilisateur
router.get('/edit/:id', authController.editUserPage);
router.post('/edit/:id', authController.updateUser);



// Page des utilisateurs (admin)
router.get('/users', authController.getUsers);

// Actions for updating and deleting users
router.post('/delete/:id', authController.deleteUser); // Corrected to use authController
router.post('/edit/:id', authController.updateUser);   // Corrected to use authController

// Page d'accueil après connexion pour les utilisateurs
router.get('/welcome', authController.welcome);

module.exports = router;


