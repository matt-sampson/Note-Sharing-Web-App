var User = require('./models/user');
var Course = require('./models/course');

exports.findAllCourses = function(req, res) {
    Course.find({}, function(err, allCourses) {
        if (err) throw err;
        res.send(allCourses);
    });
};

exports.findCourse = function(req, res) {
    var code = req.params.code;
    Course.find({code: code}, function(err, Course) {
        if (err) throw err;
        res.send(Course);
    });
};

exports.findAllUsers = function(req, res) {
    User.find({}, function(err, allUsers) {
        if (err) throw err;
        res.send(allUsers);
    });
};

exports.findUser = function(req, res) {
    var username = req.params.username;
    User.find({username: username}, function(err, User) {
        if (err) throw err;
        res.send(User);
    });
};

exports.addUser = function(req, res) {
    var newUser = new User(req.body);

    newUser.save(function(err, newUser) {
        if (err) throw err;
        res.send('Success');
    });
}

exports.addCourse = function(req, res) {
    var newCourse = new Course(req.body);

    newCourse.save(function(err, newUser) {
        if (err) throw err;
        res.send('Success');
    });
}

/*function addTestUser(){
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
    })
    
    newUser.save(function(err, newUser) {
        if (err) throw err;
    });
}*/

/*function addTestCourse(){
    var newCourse = new Course({
        code: "2348",
        notes: []
    })
    
    newCourse.save(function(err, newCourse) {
        if (err) throw err;
    });
}*/

exports.login = function(req, res) {
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
};

exports.getCurrentUser = function(req, res){
    if (req.session.name) {
        res.send(req.session.name);
    }
    else {
        res.send("failure");
    }
}

exports.logout = function(req, res) {
    req.session = null;
    return res.json({});
}