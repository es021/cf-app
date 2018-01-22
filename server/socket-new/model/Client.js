const { Event } = require('../../../config/socket-config');

function Client(data) {
    this.id = data.id;
    this.status = "";


    this.role = data.role;
    if (this.role === Event.ROLE_REC) {
        this.company_id = data.company_id;
    } else if (this.role === Event.ROLE_STUDENT) {
        this.company_id = null;
    }

    //list of socket for this user
    this.sockets = {};

    this.sockets_count = 0;

    //to notify in chat session
    this.other_users = [];
}

Client.prototype.STATUS_ONLINE = "Online";
Client.prototype.STATUS_OFFLINE = "Offline";
Client.prototype.PAGE_SESSION = "session";

Client.prototype.getDetail = function () {
    var detail = "";
    detail += "Client " + this.id + " : " + this.status + "\n";
    detail += "Role " + this.role + "\n";
    detail += "Company Id " + this.company_id + "\n";
    detail += "\nSockets (" + this.sockets_count + ") : \n";

    for (var key in this.sockets) {
        detail += "\t" + this.sockets[key].page + " : " + key + "\n";
    }

    detail += "Other Users (" + this.other_users.length + ") : \n";

    for (var i in this.other_users) {
        detail += "\t" + this.other_users[i] + "\n";
    }

    return detail;
};

Client.prototype.addSocket = function (socket, page) {
    this.sockets[socket.id] = {};
    this.sockets[socket.id].socket = socket;
    this.sockets[socket.id].page = page;


    this.status = this.STATUS_ONLINE;
    this.sockets_count++;
};

Client.prototype.removeSocket = function (socket_id) {
    delete (this.sockets[socket_id]);
    this.sockets_count--;

    if (this.sockets_count === 0) {
        this.status = this.STATUS_OFFLINE;
    }

};

Client.prototype.addOtherUser = function (other_id) {
    var index = this.other_users.indexOf(other_id);
    if (index < 0) {
        this.other_users.push(other_id);
    }
};

Client.prototype.removeOtherUser = function (other_id) {
    var index = this.other_users.indexOf(other_id);
    if (index > -1) {
        this.other_users.splice(index, 1);
    }
};

Client.prototype.isOnline = function () {

    if (this.status === this.STATUS_ONLINE) {
        return true;
    }

    return false;
};

module.exports = Client;
