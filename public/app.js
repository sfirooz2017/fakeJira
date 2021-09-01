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
        templateUrl: '/pages/loginFrag.htm'
       // controller: 'AuthController'  
    })
    .when('/logout', {
        templateUrl: '/pages/loginFrag.htm'    
    })
    .when('/user/dashboard', {
        templateUrl: '/pages/user/userDashboard.htm'
    })
    .when('/admin/users', {
        templateUrl: '/pages/admin/usersFrag.htm',
        controller: 'AdminController'  

    })
    .otherwise({ redirectTo: '/' });
}
);
myApp.factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
	return {
		response: function(response){
			if (response.status === 401) {
				console.log("Response 401");
			}
			return response || $q.when(response);
		},
		responseError: function(rejection) {
			if (rejection.status === 401) {
				console.log("Response Error 401",rejection);
				$location.path('/login');
			}
            if (rejection.status === 402) {
				console.log("Response Error 402",rejection);
				$location.path('/');
			}
			return $q.reject(rejection);
		}
	}
}])
myApp.config(['$httpProvider',function($httpProvider) {
	//Http Intercpetor to check auth failures for xhr requests
	$httpProvider.interceptors.push('authHttpResponseInterceptor');
}])