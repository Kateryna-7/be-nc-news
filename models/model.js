const { response } = require("../app");
const db = require("../db/connection");

const selectAllTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

const selectArticleByID = (article_id) => {
  console.log("srt 2");
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((response) => {
      return response.rows[0];
    });
};

module.exports = { selectAllTopics, selectArticleByID };
