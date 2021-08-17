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
    .when('/lists', {
        templateUrl: 'pages/listFrag.htm',
        controller: 'AppController'
    })
    .when('/details/:id', {
        templateUrl: 'pages/cacheDetails.htm',
        controller: 'cacheDetailsController'
    })

});

//directives

