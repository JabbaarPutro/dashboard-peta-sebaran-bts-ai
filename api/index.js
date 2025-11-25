const express = require('express');
const cors = require('cors');
const app = express();
const btsRouter = require('./bts');

app.use(cors());
app.use(express.json());
app.use('/api/bts', btsRouter);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`API ready at :${PORT}`));