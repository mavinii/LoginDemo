const express               = require('express');
const mongoose              = require('mongoose');
const passport              = require('passport');
const bodyParser            = require('body-parser');
const User                  = require('./models/user');
const LocalStrategy         = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

//======================
// CONNECTION TO DATA BASE
//======================
mongoose.connect('mongodb+srv://pgmarcosoliveira:KGZ5vhRVN!ZAiW!@cluster0-jqh2a.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log('ERROR:', err.message);
});

var app = express();                                //uso de rotas na aplicacao
app.set('view engine', 'ejs');                      //tira o html da URL
app.use(bodyParser.urlencoded({extended: true}));   //recupera os dados do formulario da pagina /register toda vez que usa (form ou post ou request)
app.use(require("express-session")({
    secret: "Marcos is develop FullStack",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); //precisamos dessas duas linhas sempre que usamos o passaport
app.use(passport.session());    //precisamos dessas duas linhas sempre que usamos o passaport

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // ESSAS duas linhas sao importantes porque leeam a sessão e incoda e desencoda 
passport.deserializeUser(User.deserializeUser());

// SERVER PORT
var port = 3000;

//======================
// ROUTES
//======================
app.get("/", function(req, res){
    res.render("home");
});

app.get("/painel", isLoggedIn,function(req, res){
    res.render("painel");
});

//show sign up form
app.get("/register", function(req, res){
    res.render("register");
});
//handling user sign up
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/painel");
        })
    });    
});

// LOGIN ROUTES
// render login form
app.get("/login", function(req, res){
    res.render("login");
});
// Login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/painel",
    failureRedirect: "/login"
}), function(req, res){
});
// Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
}); 
// Check is user is Login or/and Logout
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//======================
// START THE SERVER
//======================
app.listen(port, () => console.log(`App listening on port ${port}!`));