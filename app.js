const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const express = require('express');
const expressSanitizer = require('express-sanitizer');
const app = express();


mongoose.connect('mongodb://localhost/blogapp');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

const blog = mongoose.model('blog', blogSchema);

app.get('/', function(req, res) {
  res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
  blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        blogs: blogs,
      });
    }
  });
});

app.get('/blogs/new', function(req, res) {
  res.render('new');
});

app.post('/blogs', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blogs');
    }
  });
});

app.get('/blogs/:id', function(req, res) {
  blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {
        blog: foundBlog,
      });
    }
  });
});

app.get('/blogs/:id/edit', function(req, res) {
  blog.findById(req.params.id, function(err, editBlog) {
    if (err) {
      console.log(err);
    } else {
      res.render('edit', {
        blog: editBlog,
      });
    }
  });
});

app.put('/blogs/:id', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

app.delete('/blogs/:id', function(req, res) {
  blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(3000, function() {
  console.log('Server has started');
});
