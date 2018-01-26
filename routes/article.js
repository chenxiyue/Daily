var express = require('express');
var Article = require('../models/article');
var router = express.Router();

router.post('/new', function (req, res) {
    var _article;
    var articleObj = req.body;
    var usercookie = req.cookies.user.username;

    _article = new Article({
        topic: articleObj.data_topic,
        content: articleObj.data_content,
        author: usercookie,
        createDate: Date.now()
    });

    _article.save(function (err) {
        if (err) {
            alert("文章保存失败");
        }
        res.send("success");
    });
});

module.exports = router;