// ###################################################
// Indicator
const ALWAYS_TRUE = true;
const ALWAYS_FALSE = false;

var IsNewEventCard = true;
const IsDailyCoEnable = ALWAYS_TRUE;
var IsOnVideoResume = ALWAYS_FALSE;
var IsRecruiterNewHall = ALWAYS_TRUE;
var IsNewHall = ALWAYS_TRUE;
const IsGruveoEnable = ALWAYS_FALSE;

// if (typeof location !== "undefined") {
//     IsNewHall = location.href.indexOf("new=1") >= 0 ? true : false;
//     console.log("location.href", location.href);
//     console.log("IsNewHall", IsNewHall);
// }

// Indicator
// ###################################################

console.log("environment - " + process.env.NODE_ENV);
var Domain = "https://seedsjobfairapp.com/";

var isProd = (process.env.NODE_ENV === "production"); // that is deployed to server
var isProdLocal = (process.env.NODE_ENV === "production-local"); // build for local server
const SocketUrl = (isProd) ? `${Domain}/socket` : "http://localhost:6000";

const RootPath = (isProd) ? "/cf" : "";
const AppPath = RootPath + "/app";
var SiteUrl = (isProd) ? `${Domain}/cf` : "http://localhost:4000";
var AssetUrl = (isProd) ? `${Domain}/public` : SiteUrl;
var AssetCustomUrl = AssetUrl + "/asset/custom/";
var UploadUrl = AssetUrl + "/upload";
var StaticUrl = AssetUrl + "/static";
var ImageUrl = AssetUrl + "/asset/image";
var DocumentUrl = AssetUrl + "/asset/document";
var AudioUrl = AssetUrl + "/asset/audio";
var DailyCoCreateRoomUrl = SiteUrl + "/daily-co/create-room";
var ZoomCreateRoomUrl = SiteUrl + "/zoom/create-meeting";
var ZoomCheckMeetingExpiredUrl = SiteUrl + "/zoom/is-expired";
var EmailPhpAdmin = ((isProd) ? Domain : "http://localhost:8085/cf-app/server") + `/php-api/email/email.php`;
const TermsAndConditionUrl = `${DocumentUrl}/privacy-policy-2020-2.pdf`;


var RootUrl = (process.env.NODE_ENV === "development-wp") ? "http://localhost:8085" : "http://localhost:80";
if (isProd) {
    RootUrl = `https://seedsjobfairapp.com`;
}

var LandingUrl = `https://seedsjobfairapp.com`;

var PHPApi = (isProd) ? `https://seedsjobfairapp.com/php-api/` : RootUrl + `/cf-app/server/php-api/`;
var PHPNotificationApi = (isProd) ? `https://seedsjobfairapp.com/notification-cf-app/public/` : RootUrl + `/notification-cf-app/public/`;
var WPAjaxApi = (isProd) ? "https://seedsjobfairapp.com/career-fair/wp-admin/admin-ajax.php" : RootUrl + "/career-fair/wp-admin/admin-ajax.php";

const AppConfig = {
    HeaderIconUrl: "https://seedsjobfair.com/virtual-fairs",
    Name: `Virtual Career Fair ${(new Date()).getYear() + 1900}`,
    Desc: "Powered by Seeds",
    Url: (isProd || isProdLocal) ? PHPApi : "http://localhost:8080",
    Api: SiteUrl,
    PHPApi: PHPApi,
    PHPNotificationApi: PHPNotificationApi,
    FbAppId: "315194262317447",
    FbPageId: "488956294912178", // seedsjobfair
    WPAjaxApi: WPAjaxApi,
    FbUrl: "https://www.fb.com/innovaseedssolutions",
    WwwUrl: "https://seedsjobfairapp.com"
};


const ImgConfig = {
    AppIcon: AssetUrl + "/asset/image/seeds.png",
    AppIconFooter: AssetUrl + "/asset/image/seeds-footer.png",
    IsIcon: AssetUrl + "/asset/image/innovaseed.png",
    IsIconInverse: AssetUrl + "/asset/image/innovaseed_inverse.png",
    DefUser: AssetUrl + "/asset/image/default-user.png",
    DefCompany: AssetUrl + "/asset/image/default-company.jpg",
    DefCompanyBanner: AssetUrl + "/asset/image/default-company-banner.jpg",
    DefUserBanner: AssetUrl + "/asset/image/default-user-banner.jpg",
    getFlag: (country, size) => AssetUrl + `/asset/image/flags/${size}/${country}.png`, // www.icondrawer.com -- flag
    getBanner: (filename) => AssetUrl + `/asset/image/banner/${filename}`,
    getLogo: (filename) => AssetUrl + `/asset/image/logo/${filename}`
};

//email like '%test.%'
const TestUser = [136,
    137,
    222, 223, 224, 225, 226, 227, 316, 317, 318, 319,
    320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334,
    335, 336, 337, 338, 339, 340, 341, 342
];

const OverrideComingSoonUser = [136, 137]
const SupportUserID = 681;

var HeaderClass = "";
var FooterClass = "";
if (!isProd) {
    // HeaderClass = "app-hidden";
    // FooterClass = "app-hidden";
}

module.exports = {
    EmailPhpAdmin,
    IsNewEventCard,
    HeaderClass,
    TermsAndConditionUrl,
    IsOnVideoResume,
    FooterClass,
    IsDailyCoEnable,
    DailyCoCreateRoomUrl,
    ZoomCreateRoomUrl,
    ZoomCheckMeetingExpiredUrl,
    IsGruveoEnable,
    SocketUrl,
    LandingUrl,
    DocumentUrl,
    TestUser,
    OverrideComingSoonUser,
    RootPath,
    AppPath,
    StaticUrl,
    SupportUserID,
    SiteUrl,
    AudioUrl,
    UploadUrl,
    AppConfig,
    ImgConfig,
    ImageUrl,
    IsNewHall,
    IsRecruiterNewHall,
    AssetCustomUrl
};



// function helloGold() {
//     const returnInv = 10;
//     const buyFee = 2.81;
//     const sellFee = 4.04;

//     let modal = 100;
//     let pPerG = 173.07;
//     let gEarn = modal * (100 - buyFee) / pPerG / 100;

//     var newPPerG = 0;
//     var rmEarned = 0;
//     for (var i = 1; i <= 1000; i++) {
//         newPPerG = pPerG + i;
//         rmEarned = newPPerG * gEarn * (100 - sellFee) / 100;
//         if (rmEarned > (modal * (100 + returnInv) / 100)) {
//             break;
//         }
//     }
//     console.log("buyP", pPerG, "||", "sellP :", newPPerG, "||", "rmEarned :", rmEarned);
// }
// helloGold();

// let xx = `
// 1642
// 1641
// 1639
// 1634
// 1633
// 1628
// 1625
// 1617
// 1614
// 1607
// 1604
// 1597
// 1596
// 1592
// 1591
// 1590
// 1588
// 1587
// 1586
// 1584
// 1581
// 1578
// 1577
// 1572
// 1568
// 1564 
// 1563
// 1561
// 1558
// 1557
// 1555
// 1554
// 1552
// 1543
// 1540
// 1539
// 1536
// 1535
// 1531
// 1526
// 1525
// 1524
// 1523
// 1522
// 1518
// 1509
// 1508
// 1507
// 1505
// 1504
// 1502
// 1501
// 1500
// 1499
// 1498
// 1497
// 1496
// 1495
// 1491
// 1490
// 1489
// 1482
// 1481
// 1478
// 1470
// 1469
// 1466
// 1462
// 1456
// 1455
// 1453
// 1451
// 1450
// 1447
// 1444
// 1442
// 1438
// 1435
// 1433
// 1432
// 1431
// 1428
// 1426
// 1423
// 1421
// 1417
// 1416
// 1414
// 1413
// 1411
// 1408
// 1403
// 1402
// 1401
// 1399
// 1398
// 1395
// 1392
// 1391
// 1389
// 1388
// 1387
// 1386
// 1383
// 1375
// 1374
// 1373
// 1372
// 1369
// 1368
// 1367
// 1365
// 1363
// 1361
// 1360
// 1358
// 1355
// 1353
// 1351
// 1350
// 1349
// 1341
// 1339
// 1335
// 1332
// 1328
// 1324
// 1323
// 1320
// 1318
// 1314
// 1313
// 1308
// 1302
// 1297
// 1296
// 1295
// 1294
// 1292
// 1291
// 1289
// 1284
// 1279
// 1273
// 1272
// 1268
// 1263
// 1262
// 1260
// 1259
// 1257
// 1253
// 1250
// 1248
// 1247
// 1244
// 1242
// 1241
// 1238
// 1234
// 1229
// 1221
// 1217
// 1040
// 873

// `
// xx = xx.split("\n");
// let sqlIn = "";
// for(var k in xx){
//     if(xx[k] != ""){
//         sqlIn += xx[k] +", ";
//     }
// }
// sqlIn += "999999";

// console.log(`
// select * from wp_cf_usermeta
// where user_id IN (${sqlIn})
// and meta_key = 'user_status'
// and meta_value = 'Not Activated'
// `);