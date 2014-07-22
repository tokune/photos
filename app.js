var express = require('express');
var async = require('async');
var fs = require('fs');
var config = require('./config');
var session = require('express-session');
var bodyParser = require('body-parser');
var login_middleware = require('./lib/middleware').login_middleware;
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret            : config.sessionSecret,
    resave            : true,
    saveUninitialized : true
}))
app.use(login_middleware);

app.use(function(req, res, next) {
    var ctx = {};
    async.waterfall([
        function(done) {
            fs.exists('public/pictures/square', function(exists) {
                ctx.square = exists;
                done();
            });
        },
        function(done) {
            fs.exists('public/pictures/origin', function (exists) {
                ctx.origin = exists;
                if (exists) req.picPath = 'origin';
                done();
            });
        },
        function(done) {
            fs.exists('public/pictures/compress', function (exists) {
                ctx.compress = exists;
                if (exists) req.picPath = 'compress';
                done();
            });
        },
    ], function() {
        if (!ctx.origin && !ctx.origin) return res.json({err: 'Has no picture.Please place you origin pictures to path \
                                                        public/pictures/origin.If you need to compress, run scripts/compress.js after you place you picture.'});
        if (!ctx.square) return res.json({err: 'Has no thumb picture.Please run scripts/thumbs.js after you place you picture.'});

        next();
    });
});

require('./lib/index').route(app);

app.listen(config.port);
