var myApp = angular.module('myApp', ['ngRoute', 'ngResource']);
//const flash = require('connect-flash');
// const session = require('express-session');
// const passport = require('passport');

// //Passport config
// require('./config/passport')(passport)

//ROUTES
myApp.config(function ($routeProvider) {
   
    $routeProvider
    
    .when('/', {
        templateUrl: '/pages/tableFrag.htm',
        controller: 'AppController'
    })
    .when('/edit/:id', {
        templateUrl: 'pages/create.htm',
        controller: 'createTicketController'
    })
    .when('/create', {
        templateUrl: 'pages/create.htm',
        controller: 'createTicketController'
    })
    .when('/cache', {
        templateUrl: 'pages/cacheFrag.htm',
        controller: 'CacheController'
    })
    .when('/create/lists', {
        templateUrl: 'pages/createListFrag.htm',
        controller: 'CreateListController'
    })
    .when('/details/:id', {
        templateUrl: 'pages/cacheDetails.htm',
        controller: 'cacheDetailsController'
    })
    .when('/lists', {
        templateUrl: 'pages/listFrag.htm',
        controller: 'ListController'
    })
    .when('/lists/:id', {
        templateUrl: '/pages/tableFrag.htm',
        controller: 'AppController'
    })
    .when('/lists/edit/:id', {
        templateUrl: '/pages/createListFrag.htm',
        controller: 'CreateListController'
    })
    .when('/login', {
        templateUrl: '/pages/loginFrag.htm',
        controller: 'AppController'
    })

});

//Express Session
// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
// }));

// //Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

//Connect flash

//app.use(flash());




//directives

