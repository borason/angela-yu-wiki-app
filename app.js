/* jshint esversion: 6 */
/* jshint asi: true */
/*jshint strict:false */

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")

const app = express()

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
})

const articleSchema = mongoose.Schema({
  title: String,
  content: String
})

const Article = mongoose.model("Article", articleSchema)


app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static("public"))

app.route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (err) {
        res.send(err)
      } else {
        res.send(foundArticles)
      }
    })
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })

    newArticle.save((err) => {
      if (!err) {
        console.log("Successfully saved article to database.")
      } else {
        res.send(err)
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all articles")
      } else {
        res.send(err)
      }
    })
  })

app.route("/articles/:articleTitle")

  .get((req, res) => {

    Article.findOne({
      title: req.params.articleTitle
    }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle)
      } else {
        res.send("No articles matching that title was found.");
      }
    })
  })

  .put((req, res) => {

    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      (err) => {
        if (!err) {
          res.send("Successfully updated the selected article.");
        }
      }
    )
  })
  .patch((req, res) => {
    Article.update({
        title: req.params.articleTitle,
      }, {
        $set: req.body
      },
      (err) => {
        if (!err) {
          res.send("Successfully updated article")
        } else {
          res.send(err)
        }
      })
  })
  .delete((req, res) => {
    Article.deleteOne({
      title: req.params.articleTitle
    }, (err) => {
      if (!err) {
        res.send("Successfully deleted corresponding article")
      } else {
        res.send(err)
      }
    })
  })

app.listen(3000, () => console.log("Server started on port 3000"))