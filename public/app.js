var myApp = angular.module('myApp', ['ngRoute', 'ngResource']);

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
        controller: 'AuthController'  
    })
    .when('/logout', {
        templateUrl: '/pages/loginFrag.htm'    
    })
    .when('/user/dashboard', {
        templateUrl: '/pages/user/userDashboard.htm'
    })
    .otherwise({ redirectTo: '/' });
}); 

myApp.run(["$rootScope", "Auth", "$location", "$window",
function($rootScope, Auth, $location, $window) {

  "use strict";

  $rootScope.$on("$locationChangeStart", function(event) {
     
      var url = $location.absUrl();
      if (url.includes('user'))
      {
        if (!Auth.isLoggedIn()) {
            console.log('DENY');
            $location.path('/login');
        }
        else {
            console.log('ALLOW');
        }
    }
  });

}]);
