
const fs = require('fs');
var fetch = require('node-fetch');

var upload_count = 1;

function uploadImgToCdn(imgUrl, pogId) {
    return new Promise(function (resolve, reject) {
        if (!pogId) {
            console.log("Provide pogid while uploading image to mrg");
            reject();
        }
        fs.readFile(imgUrl, function (err, imgData) {
            if (err) {
                reject(err);
            };
            var cdnUrl = "https://n1.sdlcdn.com/save/image?prewarm=false&ispdffile=false&path=" + ImgConfig.mrgBucket + pogId + "_stencil_fb.jpg";
            fetch(cdnUrl,
                {
                    "credentials": "include",
                    "headers": {},
                    "referrerPolicy": "no-referrer-when-downgrade",
                    "body": imgData,
                    "method": "POST",
                    "mode": "cors",
                    "data": imgData
                }).then(function (res) {
                    var cdnImgUrl = "https://n1.sdlcdn.com" + ImgConfig.mrgBucket + pogId + "_stencil_fb.jpg";
                    // console.log("Image uploaded for pog id: " + pogId + " Url: " + cdnImgUrl);
                    resolve(pogId);
                })
                .catch(function (e) {
                    console.log(e);
                });
        });
    })
}

function writeToCsv(pogId){
    return new Promise(function(resolve, reject){
        var cdnImgUrl = "https://n1.sdlcdn.com" + ImgConfig.mrgBucket + pogId + "_stencil_fb.jpg";
        fs.appendFile(ImgConfig.finalCsvFileName, pogId + "," + cdnImgUrl + "\n", function (err) {
            if (err){
                reject(err);
            }
            resolve(pogId);
        });
    })
}

module.exports = {
    uploadImgToCdn: uploadImgToCdn,
    writeToCsv: writeToCsv
}