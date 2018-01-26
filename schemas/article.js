var mongoose = require('mongoose');
var ArticleSchema = new mongoose.Schema({
    topic: String,
    content: String,
    author: String,
    createDate: Date
});

module.exports = ArticleSchema;