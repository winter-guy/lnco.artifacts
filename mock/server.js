express = require('express');
data = require('./home/data');
cors = require('cors');

fs = require('fs').promises;
path = require('path');

app = express();
port = 3000;

app.use(express.json());
app.use(cors());

app.get('/api/users', (req, res) => {
  res.json(data.users);
});

app.get('/api/v2/fetch', async (req, res) => {
  try {
    const articlesData = await fs.readFile(path.join(__dirname, './home/article.json'), 'utf-8');
    res.json(JSON.parse(articlesData));
  } catch (error) {
    console.error('Error reading articles.json', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/v2/artifacts', async (req, res) => {
  try {
    const { id } = req.query; // Extract the 'id' parameter from the query string

    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }

    const articlesData = await fs.readFile(path.join(__dirname, './home/artifact.json'), 'utf-8');
    const parsedData = JSON.parse(articlesData);
    
    // Assuming there's an 'artifact' property in the parsed data
    const artifact = parsedData;

    if (artifact.id === id) {
      res.json(artifact);
    } else {
      res.status(404).json({ error: 'Artifact not found' });
    }
  } catch (error) {
    console.error('Error reading or parsing artifact.json', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`);
});