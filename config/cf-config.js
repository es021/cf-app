const {
    ImageUrl
} = require('./app-config');
const CF_DEFAULT = "EUR";
const CareerFair = {
    "EUR": {
        title: "Europe Virtual Career Fair 2018",
        flag: "European Union",
        banner: "EUR.jpg",
        banner_pos: "top center",
        schedule: {
            timezone: "GMT +0800 (+08)",
            data: [{
                    date: "Nov 12 2018",
                    start: "15:00:00",
                    end: "18:00:00"
                },
                {
                    date: "Nov 13 2018",
                    start: "15:00:00",
                    end: "18:00:00"
                },
                {
                    date: "Nov 14 2018",
                    start: "15:00:00",
                    end: "18:00:00"
                }
            ]
        },

        logo: `${ImageUrl}/cf/EUR-logo-2.png`,
        logo_height: "200px",
        logo_width: "370px",
        logo_position : "top center",
        logo_size : "cover",

        start: "Nov 12 2018 15:00:00 GMT +0800 (+08)",
        end: "Nov 14 2018 18:00:00 GMT +0800 (+08)",
        //time_str: "1:00 PM - 4:30 PM (EUR)",
        time_str: "3:00 PM - 6:00 PM (MYT)",
        //time_str_mas: "9:00 AM - 12:30 PM (MYT)",

        //test_start: "Apr 01 2018 04:30:00 GMT +0800 (+08)",
        //test_end: "Apr 01 2018 11:00:00 GMT +0800 (+08)",

        page_url: "https://www.facebook.com/events/2093221544257428/",
        page_banner: `${ImageUrl}/cf/EUR-event-page.jpg`,


        can_register: 1,
        can_login: 1
    },
    "NZL": {
        title: "New Zealand Virtual Career Fair 2018",
        flag: "New Zealand",
        banner: "NZL.jpg",
        // maalaysia time + 8 , est time.. -4
        // first event
        //start: "Apr 05 2018 20:30:00 GMT -0400 (-04)", 
        //end: "Apr 09 2018 4:00:00 GMT -0400 (-04)",
        // second event

        // open for schedule availability 
        // only time concerned here
        // schedule: {
        //     timezone: "GMT +0800 (+08)",
        //     data: [{
        //             date: "Nov 12 2018",
        //             start: "15:00:00",
        //             end: "18:00:00"
        //         },
        //         {
        //             date: "Nov 13 2018",
        //             start: "15:00:00",
        //             end: "18:00:00"
        //         },
        //         {
        //             date: "Nov 14 2018",
        //             start: "15:00:00",
        //             end: "18:00:00"
        //         }
        //     ]
        // },

        // open for do stuff
        start: "Jul 09 2018 13:00:00 GMT +1200 (+12)",
        end: "Jul 10 2018 23:30:00 GMT +1200 (+12)",
        time_str: "1:00 PM - 4:30 PM (NZST)",
        time_str_mas: "9:00 AM - 12:30 PM (MYT)",
        //start: "Apr 02 2018 22:32:00 GMT -0400 (-04)", 
        //end: "Apr 09 2018 20:00:00 GMT -0400 (-04)",
        test_start: "Jul 08 2018 15:00:00 GMT +1200 (+12)",
        test_end: "Jul 09 2018 01:00:00 GMT +1200 (+12)",
        //dates: ["20", "21"], // for multiple seggregated dates
        can_register: 0,
        can_login: 0,
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
        //start: "Apr 02 2018 22:32:00 GMT -0400 (-04)", 
        //end: "Apr 09 2018 20:00:00 GMT -0400 (-04)",
        //dates: ["20", "21"], // for multiple seggregated dates

        schedule_time_start: "Apr 20 2018 09:00:00 GMT +0800 (+08)",
        schedule_time_end: "Apr 23 2018 15:00:00 GMT +0800 (+08)",

        start: "Apr 20 2018 20:00:00 GMT -0400 (-04)",
        end: "Apr 21 2018 23:00:00 GMT -0400 (-04)",
        time_str: "10 PM - 1 AM (EDT)",

        test_start: "Apr 01 2018 04:30:00 GMT +0800 (+08)",
        test_end: "Apr 01 2018 11:00:00 GMT +0800 (+08)",

        can_register: 0,
        can_login: 0,
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

    "EUR": {
        Organizer: [{
            name: "Malaysian-German Students Society",
            logo: "MGSS.jpg",
            url: "https://www.facebook.com/mgssde/"
        }, {
            name: "MARAKumpel",
            logo: "MaraKUMPEL.png",
            url: "https://www.facebook.com/groups/207061939177/about/"
        }],
        Collaborator: [{
                name: "Malaysian Students Association in Turkey",
                logo: "MASAT.jpg",
                url: "https://www.facebook.com/PersatuanPelajarMalaysiaDiTurki/"
            },
            {
                name: "MASAFrance",
                logo: "MasaFrance.png",
                url: "https://www.facebook.com/masafrance/"
            }, {
                name: "TalentCorp",
                logo: "TalentCorp.jpg",
                url: "https://www.talentcorp.com.my/"
            },
        ],
        Powered: [{
            name: "SeedsJobFair",
            logo: "logo.png",
            url: "https://www.facebook.com/seedsjobfair/"

        }]
    },
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

module.exports = {
    CareerFair,
    CareerFairOrg,
    CF_DEFAULT
};