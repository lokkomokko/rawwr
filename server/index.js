var express = require('express');
var app = express();
var _session = require('express-session')
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var messages = require('../routes/messages');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(_session);
import path from 'path';
var sharedsession = require("express-socket.io-session");
var cookieSession = require('cookie-session');
var cors = require('cors');
var users = [];
const connections = [];
var sess;



// io.use(sharedsession(session, {
//     autoSave:true
// }));
// app.use(function printSession(req, res, next) {
//     req.session.views = 1;
//     console.log('req.session', req.session);
//     return next();
// });
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use('/messages', messages);
app.get('/', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});
var newSess = cookieSession ({
    name: 'session',
    keys: ['key1', 'key2'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
app.use(newSess);
io.use(function(socket, next) {
    newSess(socket.request, socket.request.res, next);
});

// var session = require('express-session')({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//     store: new MongoStore({ mongooseConnection: mongoose.connection })
// });
// app.use(session);


app.post('/username', function(req, res, next){
    console.log("# Username set to "+ req.body.username);
    req.session.username = req.body.username;
    var sess = req.session.username;
    req.session.save();
    console.log("# Session value set "+ req.session.username);
    res.end();
});
app.get('/username', function(req,res){
    console.log("# Client Username check "+ req.session.username);
    // res.send('asdasdasdasdasd')
    res.json({username: req.session.username})
});

io.sockets.on('connection', function(socket) {

    connections.push(socket);
    console.log('Connected socket', connections.length);

    socket.on('disconnect', function (data) {
        var filter_list=[];
        var search;
        function find_delete_user(user) {
            console.log('проходимся по массиву ' + users, + ' искомый юзер ', user)
          users.map(e => {
              console.log('итерация по ', e);
              if(e === user) return false, console.log('юзер нашелся', e)
              else {
                 return filter_list.push(e), console.log('добавляем в новый список', filter_list)
              }
          })
            return users = filter_list, console.log('возвращаем новых юзеров', users)
        }
        if (socket.username === undefined) search = socket.request.session.username;
        else if (socket.request.session.username === undefined ) search = socket.username;

        find_delete_user(search);
            console.log('Юзеров осталось ', users, 'дата?', data)
        // }

        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Вышел из сети %s', socket.username);
    });

    //Send message
    socket.on('Send message', function (data) {
        function chek_user() {
            if(socket.request.session.username === undefined) {
                return socket.username
            }
            else return socket.request.session.username
        };
        io.sockets.emit('new message', {msg: data, user: chek_user()});
    });

    //New User
    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
    socket.on('session users', function (data, callback) {
        function in_array(value, array)
        {
            for(var i = 0; i < array.length; i++)
            {
                if(array[i] == value) return true;
            }
            return false;
        }


        callback(true);
        if (in_array(socket.request.session.username, users)){
            console.log('уже есть')
        }
        else {
            users.push(socket.request.session.username);
        }

        updateUsernames();
    });
    io.sockets.emit('getAll', users);
    function updateUsernames() {
        // users.push(socket.request.session.username)
        console.log(users)
        io.sockets.emit('get users', users)
    };
});

server.listen(process.env.PORT || 9000);
console.log('Server running...');

