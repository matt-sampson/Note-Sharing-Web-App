var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var expressValidator = require('express-validator');
var User = require('./models/user');
var Course = require('./models/course');
var Note = require('./models/note');
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

var nameError = false; // for if a user is trying to sign up with a taken username
var mailError = false; // for if a user is trying to sign up with a taken email
var titleError = false; // for if a user is trying to name a note with an already taken note title
var courseError = false; //for if a user trys to give a note an invalid course name
var passmatch = true; // for when a user enters a username and password and then checks to see if they are in the database and they match
var userExist = true; // for when a user tries to log in with a username not in the database

app.use(expressValidator({
    customValidators: {
        
        isUserName: function(value) {
            return value.search( /[A-Za-z0-9]+/ ) !== -1; //usernames are letters or numbers
        },
        isPassword: function(value) {
            return value.search(/[A-Za-z0-9]+/) !== -1; //passwords are letters or numbers
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
        },
        matchPassword : function(value){
            return passmatch;
        },
        userCheck : function(value){
            return userExist;
        }
    }
}));

app.get('/', function(req, res) {
    res.render('indextest', {errors : ''});
});
app.get('/note', function(req, res) {
    if(req.query.title){
        req.session.title=req.query.title;
    }
    res.render('note');
});
app.get('/noteNoEdit', function(req, res) {
    if(req.query.title){
        req.session.title=req.query.title;
    }
    res.render('noteNoEdit');
});
app.get('/course_info', function(req, res) {
    if(req.query.code){
        req.session.code=req.query.code;
    }
    res.render('course_info');
});

app.get('/courses', all_Courses); // returns all courses information when typed into browser
app.get('/users', all_Users); // returns all users information when typed into browser
app.get('/notes', all_Notes); // returns all notes information when typed into browser
app.get('/current', get_Current_User_Name); // get the username of the logged in user
app.get('/currentDoc', current_User_Doc); // get the document of the logged in user
app.get('/currentCode', current_Code); // get the course code stored in a session variable for course information page
app.get('/currentTitle', current_Title); // get the note title stored in a session variable for the note viewing page
app.get('/logout', log_Out); // log out the current user
app.post('/login', log_In); //  log a user into the website
app.post('/notesave', note_Save); // save a note to the database
app.post('/signup', sign_Up); // sign the user up for the website
app.post('/addACourse', add_Course); // add a course to the database (admin only)
app.post('/searchCourse',search_Course); // search for a given course
app.post('/addAdmin', add_Admin); // make another user an admin (admin only)

function add_Admin(req, res) {
    User.findOne({username:req.body.username},function(err,foundUser){
        if(foundUser===null){
            res.send(false);
        }
        else{
            foundUser.admin = true;
            foundUser.save(function(err) {
                if (err) throw err;
            });
            res.send(true);
        }
    });
}

function search_Course(req, res) {
    Course.findOne({code:req.body.code},function(err,foundCourse){
        if(foundCourse===null){
            res.send(false);
        }
        else{
            res.send(foundCourse.code);
        }
    });
}

function add_Course(req, res) {
    Course.findOne({code:req.body.code},function(err,foundCourse){
        if(foundCourse===null){
            var newCourse = new Course({
                    code: req.body.code,
                    notes:[]
            });

            newCourse.save(function(err, newCourse) {
                if (err) throw err;
                res.send(true);
            });
        }
        else{
            res.send(false);
        }
    });
}

function current_Code(req,res){
    Course.findOne({code:req.session.code}, function(err,foundCourse){
        res.send(foundCourse);
    });
}

function current_User_Doc(req,res){
    User.findOne({username:req.session.name}, function(err,foundUser){
        res.send(foundUser);
    });
}

function current_Title(req,res){
    Note.findOne({title:req.session.title}, function(err,foundNote){
        if(foundNote !== null){
            res.send(foundNote);
        }
        else{
            res.send(false);
        }
    });
}

function note_Save(req, res) {

    titleError = false;
    courseError = false;

    function noteCheck(Title,Uploader,Code,callback){
        Note.findOne({title:Title}, function(err, foundNote) {
            if (foundNote!==null){
                if (foundNote.uploader !== Uploader){
                    titleError=true;
                } 
            }
            Course.findOne({code:req.body.code}, function(err, foundCourse){
                if(foundCourse===null){
                    courseError=true;
                }
                callback();
            });
        });
    }

    noteCheck(req.body.title, req.body.uploader, req.body.code, function() {
        if (titleError) {
            res.send("0");

        } else if(courseError){
            res.send("1");
        }
        else {
            Course.findOne({code:req.body.code}, function(err, foundCourse) {
                Course.findOne({"notes.title":req.body.title}, function(err, foundNote) {
                    if(foundNote===null){
                        foundCourse.notes.push({
                            uploader: req.body.uploader,
                            title: req.body.title
                        });
                        foundCourse.save(function(err) {
                            if (err)
                                console.log('error');
                            else{
                                console.log('success');         
                            }
                        }); 
                    }   
                });
            });
            User.findOne({username:req.body.uploader}, function(err, foundUser) {
                User.findOne({"notes.title":req.body.title}, function(err, foundNote) {
                    if(foundNote===null){
                        foundUser.notes.push({
                            code: req.body.code,
                            title: req.body.title,
                        });
                        foundUser.save(function(err) {
                            if (err)
                                console.log('error');
                            else{
                                console.log('success');         
                            }
                        }); 
                    }
                });
            });
            Note.findOne({title :req.body.title}, function(err, foundNote) {
                if(foundNote === null){
                    var newNote = new Note({
                        uploader: req.body.uploader,
                        code: req.body.code,
                        title: req.body.title,
                        text: req.body.text,
                    });
                    newNote.save(function(err) {
                        if (err) throw err;
                    });
                }
                else{
                    foundNote.text = req.body.text;
                    foundNote.code = req.body.code;
                    foundNote.save(function(err) {
                        if (err) throw err;
                    });
                }
            });
            res.send("2");
        }
    });
}

function sign_Up(req, res) {

    
    req.assert('username', 'A username is required').notEmpty();
    req.assert('password', 'A password is required').notEmpty();
    req.assert('email', 'A email is required').notEmpty();



    req.checkBody('username','Username not formatted properly.').isUserName();

    // Checking phone number:
    req.checkBody('password', 'Password not formatted properly.').isPassword();

    // Checking birthday:
    req.checkBody('email', 'Email not formatted properly.').isEmail();

    // Checking for errors and mapping them:
    var errors;
    
    //console.log(errors);

    var mappedErrors;

    nameError = false;
    mailError = false;

    function duplicate(name,mail,callback){
        User.findOne({username: name}, function(err, foundUser) {
            if (foundUser!==null){
                nameError=true;
            }
            User.findOne({email: mail}, function(err, foundUser) {
                if (foundUser!==null){
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
        if (errors || mailError || nameError) {

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


            res.render('indextest', errorMsgs);


        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                admin: false,
                notes:[]
            });

            newUser.save(function(err, new_User) {
                if (err) throw err;
                req.session.name = req.body.username; // logs in the user after they sign up
                if(new_User.admin){
                    res.sendFile(__dirname + '/admin_home_page.html');
                }else{
                    res.sendFile(__dirname + '/user_home_page.html');
                }
            });
        }
    });
}

function all_Courses(req, res) {
    Course.find({}, function(err, allCourses) {
        if (err) throw err;
        res.send(allCourses);
    });
}

function all_Users(req, res) {
    User.find({}, function(err, allUsers) {
        if (err) throw err;
        res.send(allUsers);
    });
}

function all_Notes(req, res) {
    Note.find({}, function(err, allNotes) {
        if (err) throw err;
        res.send(allNotes);
    });
}

function log_In(req, res) {
    passmatch = true;
    userExist = true;
    var loginFail = true;
    req.assert('username', 'A username is required').notEmpty();
    req.assert('password', 'A password is required').notEmpty();

    req.checkBody('username','Username not formatted properly.').isUserName();
    req.checkBody('password', 'Password not formatted properly.').isPassword();

    User.findOne({username: req.body.username}, function(err, User) {
        if(User !== null){
            if (err) throw err;
            if(User.password==req.body.password){
                req.session.name = req.body.username;
                loginFail=false;
                if(User.admin){
                    res.sendFile(__dirname + '/admin_home_page.html');
                }else{
                    res.sendFile(__dirname + '/user_home_page.html');
                }
            }
            else{
                passmatch = false;
                req.checkBody('password', 'Password doesnt match username' ).matchPassword();
            }
        }
        else{
            userExist = false;
            req.checkBody('username', 'Username not in database' ).userCheck();
        }
        if(loginFail){
            var errors = req.validationErrors();
            var mappedErrors = req.validationErrors(true);
            var errorMsgs = { 'errors': {} };

            if (mappedErrors.username) {
                errorMsgs.errors.error_login = mappedErrors.username.msg;
                console.log(errorMsgs.errors.error_login);
            }

            if (mappedErrors.password) {
                errorMsgs.errors.error_login = mappedErrors.password.msg;
                console.log(errorMsgs.errors.error_login);
            }

            res.render('indextest', errorMsgs);
        }
    });
}

function log_Out(req, res) {
    req.session = null;
    return res.json({});
}

function get_Current_User_Name(req, res){
    if (req.session.name) {
        res.send(req.session.name);
    }
    else {
        res.send(false);
    }
}


app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
