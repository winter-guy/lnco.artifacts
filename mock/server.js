express = require('express');
data = require('./home/data');

fs = require('fs').promises;
path = require('path');

app = express();
port = 3000;

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json(data.users);
});

app.get('/api/articles', async (req, res) => {
  try {
    const articlesData = await fs.readFile(path.join(__dirname, './home/article.json'), 'utf-8');
    res.json(JSON.parse(articlesData));
  } catch (error) {
    console.error('Error reading articles.json', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`);
});