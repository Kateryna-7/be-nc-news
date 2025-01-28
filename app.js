const express = require("express");
const endpoints = require("./endpoints.json");
const getAllTopics = require("./controllers/controller");

const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

module.exports = app;
