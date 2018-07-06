var gm = require('gm');

function resizeImg(imgUrl, width, height){
  return new Promise(function(resolve, reject){
    gm(imgUrl)
    .resize(width, height)
    .noProfile()
    .write(imgUrl, function (err) {
      if (err){
          reject();
      } else {
        resolve();
      }
    });
  })  
}
module.exports = {
  resizeImg: resizeImg
}