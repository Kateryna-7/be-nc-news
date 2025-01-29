const { response } = require("../app");
const db = require("../db/connection");

const selectAllTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

const selectArticleByID = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article is not found",
        });
      } else {
        return response.rows[0];
      }
    });
};

const fetchAllArticlesByOrder = () => {
  return db
    .query(
      "SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC ;"
    )
    .then((response) => {
      return response.rows;
    });
};

module.exports = {
  selectAllTopics,
  selectArticleByID,
  fetchAllArticlesByOrder,
};
