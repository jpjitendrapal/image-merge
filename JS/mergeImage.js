// image converter
const mergeImages = require('merge-images');
const Canvas = require('canvas');

const fetch = require('node-fetch');
const download = require('image-downloader');


function mergeImage(imgPath, pogId){
    imageAr = [
        { src: imgPath, x: 0, y: 0, opacity: 1 },
        { src: './JS/srcImages/img2.png', x: 250, y: 20, opacity: 0.9, Height: 30, Width: 30 },
        { src: './JS/srcImages/img3.png', x: 20, y: 200, opacity: 0.9 }
      ];
    
      mergeImages(imageAr, {
      Canvas: Canvas,
      //width: 300,
      //height: 400, 
      //quality: 0.8 //Default: 0.92,
      format: 'image/jpg' // default 'image/png'
    })
    .then(function(b64){
      var base64Data = b64.replace(/^data:image\/png;base64,/, "");
      require("fs").writeFile("./JS/destImages/"+ pogId +".jpg", base64Data, 'base64', function(err) {
        // console.log("Successully created merge image ");
      });
    }
    )
    .catch(function(e){
      console.log("Couldn't load image",e);
    })
}


function downloadAndMerge(imgUrl, pogId){
    if(!imgUrl){
        console.log("Provide valid image url");
        return;
    }
    var options = {
        url: imgUrl, // 'https://n2.sdlcdn.com/imgs/g/4/g/large/2018_04_19-b7445.jpg',
        dest: './JS/srcImages/'+ pogId + '.jpg'  
      }
       
      download.image(options)
        .then(({ filename, image }) => {
        //   console.log('File saved to', filename);
          mergeImage(filename, pogId);
        })
        .catch((err) => {
          console.error(err)
        });
}

module.exports = {
    downloadAndMerge: downloadAndMerge
}