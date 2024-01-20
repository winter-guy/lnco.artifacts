express = require('express');
data = require('./home/data');

app = express();
port = 3000;

app.use(express.json());

app.get('/api/users', (req, res) => {
  req;
  res.json(data.users);
});

app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`);
});
