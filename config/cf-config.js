const CareerFair = {
    "USA": {
        title: "USA Virtual Career Fair 2018",
        flag: "United States of America(USA)",
        banner: "USA.jpg",
        start: "Apr 07 2018 08:00:00 GMT -0500 (-05)",
        end: "Apr 09 2018 08:00:00 GMT -0500 (-05)",
        can_register: 1,
        can_login: 1,
        organizer: "",
        collaborator: "",
    },
    "JAPAN": {
        title: "Japan Virtual Career Fair 2018",
        flag: "Japan",
        banner: "Japan.jpg",
        start: null,
        end: null,
        can_register: 0,
        can_login: 1,
        organizer: "",
        collaborator: "",
    },
    "INDONESIA": {
        title: "Indonesia Virtual Career Fair 2018",
        flag: "Indonesia",
        banner: "Indonesia.jpg",
        banner_pos: "top center",
        start: null,
        end: null,
        can_register: 0,
        can_login: 1,
        organizer: "",
        collaborator: "",
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
        }, {
            name: "Kelab UMNO Luar Negara Penn State",
            shortname: "KULN",
            logo: ""
        }, {
            name: "MASCO",
            shortname: "MASCO",
            logo: ""
        }]
    }
};

module.exports = { CareerFair, CareerFairOrg };
