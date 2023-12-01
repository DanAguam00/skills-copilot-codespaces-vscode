// Create web server application
var express = require('express');
// Create express instance
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Require mongoose
var mongoose = require('mongoose');
// Connect to MongoDB
mongoose.connect('mongodb://localhost/message_board');
mongoose.Promise = global.Promise;
// Create Schema
var Schema = mongoose.Schema;
var PostSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 4},
    text: { type: String, required: true, minlength: 1},
    _comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true });
var CommentSchema = new mongoose.Schema({
    _post: {type: Schema.Types.ObjectId, ref: 'Post'},
    name: { type: String, required: true, minlength: 4},
    text: { type: String, required: true, minlength: 1}
}, {timestamps: true });
// Set our models by passing them their respective Schemas
mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);
// Store our models in variables
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
// Routes
// Root Request
app.get('/', function(req, res) {
    Post.find({}).populate('_comments').exec(function(err, posts) {
        res.render('index', {posts: posts});
    });
});
// Add post Route
app.post('/post', function(req, res) {
    console.log("POST DATA", req.body);
    var post = new Post({name: req.body.name, text: req.body.text});
    post.save(function(err) {
        if(err) {
            console.log('something went wrong');
            res.render('index', {errors: post.errors})
        } else {
            console.log('successfully added a post!');
            res.redirect('/');
        }
    });
});
// Add comment Route
app.post
