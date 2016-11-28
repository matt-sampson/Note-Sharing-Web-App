var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
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


// Sample data 
var users = [
    {
        username : 'asa',
        password : 'sswd',
        email : 'some@rand.com'
    },
    {
        username : 'asaassa',
        password : 'sswqwdqwq1212',
        email : 'someq22@rand.com'
    },
    {
        username : 'asdsdswwwa',
        password : '1212sasdqw',
        email : 'some44@rand.com'
    }
];

app.use(expressValidator({
    customValidators: {
        
        isUserName: function(value) {
            return value.search( /[A-Za-z0-9]+/ ) !== -1;
        },
        isPassword: function(value) {
            return value.search(/[A-Za-z0-9]+/) !== -1;
            //(\()?(\d{3})(\))?(-)?(\d{3})(-)?(\d{4})
        },
        isEmail: function(value) {
            return value.search( /^[A-Za-z0-9]+@[A-Za-z0-9]+\.com$/ ) !== -1;
        },
        duplicateUsername : function(value){
            console.log(value);
            for(var i = 0; i < users.length; i++){
                if(users[i].username == value)
                    return false;
            }

            return true;
        },
        duplicateEmail : function(value){
            console.log(value);
            for(var i = 0; i < users.length; i++){
                if(users[i].email == value)
                    return false;
            }

            return true;
        }
    }
})); 


// Getting the value from a form input:
app.post('/signup', function(req, res) {

    
    req.assert('username', 'A username is required').notEmpty();
    req.assert('password', 'A password is required').notEmpty();
    req.assert('email', 'A email is required').notEmpty();



    req.checkBody('username',
                  'Username not formatted properly.').isUserName();

    // Checking phone number:
    req.checkBody('password', 'Password not formatted properly.').isPassword();

    // Checking birthday:
    req.checkBody('email', 'Email not formatted properly.').isEmail();

    req.checkBody('email', 'A user that uses that email already exists').duplicateEmail();

    req.checkBody('username', 'A user with that username already exists').duplicateUsername();

    // Checking for errors and mapping them:
    var errors = req.validationErrors();
    
    //console.log(errors);

    var mappedErrors = req.validationErrors(true);

    if (errors) {

        // If errors exist, send them back to the form:
        var errorMsgs = { 'errors': {} };

        if (mappedErrors.username) {
            errorMsgs.errors.error_username = mappedErrors.username.msg;
            console.log(errorMsgs.errors.error_username);
        }

        if (mappedErrors.password) {
            errorMsgs.errors.error_password = mappedErrors.password.msg;
            console.log(errorMsgs.errors.error_password);
        }

        if (mappedErrors.email) {
            errorMsgs.errors.error_email = mappedErrors.email.msg;
            console.log(errorMsgs.errors.error_email);
        }


        res.render('index', errorMsgs);


    } else {
        var response = {
            'username' : req.body.username,
            'password' : req.body.password,
            'email' : req.body.email
        };

        users.push(response);
        console.log(users);

        res.end(JSON.stringify(response));
    }
});


app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
