const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

// Serve i file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

const users = {};

const ADMIN_USERNAME = 'AMMINISTRATORE99';
const ADMIN_PASSWORD = '511199';

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email e password richieste' });
  if (email.toUpperCase() === ADMIN_USERNAME) return res.status(400).json({ message: 'Username riservato' });
  if (users[email]) return res.status(400).json({ message: 'Utente già registrato' });

  users[email] = password;
  console.log('Utente registrato:', email);
  res.json({ message: 'Registrazione completata' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email e password richieste' });

  if (email.toUpperCase() === ADMIN_USERNAME) {
    if (password === ADMIN_PASSWORD) return res.json({ message: 'Login admin riuscito' });
    else return res.status(401).json({ message: 'Password admin errata' });
  }

  if (users[email] && users[email] === password) return res.json({ message: 'Login utente riuscito' });
  else return res.status(401).json({ message: 'Email o password errati' });
});

// Quando visiti la root manda login.html dalla cartella "public"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`✅ Server attivo su http://localhost:${port}`);
});