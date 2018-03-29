const { ImageUrl } = require('./app-config');

const Ads = {
    "talent_corp_next": {
        label: "Not Sure What To Pursue?",
        sublabel : "Discover Your Passion Here",
        action: "Talent Corp's NEXT",
        url: "https://www.talentcorp.com.my/findmynext",
        image: `${ImageUrl}/ads/talent_corp.jpg?ver=1`
    },
    "zoom_download": {
        label: "Prepare Early!",
        sublabel : "Zoom Video Conference is required to join video call later",
        action: "Download Zoom Now",
        url: "https://zoom.us/download",
        image: `${ImageUrl}/ads/online_meeting.jpg?ver=1`
    }
};

module.exports = { Ads };