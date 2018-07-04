
const fs = require('fs');
var fetch = require('node-fetch');

var upload_count = 1;
function getImgData(imgUrl, pogId){
    if(!pogId){
        console.log("Provide pogid while uploading image to mrg");
        return;
    }
    fs.readFile(imgUrl, function(err, data) {
        if (err) throw err;
        uploadImg(data, pogId);
        // Encode to base64
        //var encodedImage = new Buffer(data, 'binary').toString('base64');
        // Decode from base64
        //var decodedImage = new Buffer(encodedImage, 'base64').toString('binary');
        });
}

function uploadImg(imgData, pogId){
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
        }).then(function(res){
            console.log(upload_count + ". Img uploaded for pog id: "+pogId + " Url: https://n1.sdlcdn.com"+ImgConfig.mrgBucket + pogId + "_stencil_fb.jpg");
            upload_count++;
        })
        .catch(function(e){
            console.log(e);
        });
}

module.exports = {
    uploadToCdn: getImgData
}