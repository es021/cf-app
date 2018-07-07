const { ImageUrl } = require('./app-config');
const CF_DEFAULT = "NZL";
const CareerFair = {

    "NZL": {
        title: "New Zealand Virtual Career Fair 2018",
        flag: "New Zealand",
        banner: "NZL.jpg",
        // maalaysia time + 8 , est time.. -4
        // first event
        //start: "Apr 05 2018 20:30:00 GMT -0400 (-04)", 
        //end: "Apr 09 2018 4:00:00 GMT -0400 (-04)",
        // second event
        start: "Jul 09 2018 13:30:00 GMT +1200 (+12)",
        end: "Jul 10 2018 16:30:00 GMT +1200 (+12)",
        time_str: "1:30 PM - 4:30 PM (NZST)",
        time_str_mas: "9:30 AM - 12:30 PM (MYT)",
        //start: "Apr 02 2018 22:32:00 GMT -0400 (-04)", 
        //end: "Apr 09 2018 20:00:00 GMT -0400 (-04)",
        test_start: "Jul 08 2018 15:00:00 GMT +1200 (+12)",
        test_end: "Jul 09 2018 01:00:00 GMT +1200 (+12)",
        //dates: ["20", "21"], // for multiple seggregated dates
        can_register: 1,
        can_login: 1,
        page_url: null,
        page_banner: null
    },
    "USA": {
        title: "USA Virtual Career Fair 2018",
        flag: "United States of America(USA)",
        banner: "USA.jpg",
        // maalaysia time + 8 , est time.. -4
        // first event
        //start: "Apr 05 2018 20:30:00 GMT -0400 (-04)", 
        //end: "Apr 09 2018 4:00:00 GMT -0400 (-04)",
        // second event
        start: "Apr 20 2018 20:00:00 GMT -0400 (-04)",
        end: "Apr 21 2018 23:00:00 GMT -0400 (-04)",
        time_str: "10 PM - 1 AM (EDT)",
        //start: "Apr 02 2018 22:32:00 GMT -0400 (-04)", 
        //end: "Apr 09 2018 20:00:00 GMT -0400 (-04)",
        test_start: "Apr 01 2018 04:30:00 GMT +0800 (+08)",
        test_end: "Apr 01 2018 11:00:00 GMT +0800 (+08)",
        //dates: ["20", "21"], // for multiple seggregated dates
        can_register: 0,
        can_login: 1,
        page_url: "https://www.facebook.com/events/165437787576733/",
        page_banner: `${ImageUrl}/cf/USA-event-page.jpg`
    },
    "EUR": {
        title: "Europe Virtual Career Fair 2018",
        flag: "European Union",
        banner: "EUR.jpg",
        banner_pos: "top center",
        start: null,
        end: null,
        test_start: null,
        test_end: null,
        dates: null,
        can_register: 1,
        can_login: 0
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

module.exports = { CareerFair, CareerFairOrg, CF_DEFAULT };
