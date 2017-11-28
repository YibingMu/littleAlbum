var file = require('../models/file.js');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var sd = require('silly-datetime');

exports.showIndex = function(req, res, next){
    // res.render('index', {
    //     'albums': file.getAllAlbums()
    // });

    file.getAllAlbums(function (err, allAlbums) {
        if (err) {
            next();
            return;
        }
        res.render('index', {
            'albums': allAlbums
        });
    });

};

exports.showAlbum = function (req, res, next) {
    var albumName = req.params.albumName;
    file.getAllImagesByAlbumName(albumName, function (err, imagesArray) {
        if (err) {
            next();
            return;
        }
        res.render('album', {
            'albumName': albumName,
            'images': imagesArray
        })
    });
};

exports.showUp = function (req, res) {
    file.getAllAlbums(function (err, allAlbums) {
        if (err) {
            next();
            return;
        }
        res.render('up', {
            'albums': allAlbums
        });
    });
}

exports.doPost = function (req, res) {
    var form = new formidable.IncomingForm();

    form.uploadDir = path.normalize(__dirname + '/../tempup');

    form.parse(req, function(err, fields, files) {
        console.log(fields);
        console.log(files);

        if (err) {
            next();
            return;
        }

        var ttt = sd.format(new Date(), 'YYYYMMDDHHmm');
        var extname = path.extname(files.image.name);

        var folder = fields.folder;
        var oldpath = files.image.path;
        var newpath = path.normalize(__dirname + '/../uploads/' + folder + '/' + ttt + extname)
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send('rename failure');
            }
        });
    });

    res.send('Success');
    return;
}