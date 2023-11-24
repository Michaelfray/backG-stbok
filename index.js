const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let users = [];

try {
  const data = fs.readFileSync('users.json', 'utf8');
  if (data) {
    users = JSON.parse(data);
  }
} catch (err) {
  console.error('Fel vid läsning av filen:', err);
}

const dirname = __dirname;

app.get('/', (req, res) => {
  res.sendFile(dirname + '/guestbook.html');
});

app.post('/submit', (req, res) => {
  const { name, email, phonenumber, homepage, message } = req.body;
  users.push({ name, email, phonenumber, homepage, message });

  fs.writeFile('users.json', JSON.stringify(users), (err) => {
    if (err) {
      console.error('Fel vid skrivning till filen:', err);
      return res.status(500).send('Serverfel');
    }
    res.redirect('/');
  });
});

app.get('/users', (req, res) => {
  res.json(users);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
