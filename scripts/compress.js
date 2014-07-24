var images = require("gm");
var async = require("async");
var fs = require("fs");
var perpage = 50;

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
            continue;
        }
        photos.push('../public/pictures/origin/' + list.shift());
        perpage--;
    }
    done(null, {photos:photos, page:page});
  });
};
 
fs.mkdir('../public/pictures/compress/', function(err) {
    if (err && !err.code === 'EEXIST') return console.log(err);

    walk('../public/pictures/origin/', 1, perpage, batch);
})

var batch = function(err, result) {
    if (err) return console.log(err);
    var page = result.page;
    var paths = result.photos;
    if (!paths || paths.length === 0) return console.log('done');

    async.eachLimit(paths, 5, function(path, done){
        var img = images(path);
        img.size(function(err,size){
            if(err) return done(err);
        	console.log('compressing ' + path);
            img.thumb(1000, size.height/size.width*1000, path.replace('/pictures/origin', '/pictures/compress/'), 80, done);
        });
    }, function(err){
        if(err) return console.log(err);
        console.log('processed page ' + page);
        page++;
        process.nextTick(function() {
            walk('../public/pictures/origin', page, perpage, batch)
        });
    });
};
