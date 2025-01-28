const topics = require("../db/data/test-data/topics");
const selectAllTopics = require("../models/model");

const getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
      console.log(topics, ">>>>>>>> topics");
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getAllTopics;
