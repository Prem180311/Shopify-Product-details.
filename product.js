const path = require('path');
const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Shopify credentials
const apikey = 'be16bb250f1e902f3b72c6ce4d581250';
const password = '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';
const shop = '5-core.myshopify.com';
const endpoint = 'products';
const apiVersion = '2024-07';

// Health check route
app.get('/', (req, res) => res.send('Server is up'));

// Shopify data route
app.get('/getdata', (req, res) => {
  const url = `https://${apikey}:${password}@${shop}/admin/api/${apiVersion}/${endpoint}.json`;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Failed to fetch data from Shopify' });
    }

    if (response.statusCode !== 200) {
      console.error('Status Code:', response.statusCode, 'Body:', body);
      return res.status(response.statusCode).json({ error: 'Shopify API error', body });
    }

    try {
      const data = JSON.parse(body);
      res.status(200).json(data);
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      res.status(500).json({ error: 'Failed to parse Shopify response' });
    }
  });
});

// Start the server only once
app.listen(3400, () => {
  console.log('✅ Server running at http://localhost:3400');
});
