'use strict';

let express = require('express');
let path = require('path');

let app = express();

app.get('/api/cities/:term?', (req, res) => {
    res.send([
        {
            id: 1,
            text: 'Киев'
        }, {
            id: 2,
            text: 'Житомир'
        }
    ]);
});

app.get('/api/services/:term?', (req, res) => {
    res.send([
        {
            id: 1,
            text: 'Стрижка мужская'
        }, {
            id: 2,
            text: 'Стрижка женская'
        }
    ]);
});

app.use('/client', express.static(path.join(__dirname, '../client')));
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/app/index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/landing/index.html'));
});

app.listen(process.env.PORT || 3000);