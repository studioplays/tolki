const express = require('express');
const cors = require('cors');
const app = express();

// Dati demo utenti salvati in memoria (da sostituire con DB reale)
const users = [
  { email: 'admin@example.com', password: '511199', subscription: 'pro' }
];

// Middleware
app.use(cors()); // abilita CORS per tutte le origini
app.use(express.json()); // per leggere JSON dal body

// Route register
app.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Compila tutti i campi.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password deve contenere almeno 6 caratteri.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Le password non corrispondono.' });
  }
  // Controlla se utente già esiste
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Utente già registrato.' });
  }

  // Registra nuovo utente con piano free di default
  users.push({ email, password, subscription: 'free' });
  return res.json({ message: 'Registrazione completata!' });
});

// Route login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password richieste.' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenziali errate.' });
  }

  // Restituisci info abbonamento per redirect frontend
  return res.json({ subscription: user.subscription || 'free' });
});

// Porta di ascolto (per Render usa process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
