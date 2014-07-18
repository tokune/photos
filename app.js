var express = require('express');
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

require('./lib/index').route(app);

app.listen(config.port);
