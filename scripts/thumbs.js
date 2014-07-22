var images = require("gm");
var async = require("async");
var fs = require("fs");
var perpage = 50;

var square = function(path,callback) {
    console.log('thumbing ' + path);

    var img = images(path);
    async.waterfall([
        function(next){
            img.size(next);
        },
        function(size, next){
            var shorter = size.width;
            var longer = size.height;
            var x = 0, y = (longer - shorter) / 2;
            if (size.width > size.height) {
                shorter = size.height;
                longer = size.width;
                x = (longer - shorter) / 2;
                y = 0;
            }   
            img = img.crop(shorter, shorter, x, y);
            next()
        },
        function(next){
            img.thumb(120, 120, path.replace('/pictures/origin/', '/pictures/square/'), 100, next);
        }
    ], callback);
}

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
 
fs.mkdir('../public/pictures/square/', function(err) {
    if (err && !err.code === 'EEXIST') return console.log(err);

    walk('../public/pictures/origin', 1, perpage, batch);
})

var batch = function(err, result) {
    if (err) return console.log(err);
    var page = result.page;
    var paths = result.photos;
    if (!paths || paths.length === 0) return console.log('done');
    async.eachLimit(paths, 5, function(path, done){
        square(path, done); 
    },function(err){
        if(err) return console.log(err);
        console.log('processed page ' + page);
        page++;
        process.nextTick(function() {
            walk('../public/pictures/origin', page, perpage, batch)
        });
    });
}
