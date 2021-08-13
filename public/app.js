var myApp = angular.module('myApp', ['ngRoute', 'ngResource']);

// $(document).ready(function() {
//     console.log("dt");
//     $('dtable').dataTable( {
//         aaSorting: [[0, 'desc']]
//       } );
// } );

//ROUTES
myApp.config(function ($routeProvider) {
   
    $routeProvider
    
    .when('/', {
        templateUrl: '/pages/tableFrag.htm',
        controller: 'AppController'
    })
    .when('/edit/:id', {
        templateUrl: 'pages/create.htm',
        controller: 'AppController'
    })
    .when('/create', {
        templateUrl: 'pages/create.htm',
        controller: 'AppController'
    })
    .when('/cache', {
        templateUrl: 'pages/tableFrag.htm',
        controller: 'CacheController'
    })

});

//directives

