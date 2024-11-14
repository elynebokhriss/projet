const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription
exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Vérifier si l'utilisateur existe déjà avec le même nom d'utilisateur
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Nom d\'utilisateur déjà pris');
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).send('Email déjà utilisé');
    }

    // Créer un nouvel utilisateur
    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.redirect('/login'); // Redirection vers la page de connexion après inscription
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de l\'inscription');
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;  // Utilise l'email au lieu du username
  try {
    // Vérifier si l'utilisateur existe avec l'adresse email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Adresse email ou mot de passe incorrect');
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }); // Stocker le token dans un cookie

    // Rediriger en fonction du rôle de l'utilisateur
    res.redirect(user.role === 'admin' ? '/users' : '/welcome');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la connexion');
  }
};

// Déconnexion
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

// Liste des utilisateurs (pour les admins)
exports.getUsers = async (req, res) => {
  try {
    // Récupérer uniquement les utilisateurs avec le rôle 'user'
    const users = await User.find({ role: 'user' });
    res.render('users.twig', { users });
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur de récupération des utilisateurs');
  }
};

// Page d'accueil pour l'utilisateur connecté
exports.welcome = (req, res) => {
  res.render('welcome.twig', { user: req.user });  
};
// Update the user details
// Afficher la page de modification de l'utilisateur
exports.editUserPage = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    
    res.render('editUser.twig', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération de l'utilisateur");
  }
};
  
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, role } = req.body;

    await User.findByIdAndUpdate(userId, { username, email, role });
    res.redirect('/users'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user');
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.redirect('/users'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
};

