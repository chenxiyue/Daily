var express = require('express');
var User = require('../models/user');
var Article = require('../models/article');
var router = express.Router();

/*首页*/
router.get('/', function (req, res) {
    Article.find().sort({'createDate': -1}).exec(function (err, allDoc) {
        if (err) {
            console.log("查询文章错误" + err);
        }

        Article.find().limit(3).exec(function (err, limitDoc) {
            if (err) {
                console.log("按条件查询文章错误" + err);
            }

            User.find().sort({'lastlogindate': -1}).exec(function (err, users) {
                if (err) {
                    console.log("查询用户时发生错误" + err);
                }

                res.render('index', {
                    title: '随时随地，记录一下',
                    articles: allDoc,
                    articles_recommended: limitDoc,
                    authors: users
                });
            });
        });
    });
});

/*处理判断登录的请求*/
router.post('/islogin', function (req, res) {
    if (req.cookies.user != null) {
        var data = {
            text: "existCookie",
            username: req.cookies.user.username
        };
        res.send(JSON.stringify(data));
    } else {
        res.send("noCookie");
    }
});

/*笔记编辑页，处理请求*/
router.post('/article', function (req, res) {
    if (req.cookies.user != null) {
        res.send("logined");
    } else {
        res.send("unlogined");
    }
});

/*笔记编辑页，进入页面*/
router.get('/article', function (req, res) {
    res.render('article', {
        title: '创建笔记',
        username: req.cookies.user.username
    });
});

/*处理登录请求*/
router.post('/login', function (req, res) {
    var userObj = req.body;

    User.findOne({
        username: userObj.username
    }, function (err, doc) {
        if (err) {
            res.send(500);
            console.log("网络错误");
        } else if (!doc) {
            res.send("wronguser");
            console.log("用户名不存在");
        } else {
            if (userObj.password != doc.password) {
                res.send("wrongpsw");
                console.log("密码不正确");
            } else {
                res.cookie('user', {
                    username: userObj.username,
                    password: userObj.password
                }, {
                    maxAge: 12 * 60 * 60 * 1000
                });
                res.send("success");
            }
        }
    });
});

/*处理注册请求*/
router.post('/register', function (req, res) {
    var _user;
    var userObj = req.body;

    User.findOne({
        username: userObj.username
    }, function (err, doc) {
        if (err) {
            res.send(500);
            console.log("网络错误");
        } else if (doc) {
            res.send("existed");
            console.log("用户名已存在");
        } else {
            _user = new User({
                username: userObj.username,
                password: userObj.password,
                lastlogindate: Date.now()
            });

            res.cookie('user', {
                username: userObj.username,
                password: userObj.password
            }, {
                maxAge: 12 * 60 * 60 * 1000
            });

            _user.save(function (err) {
                if (err) {
                    console.log(err);
                }
                res.send("success");
            });
        }
    });
});

/*注销请求*/
router.get('/logout', function (req, res) {
    res.clearCookie('user');
    res.redirect('/');
});

/*点击文章标题进入详情页面*/
router.get('/:id', function (req, res) {
    var id = req.params.id;

    Article.findById(id, function (err, doc) {
        if (err) {
            console.log("通过ID查询错误" + err);
        }
        var getAuthor = doc.author;

        Article.find({author: getAuthor}, function (err, docByAuthor) {
            if (err) {
                console.log("通过作者查询错误" + err);
            }
            var docLength = docByAuthor.length;

            res.render('detail', {
                title: doc.topic,
                detail_topic: doc.topic,
                detail_date: doc.createDate,
                detail_author: doc.author,
                detail_count: docLength,
                detail_content: doc.content
            });
        });
    });
});

module.exports = router;