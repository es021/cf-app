const SiteUrl = "http://localhost:4000";
const PHPApi = (process.env.NODE_ENV === "development-wp") ? "http://localhost" : "http://localhost:88";

const AppConfig = {
    Name: "Virtual Career Fair 2017",
    Desc: "Powered by Seeds Job Fair",
    Url: "http://localhost:8080",
    Api: "http://localhost:4000",
    PHPApi : PHPApi,
    Icon: SiteUrl + "/asset/image/icon.png"
};

module.exports = {SiteUrl, AppConfig};