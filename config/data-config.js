const Month = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Year = [
    "",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022"
];

const { CareerFairEnum } = require('./db-config');

const CareerFair = [
    { key: CareerFairEnum.USA, label: "United States of America (USA)", flag: "United States of America(USA)" }
    , { key: CareerFairEnum.JAPAN, label: "Japan", flag: "Japan" }
    , { key: CareerFairEnum.INDONESIA, label: "Indonesia", flag: "Indonesia" }
    , { key: CareerFairEnum.GERMANY, label: "Germany", flag: "Germany" }
    , { key: CareerFairEnum.FRANCE, label: "France", flag: "France" }
];


const Sponsor = [
    "",
    "Jabatan Perkhidmatan Awam (JPA)",
    "Majlis Amanah Rakyat (MARA)",
    "Petronas",
    "Maybank",
    "Tenaga Nasional Berhad (TNB)",
    "Bank Negara",
    "Khazanah National Berhad",
    "Private",
    "Other"
];

const PositionType = [
    "Full-Time",
    "Part-Time",
    "Intership",
    "Co-op"
];

module.exports = { Month, Year, Sponsor, PositionType, CareerFair };



