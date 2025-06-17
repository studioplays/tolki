const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

const USERS_FILE = path.join(__dirname, 'users.json');

const ADMIN_USERNAME = 'AMMINISTRATORE99';
const ADMIN_PASSWORD = '511199';

// Helper functions
function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return {};
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    if (!data) return {};
    return JSON.parse(data);
  } catch (err) {
    console.error('Errore caricamento utenti:', err);
    return {};
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Errore salvataggio utenti:', err);
  }
}

// REGISTER
app.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword)
    return res.status(400).json({ message: 'Email, password e conferma password richieste' });

  if (password.length < 6)
    return res.status(400).json({ message: 'La password deve contenere almeno 6 caratteri' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Le password non corrispondono' });

  if (email.toUpperCase() === ADMIN_USERNAME)
    return res.status(400).json({ message: 'Username riservato' });

  const users = loadUsers();

  if (users[email])
    return res.status(400).json({ message: 'Utente già registrato' });

  // Salviamo l'utente con abbonamento free di default
  users[email] = { password, subscription: 'free' };

  saveUsers(users);

  console.log('Utente registrato:', email);
  res.json({ message: 'Registrazione completata' });
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email e password richieste' });

  // Login admin (solo controllo base)
  if (email.toUpperCase() === ADMIN_USERNAME) {
    if (password === ADMIN_PASSWORD) return res.json({ message: 'Login admin riuscito', subscription: 'admin' });
    else return res.status(401).json({ message: 'Password admin errata' });
  }

  const users = loadUsers();

  if (users[email] && users[email].password === password) {
    // Rispondiamo con subscription per la gestione frontend
    return res.json({ message: 'Login utente riuscito', subscription: users[email].subscription || 'free' });
  } else {
    return res.status(401).json({ message: 'Email o password errati' });
  }
});

// GET USERS (solo admin)
app.get('/users', (req, res) => {
  const loggedInAdmin = req.headers['x-admin'];
  if (loggedInAdmin !== ADMIN_USERNAME) {
    return res.status(403).json({ message: 'Accesso non autorizzato' });
  }

  const users = loadUsers();

  const usersList = Object.entries(users).map(([email, data]) => ({
    email,
    subscription: data.subscription || 'free'
  }));

  res.json(usersList);
});

// DELETE USER (solo admin)
app.post('/delete-user', (req, res) => {
  const loggedInAdmin = req.headers['x-admin'];
  if (loggedInAdmin !== ADMIN_USERNAME) {
    return res.status(403).json({ message: 'Accesso non autorizzato' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email richiesta' });
  }

  const users = loadUsers();

  if (!users[email]) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }

  delete users[email];
  saveUsers(users);

  res.json({ message: 'Utente eliminato' });
});

// ROOT serve login.html (dopo static)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`✅ Server attivo su http://localhost:${port}`);
});
