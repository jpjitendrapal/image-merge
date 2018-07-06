var fetch = require('node-fetch');
const fs = require('fs');
var CsvReadableStream = require('csv-reader');
var baseUrl = "https://mobileapi.snapdeal.com/service/get/product/getProductDetails?responseProtocol=PROTOCOL_JSON&requestProtocol=PROTOCOL_JSON&apiKey=snapdeal&productId=";
var pogList = [];

const MAXREQ = 5;
var parallelReqCount = 0;

function readCsvFile(csvFilePath) {
    return new Promise(function (resolve, reject) {
        var inputStream = fs.createReadStream(csvFilePath, 'utf8');
        var pogid;
        inputStream
            .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
            .on('data', function (row) {
                pogList.push(row[0]);
            })
            .on('end', function (data) {
                resolve(pogList);
            })
    });
}

function getProductUrl(pogId){
    return (baseUrl+pogId);
}

function getProductDetail(productUrl, pogId) {
    return new Promise(function (resolve, reject) {
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
                if (res.successful) {
                    // console.log(res);
                    var data = {
                        imgUrl: res.productDetailsSRO.imgs[0],
                        pogId: pogId
                    }
                    resolve(data);
                } else {
                    console.log("Unable to get product detail for: ", productUrl);
                    reject();
                }
            })
            .catch(function (e) {
                reject(e);
            })
    });
}

module.exports = {
    readCsvFile: readCsvFile,
    getProductUrl: getProductUrl,
    getProductDetail: getProductDetail
}
