// image converter
const mergeImages = require('merge-images');
const Canvas = require('canvas');
const download = require('image-downloader');
// const ri = require('./JS/resizeImage.js'); 
var img_counter = 1;

function mergeImage(imgPath, pogId) {
    imageAr = [
        { src: ImgConfig.stensilType, x: 0, y: 0, opacity: 1 }
        , { src: imgPath, x: ImgConfig.PositionLeft, y: ImgConfig.PositionTop, opacity: 1 }
    ];

    mergeImages(imageAr, {
        Canvas: Canvas,
        //width: 300,
        //height: 400, 
        //quality: 0.8 //Default: 0.92,
        format: 'image/jpg' // default 'image/png'
    })
        .then(function (b64) {
            var base64Data = b64.replace(/^data:image\/png;base64,/, "");
            require("fs").writeFile(ImgConfig.destFolder + pogId + ".jpg", base64Data, 'base64', function (err) {
                console.log(img_counter + ". Successully created merge image for POG: " + pogId);
                img_counter++;
            });
        }
        )
        .catch(function (e) {
            console.log("Couldn't load image", e);
        })
}


function downloadAndMerge(imgUrl, pogId) {
    if (!imgUrl) {
        console.log("Provide valid image url");
        return;
    }
    var options = {
        url: imgUrl, // 'https://n2.sdlcdn.com/imgs/g/4/g/large/2018_04_19-b7445.jpg',
        dest: ImgConfig.srcFolder + pogId + '.jpg'
    }

    download.image(options)
        .then(({ filename, image }) => {
            ri.resizeImg(filename,ImgConfig.IMGWidth,ImgConfig.IMGHeight)
            .then(function(){
                mergeImage(filename, pogId);
            })
            
        })
        .catch((err) => {
            console.error(err)
        });
}

module.exports = {
    downloadAndMerge: downloadAndMerge
}