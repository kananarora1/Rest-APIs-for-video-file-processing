const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const authenticate = require('./middlewares/auth');

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(authenticate);