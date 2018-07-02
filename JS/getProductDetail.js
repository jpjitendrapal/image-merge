

var fetch = require('node-fetch');
var mi = require('./mergeImage');
const fs = require('fs');
var CsvReadableStream = require('csv-reader');
var baseUrl = "https://mobileapi.snapdeal.com/service/get/product/getProductDetails?responseProtocol=PROTOCOL_JSON&requestProtocol=PROTOCOL_JSON&apiKey=snapdeal&productId=";
var pogList=[];

function createImage(productUrl) {
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
            if (productDetail.successful) {
                var imgUrl = productDetail.productDetailsSRO.limgs[0];
                var pogId = productDetail.productDetailsSRO.basePogId;
                // console.log("Downloaded image for POG: ", pogId, "Img Url: ", imgUrl);
                mi.downloadAndMerge(imgUrl, pogId);
                if(!!pogList.length){
                    createImage(baseUrl+pogList.pop());
                }
            } else {
                console.log("Unable to get product detail for: ", productUrl);
            }
            // console.log(myJson);
        })
        .catch(function(e){
            console.log(e);
        })
}

// var pogList = [680673440602,620665329699,1273890971,663785543633,668559738219,645423814437];
function readPOG(){
    var inputStream = fs.createReadStream('./pogCsv/data2.csv', 'utf8'); 
    inputStream
        .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            // console.log('A row arrived: ', row);
            pogList.push(row[0]);
            console.log(pogList);
        })
        .on('end', function (data) {
            for(var i in pogList){
                console.log("Creating image", pogList);
                createImage(baseUrl+pogList.pop());
            }
        });
}


module.exports = {
    readPOG: readPOG
}
    



