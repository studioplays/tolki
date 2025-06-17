const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

// Serve file statici da 'public'
app.use(express.static(path.join(__dirname, 'public')));

const usersFile = path.join(__dirname, 'users.json');

function loadUsers() {
  if (!fs.existsSync(usersFile)) return {};
  try {
    return JSON.parse(fs.readFileSync(usersFile));
  } catch {
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Registrazione utente
app.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Compila tutti i campi.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password troppo corta.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Le password non corrispondono.' });
  }

  const users = loadUsers();

  if (users[email]) {
    return res.status(409).json({ message: 'Utente già registrato.' });
  }

  // Salva utente con subscription 'free' di default
  users[email] = { password, subscription: 'free' };
  saveUsers(users);

  res.json({ message: 'Registrazione riuscita.' });
});

// Login utente
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password richieste.' });
  }

  const users = loadUsers();
  const user = users[email];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credenziali errate.' });
  }

  res.json({ subscription: user.subscription || 'free' });
});

// Aggiorna subscription
app.post('/update-subscription', (req, res) => {
  const { email, subscription } = req.body;

  if (!email || !subscription) {
    return res.status(400).json({ message: 'Email e subscription richieste.' });
  }

  const users = loadUsers();

  if (!users[email]) {
    return res.status(404).json({ message: 'Utente non trovato.' });
  }

  users[email].subscription = subscription;
  saveUsers(users);

  res.json({ message: 'Subscription aggiornata.' });
});

app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});
