var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./note-routes');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var app = express();

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));

app.use(cookieParser('notsosecret'));
app.use(session({
    secret: 'notsosecretkey123'
}));

app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({  
	extended: true   
}));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/courses', routes.findAllCourses);
app.get('/users', routes.findAllUsers);
app.get('/course/:code', routes.findCourse);
app.get('/user/:username', routes.findUser);
app.get('/login/:username/:password', routes.login);
app.get('/current', routes.getCurrentUser);
app.get('/logout', routes.logout);

app.post('/adduser', routes.addUser);
app.post('/addcourse', routes.addCourse);

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
