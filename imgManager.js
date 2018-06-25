/* jshint esversion: 6 */
/* jshint node: true */

const fs = require('fs');
const path = require('path');

const dotRx = /(^\.\w+)/g;

// Not really needed
function hideDotFiles(files, cb) {
  files.forEach(function(file) {
    if (file.match(dotRx)) {
      let index = files.indexOf(file);
      files.splice(index, 1);
    }
  });

  return cb(files);
}

// The callback is just to be sure that the file only gets uploaded after the current profile picture is deleted
module.exports.update = (filePath, id, cb) => {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      return console.log(err);
    } else {

        hideDotFiles(files, (result) => {
          result.forEach((file) => {
            let fName = path.basename(file, path.extname(file));

            if (fName == id) {

              fs.unlink(`${filePath}/${file}`, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  return cb();
                }
              });
            }
          });
        });
      return cb();
    }
  });
};

module.exports.tryFind = (filePath, id, cb) => {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      return console.log(err);
    }

      hideDotFiles(files, (result) => {
        // console.log(result)
        let file = result[id - 1];
        if (result.length > 0 && file !== undefined) {

        // console.log(file)
        let fName = path.basename(file, path.extname(file));

        if (fName == id) {
          return cb(file);
        } else {
          return cb(null);
    }
  } else {
    return cb(null);
  }
});
});
};

module.exports.isValid = (file, cb) => {
  const types = /jpg|jpeg|png/;

  let checkExt = types.test(path.extname(file.originalname).toLowerCase());
  let checkMime = types.test(file.mimetype);

  if (checkExt && checkMime) {
    return cb(null, true);
  } else {
    console.log()
    return cb('You can only upload images of the type jpg, jpeg, png', false);
  }
}
