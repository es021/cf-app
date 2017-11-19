const SiteUrl = "http://localhost:4000";
const PHPApi = (process.env.NODE_ENV === "development-wp") ? "http://localhost" : "http://localhost:88";
//
//console.log(process.env.NODE_ENV);
//console.log(PHPApi);

const AppConfig = {
    Name: "Virtual Career Fair 2017",
    Desc: "Powered by Seeds Job Fair",
    Url: "http://localhost:8080",
    Api: "http://localhost:4000",
    PHPApi: PHPApi
};

const ImgConfig = {
    AppIcon: SiteUrl + "/asset/image/icon.png",
    DefUser: SiteUrl + "/asset/image/default-user.png",
    DefCompany: SiteUrl + "/asset/image/default-company.jpg"
};

module.exports = {SiteUrl, AppConfig, ImgConfig};