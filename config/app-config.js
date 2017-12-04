const SiteUrl = "http://localhost:4000";
const UploadUrl = SiteUrl + "/upload";
const PHPApi = (process.env.NODE_ENV === "development-wp") ? "http://localhost" : "http://localhost:88";
const isProd = (process.env.NODE_ENV === "production");

const AppConfig = {
    Name: "Virtual Career Fair 2017",
    Desc: "Powered by Seeds Job Fair",
    Url: (isProd) ? PHPApi : "http://localhost:8080",
    Api: SiteUrl,
    PHPApi: PHPApi,
    WPAjaxApi: PHPApi + "/career-fair/wp-admin/admin-ajax.php",
    FbUrl: "https://www.fb.com/innovaseedssolutions",
    WwwUrl: "https://seedsjobfair.com"
};

const ImgConfig = {
    AppIcon: SiteUrl + "/asset/image/icon.png",
    IsIcon: SiteUrl + "/asset/image/innovaseed.png",
    IsIconInverse: SiteUrl + "/asset/image/innovaseed_inverse.png",
    DefUser: SiteUrl + "/asset/image/default-user.png",
    DefCompany: SiteUrl + "/asset/image/default-company.jpg"
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

module.exports = {SiteUrl, UploadUrl, AppConfig, ImgConfig, OrgConfig};