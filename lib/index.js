var fs = require('fs');
var config = require('../config');

exports.route = function(app) {
    app.get('/', function(req, res) {
        var u = req.param('u') || '';   
        var ctx = {};          
        if (req.session.password && req.session.password === config.password) 
            return res.redirect("/photos/");
  
        res.render('login');
    });

    app.post('/', function(req, res) {
        var pwd = req.param('pwd') || '';   
        if (pwd !== config.password) return res.redirect('/');
        req.session.password = pwd; 
        return res.redirect("/photos/");
    });

    app.get('/photos', function(req, res) {
        res.render('photos');
    });

    app.get('/data', function(req, res) {
        var page = req.param('p') || 0;   
        walk('public/pictures/', page, config.perpage, function(err, photos) {
            if (err) return res.json(err);
            res.json({ photos: photos });
        });
    });
};

var walk = function(dir, page, perpage, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pass = (page - 1) * perpage;
    var photos = [];
    while(list.length > 0 && perpage > 0) {
        if (pass > 0) {
            pass--;
            list.shift();
        }
        else {
            photos.push('/pictures/' + list.shift());
            perpage--;
        }
    }
    done(null, photos);
  });
};
