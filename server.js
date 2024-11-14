const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
// Connect to MongoDB
mongoose.connect('mongodb://localhost/task-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const path = require('path');
app.set('views', path.join(__dirname, 'views')); // ou le dossier contenant vos fichiers Twig

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('twig options', {
  allow_async: true,
  strict_variables: false
});

// Routes

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskUserRoutes = require('./routes/taskUserRoutes');


app.use('/', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/tasks_user', taskUserRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error.twig', { error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});