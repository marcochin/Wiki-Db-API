const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

// Use the urlencoded option to access values sent in forms,
// extended true means you can post nested objects??
app.use(bodyParser.urlencoded({
  extended: true
}));

// Setup mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = new mongoose.model("Article", articleSchema);

// Routes targeting all articles
app.route("/articles")
  // GET
  .get(function(req, res) {
    Article.find(function(err, articles) {
      if (err) {
        res.send(err);
      } else {
        res.send(articles);
      }
    });
  })
  // POST
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article.");
      }
    });
  })
  // DELETE
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles.");
      }
    });
  });

// Routes targeting a specific article
app.route("/articles/:articleTitle")
  // GET
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, article) {
      if (err) {
        res.send(err);
      } else {
        res.send(article);
      }
    });
  })
  // PUT
  .put(function(req, res) {
    Article.replaceOne( //update is deprecated, use replaceOne
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err, writeOpResult){
        if(err){
          res.send(err);
        }else{
          if(writeOpResult.nModified === 1){
            res.send("Article updated successfully.");
          }else{
            res.send("Article not found. Update failed.");
          }
        }
      }
    );
  })
  // PATCH
  .patch(function(req, res) {
    Article.updateOne( //update is deprecated, use updateOne
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {omitUndefined: true},
      function(err, writeOpResult){
        if(err){
          res.send(err);
        }else{
          if(writeOpResult.nModified === 1){
            res.send("Article updated successfully.");
          }else{
            res.send("Article not found. Update failed.");
          }
        }
      }
    );
  })
  // DELETE
  .delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Article successfully deleted.");
      }
    });
  });

app.listen(3000, function() {
  console.log("Server started on 3000");
});
