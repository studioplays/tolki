const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Funzioni di utilità per utenti (esempio)
const fs = require('fs');
const usersFile = './users.json';

function loadUsers() {
  if (!fs.existsSync(usersFile)) return {};
  return JSON.parse(fs.readFileSync(usersFile));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// API login esistente (non modificata)
app.post('/login', (req, res) => {
  // ... codice login esistente ...
  res.status(501).json({ message: 'Login non implementato qui' });
});

// Nuova API per aggiornare subscription
app.post('/update-subscription', (req, res) => {
  const { email, subscription } = req.body;

  if (!email || !subscription) {
    return res.status(400).json({ message: 'Email e subscription richieste' });
  }

  const users = loadUsers();

  if (!users[email]) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }

  users[email].subscription = subscription;
  saveUsers(users);

  res.json({ message: 'Subscription aggiornata' });
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
