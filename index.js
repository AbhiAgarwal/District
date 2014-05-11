'use strict';

var express = require('express'),
    app = express(),
    nconf = require('nconf'),
    http = require('http');

app.use(express.static('/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(process.cwd() + '/public'));

nconf.argv()
    .env()
    .file({
        file: ('app.json')
    });

var ordrin = require('ordrin-api'),
    ordrin_api = new ordrin.APIs(nconf.get('api_key'), ordrin.TEST);

var currentFood = {};

var load = function() {
    ordrin_api.delivery_list({
        datetime: nconf.get('datetime'),
        addr: nconf.get('addr'),
        city: nconf.get('city'),
        zip: nconf.get('zip')
    }, function(data, x) {
        console.log('Food is ready!');
        currentFood = x;
    });
};

app.get('/api', function(req, res) {
    res.json(currentFood);
});

app.get('/api/:id', function(req, res) {
    res.json(currentFood[req.params.id]);
});

app.get('/order/:id', function(req, res) {
    res.json(currentFood[req.params.id]);
});

app.get('/eat/:id', function(req, res) {
    res.render('eat2.html');
});

app.get('/restaurants/:id', function(req, res) {
    ordrin_api.restaurant_details({
        rid: req.params.id
    }, function(data, x) {
        res.json(x);
    });
});

app.get('/', function(req, res) {
    res.render('index2.html');
});

var server = http.createServer(app);

server.listen(process.env.PORT || nconf.get('port'));
console.log('App is online on ' + nconf.get('port'));
load();

var io = require('socket.io').listen(server),
    SerialPort = require('serialport').SerialPort,
    serialport = new SerialPort('/dev/' + nconf.get('serialport'));

serialport.on('open', function() {
    console.log('Serial Port Opend');
    serialport.on('data', function(data) {
        if (data[0] === 1 || data[0] === 3 || data[0] === 2) {
            io.sockets.emit('message', data[0]);
        }
    });
});
