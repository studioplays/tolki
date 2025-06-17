const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve i file statici nella cartella public
app.use(express.static(path.join(__dirname, 'public')));

// Se qualcuno visita la root, serve login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Esempio API login (da adattare alla tua logica)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // TODO: metti qui la logica di controllo login (es. controlla users.json)
  
  if(email === 'admin@example.com' && password === '123456'){
    return res.json({ subscription: 'pro' });
  }
  
  res.status(401).json({ message: 'Credenziali errate' });
});

// Per tutte le altre rotte che non esistono
app.use((req, res) => {
  res.status(404).send('Pagina non trovata');
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
