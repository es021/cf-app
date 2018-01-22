var app = require("express")();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require("socket.io")(http);
var mysql = require("mysql");
var dateFormat = require('dateformat');
   

app.use(require("express").static('data'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
});

//conncecting nodejs to remote mysql
var con = mysql.createConnection({
 connectionLimit :   100,
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'wordpresschat'
});
//con.connect();


//  getting today's date  
var now = new Date();
var today=dateFormat(now, "mmmm dS, yyyy");

// This is auto initiated event when Client connects to Your Machine.  
io.on('connection',function(socket){  

  // authenticating  and gettting user name from wp_usermeta table. 
  socket.on('validate',function(data){
    var query="select meta_value from wp_usermeta where meta_key = 'nickname' and user_id = '" + data + "'";
    con.query(String(query),function(err,rows){
      if(rows.length>0){
        
        //Getting all the messages 
        var get_message="select * from chats";
        con.query(String(get_message),function(err, get_message_rows){
            
            // saving username in socket object 
            socket.nickname=rows[0].meta_value;

            //sending response to client side code.  
            io.emit('user entrance',{
              info:rows[0].meta_value+" is online.",
              message:get_message_rows
            }); 
        });

      }
    });
  });
    
  //inserting messages to tables and sending the messages to client side code. 
  socket.on('send msg',function(data){
    var query="insert into chats values ('','"+data.msg+"','"+data.id+"','"+socket.nickname+"','"+today+"')";
    con.query(String(query),function(err,rows){});
    io.emit('get msg',{user:socket.nickname,message:data.msg,id:data.id,date:today});
  });

  //When user dissconnects from server.
  socket.on('disconnect',function(){
    io.emit('exit',{message:socket.nickname});
  });

});


http.listen(81,function(){
    console.log("Listening on 81");
});