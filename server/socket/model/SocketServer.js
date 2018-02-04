var Client = require('./Client.js');
//var DB = require('./DB.js');
var DB = require('../../model/DB');

const { S2C, C2S, BOTH } = require('../../../config/socket-config');
const { UserEnum } = require('../../../config/db-config');

class SocketServer {
    constructor(io, isProd) {
        this.io = io;
        this.isProd = isProd;
        this.state = {
            clients: [],
            // clients[custom_id][socket]
            // clients[custom_id][status]

            lookup: {},
            // lookup[generated_socket_id] = custom_id

            online_company: {},
            // online_company[custom_id] = count_online_recruiter_for_this_company;
            // online_company[custom_id] = {list of rec id};

            queue_detail: {},
            // queue_detail[company_id] = {list of student id}
            // needed to trigger event to related student when ON_IN_QUEUE was trigerred
            // emit CF_TRIGGER (Inqeueu) to all other student that is queueing except for them selves

            queue: {},
            // queue[company_id] = {number of student queueing}

            online_clients: {},
            // online_clients[custom_id] = 1;

            //depecrated
            //waiting_for: {}
            // waiting_for[custom_id] = [list of clients waiting for the key client];
            // so that when the key client finally online we can emit other online to all the clients
        }
    }

    // #################################################################
    // INIT FUNCTION START
    init() {
        this.printHeader("Initiating Socket Server");
        //initialize
        this.initDB(BOTH.QUEUE_STATUS, null);

        if (this.isProd) {
            this.io.of('/socket').on(BOTH.CONNECTION, (client) => {
                client.emit(BOTH.CONNECTION);
                this.initOn(client);
            });
        } else {
            this.io.on(BOTH.CONNECTION, (client) => {
                client.emit(BOTH.CONNECTION);
                this.initOn(client);
            });
        }

    }


    initOn(client) {
        client.on(C2S.JOIN, (d) => { this.onJoin(client, d) });
        client.on(C2S.LOGOUT, (d) => { this.onLogout(client, d) });

        client.on(C2S.DISCONNECT, (d) => { this.onDisconnect(client, d) });
        client.on(BOTH.CHAT_OPEN_CLOSE, (d) => { this.onChatOpenClose(client, d) });
        client.on(BOTH.CHAT_MESSAGE, (d) => { this.onChatMessage(client, d) });
        client.on(BOTH.LIVE_FEED, (d) => { this.onLiveFeed(client, d) });
        client.on(BOTH.STATE, (d) => { this.onState(client, d) });
        client.on(BOTH.HALL_ACTIVITY, (d) => { this.onHallActivity(client, d) });

        this.initDBTrigger(client);
    }

    // #################################################################
    // DB RELATED

    initDB(event, data) {
        switch (event) {
            case BOTH.QUEUE_STATUS:
                //get total queue and students for each company
                // var sql = "SELECT c.ID as company_id, COALESCE(ttl.total, 0) as total, COALESCE(ttl.students, '') as students ";
                // sql += "FROM companies c LEFT JOIN ";
                // sql += "(SELECT company_id, COUNT(*) as total, GROUP_CONCAT(student_id) as students ";
                // sql += "FROM in_queues WHERE status = 'Queuing' GROUP BY company_id) ttl ";
                // sql += "ON c.ID = ttl.company_id";

                var sql = `select c.ID as company_id, q.student_id, q.created_at from companies c 
                    left outer join in_queues q on status = "Queuing" and q.company_id = c.ID 
                    order by c.ID, q.created_at asc `;

                var eventData = data;
                //init for the first time app start
                DB.query(sql).then((res) => {
                    this.state.queue = {};
                    this.state.queue_detail = {};

                    for (var i in res) {

                        var r = res[i];
                        if (!this.state.queue_detail[r.company_id]) {
                            this.state.queue_detail[r.company_id] = [];
                        }

                        if (r.student_id != "" && r.student_id != null) {
                            this.state.queue_detail[r.company_id].push(r.student_id);
                        }

                    }

                    for (var company_id in this.state.queue_detail) {
                        this.state.queue[company_id] = this.state.queue_detail[company_id].length;
                    }

                    this.updateEmitQueue(event, false);

                    //if add Queue, we need to emit after db data is updated
                    if (eventData !== undefined && eventData !== null && eventData.action === "addQueue") {
                        this.emitCFTriggerToQueue(eventData);
                    }
                });
                break;
        }
    }

    //initialize all on event that causing to query database
    initDBTrigger(client) {
        //this is triggered by startQueue and cancelQueue and createSessionSuccess in Client side
        //pass in data {company_id, student_id, action}
        // action : removeQueue | addQueue
        client.on(BOTH.QUEUE_STATUS, (data) => {

            //if remove Queue, we need to emit first before db data is updated
            if (data !== undefined && data !== null && data.action === "removeQueue") {
                this.emitCFTriggerToQueue(data);
            }

            //do we really need to query again? -- at least it is consistent
            this.initDB(BOTH.QUEUE_STATUS, data);

        });
    }

    emitCFTriggerToQueue(data) {
        //emit trigger cf to related students
        //this is to update in student queueing list 
        for (var i in this.state.clients) {
            if (data !== undefined && data !== null) {
                try {
                    var cur_student_index = this.state.queue_detail[data.company_id].indexOf(i);
                    var trigger_student_index = this.state.queue_detail[data.company_id].indexOf(data.student_id);
                    //console.log("cur_student_index :" + cur_student_index);
                    //console.log("trigger_student_index :" + trigger_student_index);
                    // if student is in queue detail for this company
                    // and not same as the one who trigerred it
                    // and queue is more than the one who trigger it
                    // thus we only emit the trigger to users that effected only
                    if (cur_student_index > -1 && i != data.student_id && cur_student_index > trigger_student_index) {
                        this.emitToClient(this.state.clients[i], BOTH.QUEUE_STATUS, this.state.queue);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }

    // #################################################################
    // ON HELPER FUNCTION START

    // {entity, to_id, to_company} 
    onHallActivity(client, data) {
        this.printHeader('[hallActivity] : ' + JSON.stringify(data));

        if (data.to_id) {
            var to_client = this.state.clients[data.to_id];
            if (to_client && to_client.isOnline()) {
                this.emitToClient(to_client, BOTH.HALL_ACTIVITY, data);
            }
        }

        // emit to online recruiter
        if (data.to_company) {
            for (var to_id in this.state.online_company[data.to_company]) {
                var to_client = this.state.clients[to_id];
                if (to_client && to_client.isOnline()) {
                    this.emitToClient(to_client, BOTH.HALL_ACTIVITY, data);
                }
            }
        }

    }

    // {params}
    // any specific params only
    onState(client, data) {
        var toEmit = {};
        if (data.params == null) {
            for (var key in this.state) {
                if (key == "clients" || key == "lookup") {
                    continue;
                }
                toEmit[key] = this.state[key];
            }

        } else {
            for (var i in data.params) {
                var key = data.params[i];
                toEmit[key] = this.state[key];
            }
        }

        client.emit(BOTH.STATE, toEmit);
    }

    // {title, content, type, cf, created_at}
    onLiveFeed(client, data) {
        this.emitToRole(BOTH.LIVE_FEED, data, data.type, data.cf);
    }

    // {from_id, to_id, message, created_at}
    onChatMessage(client, data) {
        this.printHeader('[send_message] : ID ' + client.id);
        var to_client = this.state.clients[data.to_id];
        if (to_client && to_client.isOnline()) {
            this.emitToClient(to_client, BOTH.CHAT_MESSAGE, data);
        }
    }

    // {from_id,to_id,session_id}
    onChatOpenClose(client, data) {
        this.printHeader('[open_chat_close] : ID ' + JSON.stringify(data));
        var to_client = this.state.clients[data.to_id];
        if (to_client && to_client.isOnline()) {
            this.emitToClient(to_client, BOTH.CHAT_OPEN_CLOSE, data);
        }
    }

    //{id:id}
    // remove all records
    // make offline
    onLogout(client, data) {

        var user_id = data.id;
        var clientObj = this.state.clients[user_id];
        if (!clientObj) {
            console.log("Client Logout NOT Found");
        } else {
            delete (this.state.lookup[client.id]);
            if (clientObj.role === UserEnum.ROLE_RECRUITER) {
                this.updateEmitOnlineCompany(clientObj, C2S.DISCONNECT);
            }
            this.remove_client(user_id, true);
            console.log(this.state);
        }
    }

    onDisconnect(client, data) {
        var user_id = this.state.lookup[client.id];
        var clientObj = this.state.clients[user_id];
        this.printHeader('[disconnect] : ID ' + user_id + " : " + client.id);

        if (!clientObj) {
            console.log("Client NOT Found");
        } else {
            clientObj.removeSocket(client.id);
            //update lookup array
            delete (this.state.lookup[client.id]);

            if (clientObj.sockets_count <= 0) {
                //this.updateWaitingFor(clientObj);
                //handle Offline here
                //notify other user
                //but other user only be added if open chat is triggered
                //so waiting for also here
                //this.notifyOffline(clientObj);

                //trigger by role
                if (clientObj.role === UserEnum.ROLE_RECRUITER) {
                    this.updateEmitOnlineCompany(clientObj, C2S.DISCONNECT);
                } else if (clientObj.role === UserEnum.ROLE_STUDENT) {

                }

                this.remove_client(user_id);
            }
        }

        this.debug();
    }

    //{id, role, company_id, page};
    onJoin(client, data) {
        console.log("joined");
        this.printHeader(`[join] ${data.id} | ${data.role} | ${client.id}`);
        //console.log(data);
        if (data) {
            // init for the first time
            var isFirstTime = false;
            if (this.state.clients[data.id] === undefined) {

                isFirstTime = true;
                this.state.clients[data.id] = new Client(data);
            }

            //update lookup table
            this.state.lookup[client.id] = data.id;
            this.state.clients[data.id].addSocket(client);

            //add to online list
            if (!this.state.online_clients[data.id]) {
                this.state.online_clients[data.id] = 1;
                //this.online_clients[data.id] = data.role;
                this.emitToAll(S2C.ONLINE_USER, this.state.online_clients);
            }

            //trigger by role
            if (data.role === UserEnum.ROLE_RECRUITER) {
                if (isFirstTime) {
                    this.updateEmitOnlineCompany(data, C2S.JOIN);
                }
            } else if (data.role === UserEnum.ROLE_STUDENT) {
                //when student is joining, we want to sent the real time data 
                this.updateEmitOnlineCompany(false, C2S.JOIN, this.state.clients[data.id]);
                this.updateEmitQueue(C2S.JOIN, this.state.clients[data.id]);
            }


            //previously this is trigger only to page session
            //this.notifyOnline(data.id);
        }
        this.debug();
    }

    // #################################################################
    // EMIT HELPER FUNCTION START
    /* deperacated
    notifyOnline(self_id) {
        //if someone is waiting for self user, notify them
        if (this.state.waiting_for[self_id] !== undefined) {
            for (var i in this.state.waiting_for[self_id]) {
                var temp_other_id = this.state.waiting_for[self_id][i];
                var success = this.emitToClient(this.state.clients[temp_other_id]
                    , S2C.OTHER_OFFLINE
                    , { other_id: self_id });

                //delete ofline client from waiting online queue
                if (!success) {
                    this.removeWaitingOnline(self_id, i);
                }
            }
            //delete(this.waiting_for[self_id]);
        }
    }
    */

    emitToAll(emit, data, except_id = null) {
        for (var i in this.state.clients) {
            if (except_id == i) {
                continue;
            }
            this.emitToClient(this.state.clients[i], emit, data);
        }
    }

    emitToRole(emit, data, role, cf) {
        for (var i in this.state.clients) {
            if (this.state.clients[i].role === role && this.state.clients[i].cf === cf) {
                this.emitToClient(this.state.clients[i], emit, data);
            }
        }
    }

    //return false if client to emit is not found (undefined)
    emitToClient(client, emit, data) {
        if (client === undefined) {
            return false;
        }

        for (var i in client.sockets) {
            var soc = client.sockets[i];
            this.printHeader('[emit -> ' + emit + '] To (' + client.id + ') : ' + soc.socket.id);
            soc.socket.emit(emit, data);
        }
        return true;
    }

    // #################################################################
    // UPDATE STATE FUNCTION START
    remove_client(user_id, all = false) {
        //remove from clients array
        if (this.state.clients[user_id].sockets_count <= 0 || all) {
            delete (this.state.clients[user_id]);
            delete (this.state.online_clients[user_id]);
        }

        this.emitToAll(S2C.ONLINE_USER, this.state.online_clients, user_id);

        //this.printHeader("Client removed : " + user_id);
        //console.log(this.debug());
    }

    /*// depercated
    notifyOffline(client) {
        if (client === undefined) {
            return;
        }
        var data = {};
        data.other_id = client.id;

        //online to other user
        for (var i in client.other_users) {
            var other_client = this.state.clients[client.other_users[i]];
            this.emitToClient(other_client, S2C.OTHER_OFFLINE, data);
        }

        // in waiting for also needed
        if (this.state.waiting_for[client.id] !== undefined) {
            for (var i in this.state.waiting_for[client.id]) {
                var temp_other_id = this.state.waiting_for[client.id][i];
                this.emitToClient(this.state.clients[temp_other_id], S2C.OTHER_OFFLINE, { other_id: client.id });
            }
            //delete(this.waiting_for[self_id]);
        }
    }
    */

    /*// depercated
    //only add in other users. but if not in session page, this doesnt work
    updateWaitingFor(client) {
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
            this.state.waiting_for[client.id] = new_waiting;
        }
    }*/

    updateEmitQueue(event, client, eventData) {
        if (event === C2S.JOIN) {
            //do nothing
        }

        if (!client) {
            //emit to all student
            for (var i in this.state.clients) {
                if (this.state.clients[i].role === UserEnum.ROLE_STUDENT) {
                    //this is to update in company listing
                    this.emitToClient(this.state.clients[i], BOTH.QUEUE_STATUS, this.state.queue);
                }
            }
        } else {
            this.emitToClient(client, BOTH.QUEUE_STATUS, this.state.queue);
        }

    }

    updateEmitOnlineCompany(data, event, client) {
        if (data) {
            if (event === C2S.JOIN) {
                if (!this.state.online_company[data.company_id]) {
                    this.state.online_company[data.company_id] = {};
                    //this.state.online_company[data.company_id]["online_count"] = 1;

                    this.state.online_company[data.company_id] = {};
                    this.state.online_company[data.company_id][data.id] = "Online";
                } else {
                    //this.state.online_company[data.company_id]++;
                    this.state.online_company[data.company_id][data.id] = "Online";
                }
            } else if (event === C2S.DISCONNECT) {
                //this.state.online_company[data.company_id]--;
                delete (this.state.online_company[data.company_id][data.id]);
                /*
                 if (this.state.online_company[data.company_id] === 0) {
                 delete(this.state.online_company[data.company_id]);
                 }*/
            }
        }

        if (!client) {
            // only emit to all online students            
            for (var i in this.state.clients) {
                if (this.state.clients[i].role === UserEnum.ROLE_STUDENT) {
                    this.emitToClient(this.state.clients[i]
                        , S2C.ONLINE_COMPANY
                        , this.state.online_company);
                }
            }
        } else {
            // emit to client in param
            this.emitToClient(client
                , S2C.ONLINE_COMPANY
                , this.state.online_company);
        }
    }

    // #################################################################
    // HELPER FUNCTION START
    printHeader(title) {
        var header;
        header = "======================================\n";
        header += title + "\n";
        header += "======================================\n";
        this.log(header);
    }

    log(mes) {
        console.log(mes);
    }

    debug() {
        var debug = "";
        debug += this.getClientDetails();
        //debug += this.getOnlineDetails();
        //debug += this.getOfflineDetails();
        //debug += this.getLookupDetails();
        //debug += this.getWaitingForDetails();

        this.log(debug);
        this.log(this.state);
    }

    getClientDetails() {
        var details = "CLIENTS DETAILS...\n";
        for (var i in this.state.clients) {
            details += this.state.clients[i].getDetail() + "\n";
        }
        return details + "\n";
    }

}

module.exports = SocketServer;

