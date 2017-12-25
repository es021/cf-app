console.log("environment - " + process.env.NODE_ENV);

var isProd = (process.env.NODE_ENV === "production"); // that is deployed to server
var isProdLocal = (process.env.NODE_ENV === "production-local"); // build for local server

const RootPath = (isProd) ? "/cf" : "";

var SiteUrl = (isProd) ? `https://seedsjobfair.com/cf` : "http://localhost:4000";
var AssetUrl = (isProd) ? `https://seedsjobfair.com/public` : SiteUrl;

var UploadUrl = AssetUrl + "/upload";

var PHPApi = (process.env.NODE_ENV === "development-wp") ? "http://localhost" : "http://localhost:88";
if (isProd) {
    PHPApi = `https://seedsjobfair.com/php-api/`;
} else {
    PHPApi += `/cf-app/server/php-api/`;
}  

const AppConfig = {
    Name: "Virtual Career Fair 2017",
    Desc: "Powered by Seeds Job Fair",
    Url: (isProd || isProdLocal) ? PHPApi : "http://localhost:8080",
    Api: SiteUrl,
    PHPApi: PHPApi,
    FbAppId: "315194262317447",
    WPAjaxApi: PHPApi + "/career-fair/wp-admin/admin-ajax.php",
    FbUrl: "https://www.fb.com/innovaseedssolutions",
    WwwUrl: "https://seedsjobfair.com"
};

const ImgConfig = {
    AppIcon: AssetUrl + "/asset/image/icon.png",
    IsIcon: AssetUrl + "/asset/image/innovaseed.png",
    IsIconInverse: AssetUrl + "/asset/image/innovaseed_inverse.png",
    DefUser: AssetUrl + "/asset/image/default-user.png",
    DefCompany: AssetUrl + "/asset/image/default-company.jpg"
};

const OrgConfig = {
    Organizer: [{
            name: "National Assembly of Malaysian Students Association",
            shortname: "NAMSA",
            logo: ""
        }
    ],

    Collaborator: [{
            name: "US East Coast Presidential Council",
            shortname: "EPIC",
            logo: ""
        }, {
            name: "Education Malaysia at Washington DC",
            shortname: "EMWDC",
            logo: ""
        }, {
            name: "West Coast Council",
            shortname: "WCC",
            logo: ""
        }, {
            name: "Talent Corp Malaysia",
            shortname: "",
            logo: ""
        }, {
            name: "Council of Midwest Malaysian Students",
            shortname: "COMMS",
            logo: ""
        }, {
            name: "International Council of Malaysian Scholars and Associates",
            shortname: "ICMS",
            logo: ""
        }, {
            name: "Kelab UMNO Luar Negara Penn State",
            shortname: "KULN",
            logo: ""
        }, {
            name: "MASCO",
            shortname: "MASCO",
            logo: ""
        }
    ]
};

module.exports = {RootPath, SiteUrl, UploadUrl, AppConfig, ImgConfig, OrgConfig};