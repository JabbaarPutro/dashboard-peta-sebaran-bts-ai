const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'bts-data.json'), 'utf8'));
  res.json(data);
});

module.exports = router;