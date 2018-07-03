
const fs = require('fs');
var fetch = require('node-fetch');

function getImgData(imgUrl){
    fs.readFile('./destImages/1273890971.jpg', function(err, data) {
        if (err) throw err;
        uploadImg(data);
        // Encode to base64
        //var encodedImage = new Buffer(data, 'binary').toString('base64');
        // Decode from base64
        //var decodedImage = new Buffer(encodedImage, 'base64').toString('binary');
        });
}

function uploadImg(imgData){
    var cdnUrl = "https://n1.sdlcdn.com/save/image?prewarm=false&ispdffile=false&path=/imgs/a/b/c/myImg123.jpg";
    fetch(cdnUrl,
        {
            "credentials": "include",
            "headers": {},
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": imgData,
            "method": "POST",
            "mode": "cors",
            "data": binaryString
        }).then(function(res){
            console.log("Img uploaded");
        })
        .catch(function(e){
            console.log(e);
        });
}

module.exports = {
    uploadToCdn: getImgData
}