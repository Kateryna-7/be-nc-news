const { response } = require("../app");
const db = require("../db/connection");

const selectAllTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

module.exports = selectAllTopics;
