const DB = require("../model/DB.js");
const { getAxiosGraphQLQuery, } = require('../../helper/api-helper');

class OrganizerAPI {
    Main(action, param) {
        switch (action) {
            case "create-announcement":
                return this.createAnnouncement(param);
        }
    }
    createAnnouncement(param) {
        let p = {
            user_id: user_id,
            cf: getCF(),
            param: JSON.stringify(param),
            type: type,
            img_entity,
            img_id
        };

        var query = `mutation{
          add_notification(${obj2arg(p, { noOuterBraces: true })}){
            ID
          }
        }`;

        return getAxiosGraphQLQuery(query).then(res => {
            successHandler(res.data.data.add_notification);
            emitHallActivity(hallAction.ActivityType.NOTIFICATION_COUNT, user_id, null);
        });


    }
}

OrganizerAPI = new OrganizerAPI();
module.exports = { OrganizerAPI };
