var fetch = require('node-fetch');
var mi = require('./mergeImage');
ri = require('./resizeImage');
uploadImage = require('./uploadImage'); 
const fs = require('fs');
var CsvReadableStream = require('csv-reader');
var baseUrl = "https://mobileapi.snapdeal.com/service/get/product/getProductDetails?responseProtocol=PROTOCOL_JSON&requestProtocol=PROTOCOL_JSON&apiKey=snapdeal&productId=";
var pogList=[];

const MAXREQ=5;
var parallelReqCount = 0;
function createImage(productUrl, pogid) {
    if(parallelReqCount > MAXREQ){
        return;
    }
    parallelReqCount++;
    fetch(productUrl,
        {
            "credentials": "include",
            "headers": {},
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors"
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            var productDetail = res;
            parallelReqCount--;
            if (productDetail.successful) {
                var imgUrl = productDetail.productDetailsSRO.imgs[0];
                var pogId = productDetail.productDetailsSRO.basePogId;
                // imgUrl = imgUrl.replace("large","fashion_85b_pdp");
                mi.downloadAndMerge(imgUrl, pogId);
                if(pogList.length > 0){
                    let pogid = pogList.pop();
                    createImage(baseUrl+pogid, pogid);
                }
            } else {
                console.log("Unable to get product detail for: ", productUrl);
            }
        })
        .catch(function(e){
            parallelReqCount--;
            pogList.push(pogid);
            console.log("Unable to fetch");
            if(pogList.length > 0){
                let pogid = pogList.pop();
                createImage(baseUrl+pogid, pogid);
            }
        })
}

// var pogList = [680673440602,620665329699,1273890971,663785543633,668559738219,645423814437];
function readPOG(csvFilePath){
    var inputStream = fs.createReadStream(csvFilePath, 'utf8'); 
    var pogid;
    inputStream
        .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            pogList.push(row[0]);
        })
        .on('end', function (data) {
            while(pogList.length>0 && parallelReqCount < MAXREQ){
                pogid = pogList.pop();
                createImage(baseUrl+pogid, pogid);
            }
        });
}


module.exports = {
    readPOG: readPOG
}
    