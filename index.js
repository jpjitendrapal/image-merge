var createImagesFromCSV = require('./modules/getProductDetail.js');

ImgConfig={
    csvFilePath: "./pogCsv/data1.csv",
    CtSize: 600,
    IMGWidth: 450, // resize image width after downloading from mobapi default url
    IMGHeight: 450, // resize image height after downloading from mobapi default url
    stensilType:'./stencils/500X500Test.png',
    srcFolder: "./srcImages/",
    destFolder: "./destImages/",
    mrgBucket:"/imgs/a/b/c/",
    upload: false // make it false if do not want to upload on cdn
}

createImagesFromCSV.readPOG(ImgConfig.csvFilePath);

