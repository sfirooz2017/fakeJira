
myApp.controller('AuthController', [ '$scope', '$http', '$window', 'loginService', 'cacheService', 'commonFuncsService', 'Auth', function($scope, $http, $window, loginService, cacheService, commonFuncsService, Auth){

    var user = {
    email: $scope.email,
    password: $scope.password,
    name: $scope.name
    }

    $scope.logout = function(){
        commonFuncsService.logout().then(function(response){
            Auth.setUser(undefined);
            $scope.name = null;
            $window.location.href = '#/login';
        });
    }

    commonFuncsService.userInfo().then(function(response){
        var tempUser = {
            name: response.data.name,
            email: response.data.email
        }
        Auth.setUser(tempUser);
        $scope.name = response.data.name;
    });
    // loginService.loginUser(user)
    // .then (function(result){

    // })

    //if form valid, call login

}]);
myApp.controller('cacheDetailsController', [ '$scope', '$http', '$routeParams', 'cacheService', function($scope, $http, $routeParams, cacheService){

    cacheService.getCache({params: {key : $routeParams.id }})
    .then (function(result) {
        $scope.jsonStr = JSON.stringify(result.data, null, "\t");  
    })

}]);

myApp.controller('CreateListController', [ '$scope', '$http', '$routeParams', '$timeout', '$window', 'createListService', 'updateTicketService', 'cacheService', function($scope, $http, $routeParams, $timeout, $window, createListService, updateTicketService, cacheService){

    $scope.selectedIds = new Array();
    $scope.tasks = [];

        $scope.init = function () {

            updateTicketService.findAllTickets().then(function(response){
                var tickets = response.data;
        
                tickets.forEach((tic => {
                        var temp = {_id: tic._id, title: tic.title}
                        $scope.tasks.push(temp);
                    }));

            });
        }

    $scope.init();

    $scope.$watch(function() {
        $('.selectpicker').selectpicker('refresh');
    });
    // FOR SELECTED LIST
    if ($routeParams.id != null)
    {
        createListService.getList({id:$routeParams.id})
            .then(function (response)
            {
                $scope.title = response.data.title;
                $scope.id = response.data._id;
                    $timeout(function () { 
                    console.log(response);
                    response.data.tasks.forEach((task => {
                        var temp = {_id: task._id}
                        $scope.selectedIds.push(temp);
                
                        console.log(task._id);
                    }));
                });
        //$('.selectpicker').selectpicker('refresh');
            })

        $('#submitBtn').text('Update');
        $scope.createList = function(){
            if ($scope.titleForm.$valid)
            {
                var list = {
                    title: $scope.title,
                    tasks: 
                        $scope.selectedIds,
                    _id: $scope.id
                }

                createListService.updateList(list)
                var key = {key:'list'}
                cacheService.deleteCache(key);
                $window.location.href = '#/lists';
            }    
        } 
    }
    else
    {
        $scope.createList = function(){

            var list = {
                title: $scope.title,
                tasks: 
                    $scope.selectedIds
            }

            createListService.createList(list)
            var key = {key:'list'}
            cacheService.deleteCache(key);
            $window.location.href = '#/lists';

        }
    }
     

}]);

myApp.controller('ListController', [ '$scope', '$http', '$routeParams', 'createListService', 'cacheService', function($scope, $http, $routeParams, createListService, cacheService){

    $scope.deleteList = function(id)
    {
    createListService.deleteList(id)
    }

        cacheService.getCache({params: {key : "list"}})
            .then(function(response){
                if (Object.keys(response.data).length===0) //converts response to array, then checks if array is not empty
                {
                    createListService.getLists()
                    .then(function(response)
                    {
                        createTable(response.data);
                        cacheService.createCache('list', response.data);
                    })
                       
                }
                else
                {
                    console.log("list cache");
                    createTable(Object.values(response.data));
                }
            })
            function createTable(data)
            {
                $scope.lists = data;
                $(document).ready(function() {
                    $('#listtable').DataTable( {
                        responsive: true
                    });
                });
            }
    


}]);

myApp.controller('AppController', ['$scope', '$http', '$routeParams', 'updateTicketService', 'deleteTicketService', 'cacheService', 'createListService', 'commonFuncsService', function($scope, $http, $routeParams, updateTicketService, deleteTicketService, cacheService, createListService, commonFuncsService){

    $scope.tickets = [];
    var list = null;
    var ids;
    var id = {id: $routeParams.id};

    if($routeParams.id!=null){
        createListService.getList(id)
            .then(function(response){
                list = response.data;
                ids = list.tasks;
                loadTableData();
            });
    }
    else
    {
        loadTableData();
    }
    $scope.rowClick = function(id){

        deleteTicketService.deleteTicket(id);
    }

    function createTable(response){

        response.forEach((c => {

            if($routeParams.id!=null)
            {
                if (ids.filter(i => i._id === c._id).length > 0) 
                    {               
                         $scope.tickets.push(c)
                    }
            }
            else
            {
                $scope.tickets.push(c)
            }
        }))
        $(document).ready(function() {
            $('#dtable').DataTable( {
                responsive: true
            });
        });
    }
    function loadTableData(){
        cacheService.getCache({params: {key : "api"}})
            .then(function(response){
                if (Object.keys(response.data).length===0) //converts response to array, then checks if array is not empty
                {
                    updateTicketService.findAllTickets().then(function(response){
                        createTable(response.data);
                        cacheService.createCache('api', response.data);
                    });
                }
                else
                {
                    console.log("cache");
                    createTable(Object.values(response.data));
                    response=[];
                }
            })
    }
}]);

myApp.controller('CacheController', ['$scope', 'cacheService', function($scope, cacheService){

    $scope.caches = [];

    cacheService.getAllCache().then(function(response){
        Object.values(response.data).forEach((c => {
            $scope.caches.push(c)
        }))
        $(document).ready(function() {
            $('#cachetable').DataTable( {
                responsive: true
            } );
       });
    });
    $scope.deleteCache = function(id){
        var key = {key:id}
        cacheService.deleteCache(key);
        var row = $('#' + id.toString());
        $('#cachetable').dataTable().fnDeleteRow(row);
    }
}]);

myApp.controller('createTicketController', ['$scope', '$http', '$window','$routeParams', 'commonFuncsService', 'newTicketService', 'updateTicketService', 'cacheService', function($scope, $http, $window, $routeParams, commonFuncsService, newTicketService, updateTicketService, cacheService){

    $scope.validDate = commonFuncsService.validDate;

        //if editing a pre-existing ticket

        if($routeParams.id)
        {  
            updateTicketService.findTicket($routeParams.id)
                .then(function(ticket){
                    $scope.ticket = ticket;
                    switch (ticket.status)
                    {
                        case 'To Do':
                            $scope.status = $scope.options[0]; 
                            break;
                        case 'In Progress':
                            $scope.status = $scope.options[1]; 
                            break;
                        case 'Done':
                            $scope.status = $scope.options[2]; 
                            break;
                        default:
                            $scope.status = $scope.options[0];  
                    }
                })
            $('#submitBtn').text('Update');
            $scope.clickFunction = function(req){
                if ($scope.titleForm.$valid)
                {
                    var req = {
                        "id": $routeParams.id,
                        "title": $scope.ticket.title,
                        "desc": $scope.ticket.desc,
                        "due": $scope.ticket.due,
                        "status": $scope.ticket.status
                    }
                    updateTicketService.updateTicket(req);
                    var key = {key:'api'}
                    cacheService.deleteCache(key);
                    $window.location.href = '#/';
                }
            }
        }
        //if creating a new ticket
        else
        {
            $scope.clickFunction = function(req){
                if ($scope.titleForm.$valid)
                {
                    var req = {
                    // "id": $scope.ticket._id,
                        "title": $scope.ticket.title,
                        "desc": $scope.ticket.desc,
                        "due": $scope.ticket.due,
                        "status": $scope.ticket.status
                    }
                    newTicketService.createTicket(req);
                    var key = {key:'api'}
                    cacheService.deleteCache(key);
                    $window.location.href = '#/';
                }
            }
        }
}]);

