// image converter
const mergeImages = require('merge-images');
const Canvas = require('canvas');
const download = require('image-downloader');
var gm = require('gm');
var fs = require('fs');
var img_counter = 1;

function downloadImage(imgUrl, pogId) {
    return new Promise(function (resolve, reject) {
        var options = {
            url: imgUrl,
            dest: ImgConfig.srcFolder + pogId + '.jpg'
        }

        download.image(options)
            .then(({ filename, image }) => {
                ri.resizeImg(filename, ImgConfig.IMGWidth, ImgConfig.IMGHeight)
                    .then(function () {
                        var data = {
                            imgUrl: filename,
                            pogId: pogId
                        }
                        resolve(data);
                    })
            })
            .catch((err) => {
                reject(err);
            });
    })
}

function mergeWithNudge(imgPath, pogId) {
    return new Promise(function (resolve, reject) {
        var imgWidth, imgHeight;
        gm(imgPath).size(function (err, size) {
            if (!err) {
                imgWidth = size.width;
                imgHeight = size.height;
                ImgConfig.PositionLeft = (ImgConfig.CtSize - imgWidth) / 2;
                ImgConfig.PositionTop = (ImgConfig.CtSize - imgHeight - ImgConfig.bottomOffset) / 2;
                imageAr = [
                    { src: ImgConfig.stensilType, x: 0, y: 0, opacity: 1 }
                    , { src: imgPath, x: ImgConfig.PositionLeft, y: ImgConfig.PositionTop, opacity: 1 }
                ];

                mergeImages(imageAr, {
                    Canvas: Canvas
                    //,width: 300
                    //,height: 400
                    , quality: 1 //Default: 0.92,
                    , format: 'image/jpg' // default 'image/png'
                })
                    .then(function (b64) {
                        var base64Data = b64.replace(/^data:image\/png;base64,/, "");
                        var imgUrl = ImgConfig.destFolder + pogId + ".jpg";
                        fs.writeFile(imgUrl, base64Data, 'base64', function (err) {
                            // console.log(img_counter + ". Successully created merge image for POG: " + pogId);
                            var data = {
                                imgUrl: imgUrl,
                                pogId: pogId
                            }
                            resolve(data);
                        });
                    }
                    )
                    .catch(function (e) {
                        console.log("Couldn't load image", e);
                    })

            }
        });
    })
}

module.exports = {
    downloadImage: downloadImage,
    mergeWithNudge: mergeWithNudge
}

