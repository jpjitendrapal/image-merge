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

// resizeImg("./srcImages/629709575229.jpg",400,400)
// .then(function(){
//   console.log("done!!!");
// })

module.exports = {
  resizeImg: resizeImg
}