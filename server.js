const express = require("express");
const config = require("./config.json");

var server = express();

server.listen(config.port, "localhost", () => {
  console.log(`Now listening on port ${config.port}`);
});

server.get('/', function (req, res) {
  res.json({message: "Welcome to the Gatorloop backend."});
})