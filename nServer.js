var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var expressValidator = require('express-validator');
var User = require('./models/user');
var Course = require('./models/course');
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

app.use(express.static(__dirname));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

var duplicateError = false;
var nameError = false;
var mailError = false;

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
            return !nameError;

        },
        duplicateEmail : function(value){
            return !mailError;
        }
    }
}));

// Sample data 
/*var users = [
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
];*/

app.get('/', function(req, res) {
    res.sendFile('index.html');
});
//app.get('/courses', all_Courses);
//app.get('/users', all_Users);
//app.get('/course/:code', find_Course);
//app.get('/user/:username', find_User);
//app.get('/login/:username/:password', log_In);
app.get('/current', get_Current_User);
app.get('/logout', log_Out);
app.post('/signup', sign_Up); // Getting the value from a form input
//app.post('/addcourse', add_Course);

function sign_Up(req, res) {

    
    req.assert('username', 'A username is required').notEmpty();
    req.assert('password', 'A password is required').notEmpty();
    req.assert('email', 'A email is required').notEmpty();



    req.checkBody('username',
                  'Username not formatted properly.').isUserName();

    // Checking phone number:
    req.checkBody('password', 'Password not formatted properly.').isPassword();

    // Checking birthday:
    req.checkBody('email', 'Email not formatted properly.').isEmail();

    // Checking for errors and mapping them:
    var errors;
    
    //console.log(errors);

    var mappedErrors;

    duplicateError = false;
    nameError = false;
    mailError = false;

    function duplicate(name,mail,callback){
        User.findOne({username: name}, function(err, foundUser) {
            if (foundUser!==null){
                duplicateError = true;
                nameError=true;
            }
            User.findOne({email: mail}, function(err, foundUser) {
                if (foundUser!==null){
                    duplicateError = true;
                    mailError=true;
                }
                req.checkBody('email', 'A user that uses that email already exists').duplicateEmail();
                req.checkBody('username', 'A user with that username already exists').duplicateUsername();
                errors = req.validationErrors();
                mappedErrors = req.validationErrors(true);
                callback();
            });
        });
    }

    duplicate(req.body.username, req.body.email, function() {
        if (errors || duplicateError) {

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
            var newUser = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                courses: [],
                notes:[]
            });

            newUser.save(function(err, new_User) {
                if (err) throw err;
                req.session.name = req.body.username; // logs in the user after they sign up
                res.send(new_User);
            });
        }
    });
}

/*function all_Courses(req, res) {
    Course.find({}, function(err, allCourses) {
        if (err) throw err;
        res.send(allCourses);
    });
}

function find_Course(req, res) {
    var code = req.params.code;
    Course.find({code: code}, function(err, Course) {
        if (err) throw err;
        res.send(Course);
    });
}

function all_Users(req, res) {
    User.find({}, function(err, allUsers) {
        if (err) throw err;
        res.send(allUsers);
    });
}

function find_User(req, res) {
    var username = req.params.username;
    User.find({username: username}, function(err, foundUser) {
        if (err) throw err;
        res.send(foundUser);
    });
}

function add_Course(req, res) {
    var newCourse = new Course(req.body);

    newCourse.save(function(err, newUser) {
        if (err) throw err;
        res.send('Success');
    });
}

function addTestUser(){
    var newUser = new User({
        username: "joeltest7",
        password: "here",
        courses: ["1234","4343"],
        notes:[
            {
                code:"1234",
                title: "test2"
            }
        ]
    });
    
    newUser.save(function(err, newUser) {
        if (err) throw err;
    });
}

function addTestCourse(){
    var newCourse = new Course({
        code: "2348",
        notes: []
    });
    
    newCourse.save(function(err, newCourse) {
        if (err) throw err;
    });
}
*/
function log_In(req, res) {
    var username = req.params.username;
    var password = req.params.password;
    User.findOne({username: username}, function(err, User) {
        if (err) throw err;
        if(User.password==password){
            req.session.name = username;
            res.send("Success");
        }
        else{
            res.send("Invalid Login ");
        }
    });
}

function log_Out(req, res) {
    req.session = null;
    return res.json({});
}

function get_Current_User(req, res){
    if (req.session.name) {
        res.send(req.session.name);
    }
    else {
        res.send("failure");
    }
}


app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
