const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Render imposta la porta via variabile d’ambiente PORT
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files dalla cartella public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
  // ... codice come da esempio precedente ...
});

// Update subscription endpoint
app.post('/update-subscription', (req, res) => {
  // ... codice come da esempio precedente ...
});

app.use((req, res) => {
  res.status(404).send('Pagina non trovata');
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
