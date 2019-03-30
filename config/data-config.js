// const Month = [
//     "", "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
// ];

const Month = [{
        key: "",
        label: ""
    },
    {
        key: "01",
        label: "January"
    },
    {
        key: "02",
        label: "February"
    },
    {
        key: "03",
        label: "March"
    },
    {
        key: "04",
        label: "April"
    },
    {
        key: "05",
        label: "May"
    },
    {
        key: "06",
        label: "June"
    },
    {
        key: "07",
        label: "July"
    },
    {
        key: "08",
        label: "August"
    },
    {
        key: "09",
        label: "September"
    },
    {
        key: "10",
        label: "October"
    },
    {
        key: "11",
        label: "November"
    },
    {
        key: "12",
        label: "December"
    },
]

function getMonthLabel(key) {
    for (var i in Month) {
        if (Month[i].key == key) {
            return Month[i].label;
        }
    }

    return "";
}

// var sql = "";
// for(var i in Month){
//  sql += `

//  UPDATE wp_cf_usermeta 
//  SET meta_value = '${Month[i].key}'
//  WHERE 1=1
//  AND meta_value = '${Month[i].label}'
//  AND meta_key like '%month';

//  `;
// }

// console.log(sql)

const Year = [
    "",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
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

const MasState = [
    "",
    "Johor",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Penang",
    "Perak",
    "Perlis",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
    "Kuala Lumpur",
    "Labuan",
    "Putrajaya"
];

const Country = [
    "",
    "New Zealand",
    "USA",
    "Japan",
    "Austria",
    "Belgium",
    "Bulgaria",
    "Canada",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Turkey",
    "United Kingdom"
];

module.exports = {
    getMonthLabel,
    Month,
    Year,
    Sponsor,
    PositionType,
    MasState,
    Country
};