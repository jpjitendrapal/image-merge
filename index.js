var createImagesFromCSV = require('./JS/getProductDetail.js');

ImgConfig={
    csvFilePath: "./pogCsv/data.csv",
    CtSize: 600,
    IMGWidth: 450,
    IMGHeight: 450,
    PositionLeft: 110,
    PositionTop: 50,
    stensilType:'./stencils/500X500Test.png',
    srcFolder: "./srcImages/",
    destFolder: "./type1/",
    mrgBucket:"path=/imgs/a/b/c/" 
}

createImagesFromCSV.readPOG(ImgConfig.csvFilePath);

