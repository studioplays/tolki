const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve la cartella public come statica
app.use(express.static(path.join(__dirname, 'public')));

// Rotta root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Endpoint login
app.post('/login', (req, res) => {
  // Simuliamo utenti per test
  const users = {
    'utente@example.com': { password: 'password123', subscription: 'free' },
    'pro@example.com': { password: 'password123', subscription: 'pro' },
  };

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password richiesti' });
  }

  if (!users[email]) {
    return res.status(401).json({ message: 'Utente non trovato' });
  }

  if (users[email].password !== password) {
    return res.status(401).json({ message: 'Password errata' });
  }

  return res.json({ message: 'Login riuscito', subscription: users[email].subscription });
});

// Catch all per pagine non trovate
app.use((req, res) => {
  res.status(404).send('Pagina non trovata');
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
