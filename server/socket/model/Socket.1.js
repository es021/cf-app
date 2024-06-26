var Client = require('./Client.js');
var DB = require('./DB.js');

const { Event } = require('../../../config/socket-config');

function Socket(io) {
    this.io = io;
}

//********************************************************
//** MAIN FUNCTION **//

Socket.prototype.init = function () {
    this.clients = [];
    // clients[custom_id][socket]
    // clients[custom_id][status]

    this.lookup = {};
    // lookup[generated_socket_id] = custom_id

    this.online_company = {};
    // online_company[custom_id] = count_online_recruiter_for_this_company;
    // online_company[custom_id] = {list of rec id};

    this.queue_detail = {};
    // queue_detail[company_id] = {list of student id}
    // needed to trigger event to related student when ON_IN_QUEUE was trigerred
    // emit CF_TRIGGER (Inqeueu) to all other student that is queueing except for them selves

    this.queue = {};
    // queue[company_id] = {number of student queueing}

    this.online_clients = {};
    // online_clients[custom_id] = 1;

    this.waiting_for = {};
    // waiting_for[custom_id] = [list of clients waiting for the key client];
    // so that when the key client finally online we can emit other online to all the clients



    var obj = this;
    obj.printHeader("Initiating Socket Server");

    //initialize
    obj.initDB(Event.ON_IN_QUEUE, null);

    this.io.on(Event.CONNECTION, function (client) {
        client.emit(Event.CONNECTION);
        obj.initClientEvent(obj, client);
    });

};

//*******************************************************
//** QUEUE Event Handler ***//
Socket.prototype.addQueue = function (company_id, student_id) {
    if (this.queue[company_id] === undefined) {
        this.queue[company_id] = [];
    }

    this.queue[company_id].push(student_id);
};

Socket.prototype.removeQueue = function (company_id, student_id) {
    if (this.queue[company_id] === undefined) {
        return false;
    }

    var student_index = this.queue[company_id].indexOf(student_id);

    if (student_index > -1) {
        this.queue[company_id].splice(student_index, 1);
    }
};


//********************************************************
//** LIVE MONITOR HANDLER **//

Socket.prototype.emitLiveMonitorData = function (socket, data) {
    //var user_id = this.lookup[this.id];
    var toEmit = {};
    toEmit.type = data.type;
    switch (data.type) {
        case 'online_user':
            toEmit.data = this.online_clients;
            break;
        case 'online_company':
            toEmit.data = this.online_company;
            break;
        case 'waiting_for':
            toEmit.data = this.waiting_for;
            break;
        case 'queue':
            toEmit.data = this.queue;
            break;
        case 'queue_detail':
            toEmit.data = this.queue_detail;
            break;
        default:
            return false;
            break;
    }

    socket.emit(Event.LIVE_MONITOR, toEmit);
};


//***************************************************
//** DB Trigger **//

//this will be call from init or initDBTrigger 
// if data is null it is init
Socket.prototype.initDB = function (event, data) {
    var obj = this;

    switch (event) {
        case Event.ON_IN_QUEUE:
            //get total queue and students for each company
            var sql = "SELECT c.ID as company_id, COALESCE(ttl.total, 0) as total, COALESCE(ttl.students, '') as students ";
            sql += "FROM companies c LEFT JOIN ";
            sql += "(SELECT company_id, COUNT(*) as total, GROUP_CONCAT(student_id) as students ";
            sql += "FROM in_queues WHERE status = 'Queuing' GROUP BY company_id) ttl ";
            sql += "ON c.ID = ttl.company_id";

            var eventEmit = Event.EMIT_IN_QUEUE;
            var eventData = data;

            //init for the first time app start
            DB.query(sql, obj, eventEmit, eventData);

            break;
    }
};

Socket.prototype.emitCFTriggerToQueue = function (data) {
    var obj = this;
    //emit trigger cf to related students
    //this is to update in student queueing list 
    for (var i in obj.clients) {
        if (data !== undefined && data !== null) {
            try {
                var cur_student_index = obj.queue_detail[data.company_id].indexOf(i);
                var trigger_student_index = obj.queue_detail[data.company_id].indexOf(data.student_id);
                //console.log("cur_student_index :" + cur_student_index);
                //console.log("trigger_student_index :" + trigger_student_index);
                // if student is in queue detail for this company
                // and not same as the one who trigerred it
                // and queue is more than the one who trigger it
                // thus we only emit the trigger to users that effected only
                if (cur_student_index > -1 && i != data.student_id && cur_student_index > trigger_student_index) {
                    obj.emitToClient(obj.clients[i], Event.CF_TRIGGER, { entity: Event.TB_IN_QUEUE });
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

};

//initialize all on event that causing to query database
Socket.prototype.initDBTrigger = function (client) {
    var obj = this;

    //this is triggered by startQueue and cancelQueue and createSessionSuccess in Client side
    //pass in data {company_id, student_id, action}
    // action : removeQueue | addQueue
    client.on(Event.ON_IN_QUEUE, function (data) {

        //if remove Queue, we need to emit first before db data is updated
        if (data !== undefined && data !== null && data.action === "removeQueue") {
            obj.emitCFTriggerToQueue(data);
        }

        //do we really need to query again? -- at least it is consistent
        obj.initDB(Event.ON_IN_QUEUE, data);

    });
};

Socket.prototype.dbSuccessHandler = function (res, eventEmit, eventData, obj) {

    if (eventEmit === Event.EMIT_IN_QUEUE) {
        obj.queue = res;
        //console.log(obj.queue);

        obj.queue = [];
        obj.queue_detail = {};
        for (var i in res) {
            var r = res[i];
            var queue = { company_id: r.company_id, total: r.total };
            obj.queue.push(queue);

            var students = [];
            if (r.students !== "") {
                students = r.students.split(",");
            }
            obj.queue_detail[r.company_id] = students;
        }

        //console.log(obj.queue);
        //console.log(obj.queue_detail);
        //console.log(eventData);

        obj.updateEmitQueue(eventEmit, false);

        //if add Queue, we need to emit after db data is updated
        if (eventData !== undefined && eventData !== null && eventData.action === "addQueue") {
            obj.emitCFTriggerToQueue(eventData);
        }

    }
};

Socket.prototype.dbErrorHandler = function (err) {
    console.log(err);
};


//********************************************************
//** CORE FUNCTION **/

// when client is not specified, emit to all student client
// client only specified in ON_JOIN
Socket.prototype.updateEmitQueue = function (event, client, eventData) {
    var obj = this;
    if (event === Event.ON_JOIN) {
        //do nothing
    }

    if (!client) {
        //emit to all student
        for (var i in obj.clients) {
            if (obj.clients[i].role === Event.ROLE_STUDENT) {
                //this is to update in company listing
                obj.emitToClient(obj.clients[i], Event.EMIT_IN_QUEUE, obj.queue);
            }
        }
    } else {
        obj.emitToClient(client, Event.EMIT_IN_QUEUE, obj.queue);
    }

};

//when client is not specified, emit to all student client
// client only specified in ON_JOIN
Socket.prototype.updateEmitOnlineCompany = function (data, event, client) {

    // only emit to online students
    var obj = this;
    if (data) {
        if (event === Event.ON_JOIN) {
            if (!obj.online_company[data.company_id]) {
                obj.online_company[data.company_id] = {};
                //obj.online_company[data.company_id]["online_count"] = 1;

                obj.online_company[data.company_id] = {};
                obj.online_company[data.company_id][data.id] = "Online";
            } else {
                //obj.online_company[data.company_id]++;
                obj.online_company[data.company_id][data.id] = "Online";
            }
        } else if (event === Event.ON_DISCONNECT) {
            //obj.online_company[data.company_id]--;
            delete (obj.online_company[data.company_id][data.id]);
            /*
             if (obj.online_company[data.company_id] === 0) {
             delete(obj.online_company[data.company_id]);
             }*/
        }
    }

    if (!client) {
        for (var i in obj.clients) {
            if (obj.clients[i].role === Event.ROLE_STUDENT) {
                obj.emitToClient(obj.clients[i], Event.EMIT_ALL_ONLINE_COMPANY, obj.online_company);
            }
        }
    } else {
        obj.emitToClient(client, Event.EMIT_ALL_ONLINE_COMPANY, obj.online_company);
    }
};

/*
 Socket.prototype.emitAllOnlineUser = function () {
 var obj = this;
 for (var i in obj.clients) {
 obj.emitToClient(obj.clients[i], Event.EMIT_ALL_ONLINE_USER, obj.online_clients);
 }
 };
 */

//********************************************************
//** HELPER FUNCTION **//

Socket.prototype.addWaitingFor = function (waiting_for, waited_by) {
    if (this.waiting_for[waiting_for] === undefined) {
        this.waiting_for[waiting_for] = [waited_by];
    } else {
        if (this.waiting_for[waiting_for].indexOf(waited_by) <= -1) {
            this.waiting_for[waiting_for].push(waited_by);
        }
    }

};

// param, socket generated id
Socket.prototype.remove_client = function (user_id) {
    //remove from clients array
    if (this.clients[user_id].sockets_count <= 0) {
        delete (this.clients[user_id]);
        delete (this.online_clients[user_id]);
    }

    //this.printHeader("Client removed : " + user_id);
    //console.log(this.debug());
};

Socket.prototype.emitToRole = function (emit, data, role) {
    for (var i in this.clients) {
        if (this.clients[i].role === role) {
            this.emitToClient(this.clients[i], emit, data);
        }
    }
};


Socket.prototype.emitToClientById = function (client_id, emit, data) {
    return this.emitToClient(this.clients[client_id], emit, data);
};

//return false if client to emit is not found (undefined)
Socket.prototype.emitToClient = function (client, emit, data) {
    if (client === undefined) {
        return false;
    }

    for (var i in client.sockets) {
        var soc = client.sockets[i];
        this.printHeader('[emit -> ' + emit + '] To (' + client.id + ') : ' + soc.socket.id);
        soc.socket.emit(emit, data);
    }

    return true;

};


//only add in other users. but if not in session page, this doesnt work
Socket.prototype.updateWaitingFor = function (client) {
    if (client === undefined) {
        return;
    }

    if (client.other_users.length <= 0) {
        return;
    }

    var new_waiting = [];
    for (var i in client.other_users) {
        var other = client.other_users[i];
        new_waiting.push(other);
    }

    if (new_waiting.length > 0) {
        this.waiting_for[client.id] = new_waiting;
    }

};

Socket.prototype.notifyOnline = function (self_id) {
    //if someone is waiting for self user, notify them
    if (this.waiting_for[self_id] !== undefined) {
        for (var i in this.waiting_for[self_id]) {
            var temp_other_id = this.waiting_for[self_id][i];
            var success = this.emitToClient(this.clients[temp_other_id], Event.EMIT_OTHER_ONLINE, { other_id: self_id });

            //delete ofline client from waiting online queue
            if (!success) {
                this.removeWaitingOnline(self_id, i);
            }
        }
        //delete(this.waiting_for[self_id]);
    }
};

// waiting for [parent_index] => [array of children]
Socket.prototype.removeWaitingOnline = function (parent_index, child_index) {
    //this.printHeader("removeWaitingOnline " + parent_index + " => " + child_index);

    if (child_index > -1) {
        this.waiting_for[parent_index].splice(child_index, 1);
    }
};

Socket.prototype.notifyOffline = function (client) {
    if (client === undefined) {
        return;
    }
    var data = {};
    data.other_id = client.id;

    //online to other user
    for (var i in client.other_users) {
        var other_client = this.clients[client.other_users[i]];
        this.emitToClient(other_client, Event.EMIT_OTHER_OFFLINE, data);
    }

    // in waiting for also needed
    if (this.waiting_for[client.id] !== undefined) {
        for (var i in this.waiting_for[client.id]) {
            var temp_other_id = this.waiting_for[client.id][i];
            this.emitToClient(this.clients[temp_other_id], Event.EMIT_OTHER_OFFLINE, { other_id: client.id });
        }
        //delete(this.waiting_for[self_id]);
    }
};

/************************************************************************/
/* DEBUG FUNCTIONS ******************************************************/

Socket.prototype.getClientDetails = function () {
    var details = "CLIENTS DETAILS...\n";
    for (var i in this.clients) {
        details += this.clients[i].getDetail() + "\n";
    }
    return details + "\n";
};


Socket.prototype.getLookupDetails = function () {
    var details = "LOOKUP DETAILS...\n";
    for (var key in this.lookup) {
        details += key + " : " + this.lookup[key] + "\n";
    }
    return details + "\n";
};

Socket.prototype.getOnlineDetails = function () {
    var details = "ONLINE CLIENTS...\n";
    for (var key in this.online_clients) {
        details += key + " => " + this.online_clients[key] + "\n";
    }
    return details + "\n";
};

Socket.prototype.getWaitingForDetails = function () {
    var details = "WAITING FOR CLIENTS...\n";
    for (var key in this.waiting_for) {
        details += key + " : is waited by => " + this.waiting_for[key] + "\n";
    }
    return details + "\n";
};


Socket.prototype.debug = function () {
    var debug = "";

    debug += this.getClientDetails();
    //debug += this.getOnlineDetails();
    //debug += this.getOfflineDetails();
    //debug += this.getLookupDetails();
    //debug += this.getWaitingForDetails();

    return debug;
};


Socket.prototype.printHeader = function (title) {
    var header;
    header = "======================================\n";
    header += title + "\n";
    header += "======================================\n";

    console.log(header);
};

/************************************************************************/
/* initClientEvent  ******************************************************/

Socket.prototype.initClientEvent = function (obj, client) {

    this.initDBTrigger(client);

    client.on(Event.DASHBOARD_NEWSFEED, function (data) {
        obj.emitToRole(Event.DASHBOARD_NEWSFEED, {}, data.role);
    });

    client.on(Event.HARD_RESET, function (data) {
        obj.init();
        this.emit(Event.HARD_RESET, {});
    });

    client.on(Event.LIVE_MONITOR, function (data) {
        obj.emitLiveMonitorData(this, data);
    });

    client.on(Event.NOTIFICATION, function (data) {
        //notification trigger by event
        //from socketData Client
        switch (data.event) {
            case "session_ended":
                //to update waiting for

                break;
            case "session_joined":
                //to update waiting for

                break;
        }

        obj.emitToClientById(data.other_id, Event.NOTIFICATION, { data: data.data, event: data.event });
    });

    client.on(Event.CF_TRIGGER, function (data) {
        //obj.printHeader('[cf trigger]');
        //console.log(data);
        if (data.to_role === Event.ROLE_STUDENT) {
            obj.emitToClientById(data.other_id, Event.CF_TRIGGER, { entity: data.entity });

        } else if (data.to_role === Event.ROLE_REC) {
            // search by company id
            for (var rec_id in obj.online_company[data.other_id]) {
                obj.emitToClientById(rec_id, Event.CF_TRIGGER, { entity: data.entity });
            }
        }
    });

    client.on(Event.ON_JOIN, function (data) {
        obj.printHeader(`[join] ${data.id} | ${data.role} | ${client.id}`);
        //console.log(data);
        if (data) {
            // init for the first time
            var isFirstTime = false;
            if (obj.clients[data.id] === undefined) {

                isFirstTime = true;
                obj.clients[data.id] = new Client(data);
            }

            //update lookup table
            obj.lookup[this.id] = data.id;
            obj.clients[data.id].addSocket(this, data.page);

            //add to online list
            if (!obj.online_clients[data.id]) {
                obj.online_clients[data.id] = 1;
                //obj.online_clients[data.id] = data.role;
            }

            //trigger by role
            if (data.role === Event.ROLE_REC) {
                if (isFirstTime) {
                    obj.updateEmitOnlineCompany(data, Event.ON_JOIN);
                }
            } else if (data.role === Event.ROLE_STUDENT) {
                //when student is joining, we want to sent the real time data 
                obj.updateEmitOnlineCompany(false, Event.ON_JOIN, obj.clients[data.id]);
                obj.updateEmitQueue(Event.ON_JOIN, obj.clients[data.id]);
            }

            //trigger by page
            if (data.page === Event.PAGE_SESSION) {
                obj.notifyOnline(data.id);
            }
        }

        console.log(obj.debug());
    });

    client.on(Event.ON_SEND_MESSAGE, function (data) {
        obj.printHeader('[send_message] : ID ' + this.id);
        //console.log(data.from_id + "->" + data.to_id + " : " + data.message);

        var to_client = obj.clients[data.to_id];

        if (to_client && to_client.isOnline()) {
            obj.emitToClient(to_client, Event.EMIT_RECEIVED_MESSAGE, data);
        }
    });


    client.on(Event.ON_OPEN_CHAT, function (data) {
        obj.printHeader('[open_chat] : ID ' + this.id);

        var self_client = obj.clients[data.self_id];
        self_client.addOtherUser(data.other_id);
        //check if other user online
        // only emit to this socket
        if (obj.online_clients[data.other_id] !== undefined) {
            this.emit(Event.EMIT_OTHER_ONLINE, { other_id: data.other_id });
        }
        // if other user is not online, push self user into waiting for other user
        else {
            this.emit(Event.EMIT_OTHER_OFFLINE, { other_id: data.other_id });
            obj.addWaitingFor(data.other_id, data.self_id);
        }

        //obj.notifyOnline(data.self_id);

    });

    client.on(Event.ON_DISCONNECT, function () {
        var user_id = obj.lookup[this.id];
        var client = obj.clients[user_id];
        obj.printHeader('[disconnect] : ID ' + user_id + " : " + this.id);

        if (!client) {
            console.log("Client NOT Found");
        } else {
            client.removeSocket(this.id);

            if (client.sockets_count <= 0) {
                obj.updateWaitingFor(client);

                //update lookup array
                delete (obj.lookup[this.id]);

                //handle Offline here
                //notify other user
                //but other user only be added if open chat is triggered
                //so waiting for also here
                obj.notifyOffline(client);

                //trigger by role
                if (client.role === Event.ROLE_REC) {
                    obj.updateEmitOnlineCompany(client, Event.ON_DISCONNECT);
                } else if (client.role === Event.ROLE_STUDENT) {

                }

                obj.remove_client(user_id);
            }
        }

        //obj.emitAllOnlineUser();
    });

    client.on(Event.CF_STUDENT_STATUS, function (data) {
        var hasChange = false;
        var changes = {};

        for (var id in data) {
            var prev_status = data[id];

            //get current status from online clients
            var current_status = null;
            if (obj.online_clients[id] !== undefined) {
                current_status = Event.STATUS_ONLINE;
            } else {
                current_status = Event.STATUS_OFFLINE;
            }

            if (prev_status !== current_status) {
                changes[id] = current_status; //set the changed status
                hasChange = true;
            }
        }

        if (hasChange) {
            //console.log("emit CF_STUDENT_STATUS");
            //console.log(changes);
            //emit back to client
            this.emit(Event.CF_STUDENT_STATUS, changes);
        }
    });
};




module.exports = Socket;
