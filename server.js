const express = require('express');
const bodyParser = require('body-parser');

const config = require('./Config/config.json');
const database = require('./Database/database.js');
const apiRoutes = require('./Route/ApiRoutes.js');


let app = express();

app.listen(config.port, "localhost", () => {
    console.log(`Now listening on port ${config.port}`);
});

database.connect();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.get('/', function (req, res) {
    res.json({message: "Welcome to the Gatorloop backend."});
});