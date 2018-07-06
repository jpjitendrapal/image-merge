
const nudegType = "1_bank_offer_BG"; // update this value to the type of nudge you want to create


pd = require('./modules/getProductDetail.js');
mi = require('./modules/mergeImage');
ri = require('./modules/resizeImage');
upi = require('./modules/uploadImage');
var timeStamp = new Date();
timeStamp = timeStamp.getDate().toString() + (timeStamp.getMonth() + 1).toString() + timeStamp.getHours().toString() + timeStamp.getMinutes().toString() + timeStamp.getSeconds().toString();

var bOffset, IMGHeight=450, IMGWidth=450;
if(nudegType == "1_bank_offer_BG"){
    bOffset = 100;
    IMGWidth = 420;
    IMGHeight = 420;
} else if(nudegType == "2_Best_seller_BG"){
    bOffset = -100;
} else if(nudegType == "3_promo_1_BG"){
    bOffset = 90;
} else if(nudegType == "4_promo_2_BG"){
    bOffset = 90;
}

ImgConfig={
    csvFilePath: "./pogCsv/" + nudegType +".csv",
    stensilType:'./stencils/' + nudegType + '_600.png',
    finalCsvFileName: "./finalCsv/"+nudegType + "_" + timeStamp.toString() + ".csv",
    CtSize: 600,
    IMGWidth: IMGWidth, // resize image width after downloading from mobapi default url
    IMGHeight: IMGHeight, // resize image height after downloading from mobapi default url
    bottomOffset: bOffset,
    srcFolder: "./srcImg/" +nudegType+  "/",
    destFolder: "./destImg/" + nudegType +"/",
    mrgBucket:"/imgs/a/f/b/",
    upload: false, // make it false if do not want to upload on cdn
}

var baseUrlProduct = "https://mobileapi.snapdeal.com/service/get/product/getProductDetails?responseProtocol=PROTOCOL_JSON&requestProtocol=PROTOCOL_JSON&apiKey=snapdeal&productId=";

pd.readCsvFile(ImgConfig.csvFilePath)
.then(function(pogList){
    // console.log("Getting product detail");
    var counter = 1;
    while(pogList.length > 0){
        var pogId = pogList.pop();
        var url = baseUrlProduct+pogId;
        pd.getProductDetail(url, pogId)
        .then(function(data){
            // console.log("Downloading image...");
            return mi.downloadImage(data.imgUrl, data.pogId);
        })
        .then(function(data){
            // console.log("Merging with nudge..");
            return mi.mergeWithNudge(data.imgUrl, data.pogId);
        })
        .then(function(data){
            // console.log(data.imgUrl, data.pogId)
            if(ImgConfig.upload){
                // console.log("Uploading to cdn...");
                return upi.uploadImgToCdn(data.imgUrl, data.pogId);
            } else {
                return data.pogId;
            }
        })
        .then(function(pogId){
            if(ImgConfig.upload){
                // console.log("Writing to csv!");
                return upi.writeToCsv(pogId);
            } else{
                return pogId;
            }
        })
        .then(function(pogId){
            var text;
            if(ImgConfig.upload){
                text = counter + ". " +  "Image uploaded: https://n1.sdlcdn.com/imgs/a/f/b/" + pogId +"_stencil_fb.jpg";
            } else {
                text = counter + ". " + "Image created: "+ pogId;
            }
            console.log(text);
            counter++;
        })
    }
})

