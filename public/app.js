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
    .when('/info/:num', {
        templateUrl: 'pages/info.htm',
        controller: 'AppController'
    })
    .when('/create', {
        templateUrl: 'pages/create.htm',
        controller: 'AppController'
    })

});

//directives

