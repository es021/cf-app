const { ImageUrl } = require('./app-config');

const CareerFair = {
    "USA": {
        title: "USA Virtual Career Fair 2018",
        flag: "United States of America(USA)",
        banner: "USA.jpg",
        start: "Apr 05 2018 08:00:00 GMT +0800 (+08)", // maalaysia time , est time.. -5
        end: "Apr 09 2018 08:00:00 GMT +0800 (+08)",
        test_start: "Apr 01 2018 04:30:00 GMT +0800 (+08)",
        test_end: "Apr 01 2018 11:00:00 GMT +0800 (+08)",
        dates: ["5", "8", "9"], // for multiple seggregated dates
        can_register: 1,
        can_login: 1,
        page_url: "https://www.facebook.com/events/165437787576733/",
        page_banner: `${ImageUrl}/cf/USA-event-page.jpg`
    },
    "JAPAN": {
        title: "Japan Virtual Career Fair 2018",
        flag: "Japan",
        banner: "Japan.jpg",
        start: null,
        end: null,
        test_start: null,
        test_end: null,
        dates: null,
        can_register: 0,
        can_login: 0
    },
    "INDONESIA": {
        title: "Indonesia Virtual Career Fair 2018",
        flag: "Indonesia",
        banner: "Indonesia.jpg",
        banner_pos: "top center",
        start: null,
        end: null,
        test_start: null,
        test_end: null,
        dates: null,
        can_register: 0,
        can_login: 0
    },
    "GERMANY": {
        title: "Germany Virtual Career Fair 2018",
        flag: "Germany",
        banner: "Germany.jpg",
        banner_pos: "top center",
        start: null,
        end: null,
        test_start: null,
        test_end: null,
        dates: null,
        can_register: 0,
        can_login: 0
    }
};

const CareerFairOrg = {
    "USA": {
        Organizer: [{
            name: "National Assembly of Malaysian Students Association",
            shortname: "NAMSA",
            logo: ""
        }],
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
        }
            /*, {
                name: "Kelab UMNO Luar Negara Penn State",
                shortname: "KULN",
                logo: ""
            }, {
                name: "MASCO",
                shortname: "MASCO",
                logo: ""
            }*/
        ]
    }
};

module.exports = { CareerFair, CareerFairOrg };
