
myApp.controller('AuthController', [ '$scope', '$http', '$window', 'loginService', 'cacheService', 'commonFuncsService', 'Auth', function($scope, $http, $window, loginService, cacheService, commonFuncsService, Auth){
    $scope.admin = false;

    $scope.logout = function(){
        commonFuncsService.logout().then(function(response){
            $scope.name = null;
            $scope.admin = false;
            console.log("logout");
            cacheService.clearCache();
            $window.location.href = '#/login';
        });
    }
        commonFuncsService.userInfo().then(function(response)
        {
            Auth.setUser(response.data);
            if (response.data.role=='ADMIN')
            {
                $scope.admin=true;
            }
            $scope.name = response.data.name;
        });
}]);

myApp.controller('AdminController', [ '$scope', '$http', '$window', 'userInfoService', 'cacheService', 'commonFuncsService', 'Auth', function($scope, $http, $window, userInfoService, cacheService, commonFuncsService, Auth){
 
    $scope.deleteUser = function(user)
    {
        if(window.confirm('Are sure you want to delete user' + user.email + "?")){
            console.log("deleted");
            //put your delete method logic here
           }
        var key = {key:'users'}
        cacheService.deleteCache(key);
        userInfoService.deleteUser(user._id);
    }

    $scope.updateUser = function(user, role)
    {
        user.role=role;
        var key = {key:'users'}
        cacheService.deleteCache(key);
        userInfoService.updateUserRole(user._id, role);
    }

        cacheService.getCache({params: {key : "users"}})
            .then(function(response){
                if (Object.keys(response.data).length===0) //converts response to array, then checks if array is not empty
                {
                    
                    userInfoService.getUsers()
                    .then(function(response)
                    {
                        createTable(response.data);
                        cacheService.createCache('users', response.data);
                    })
                       
                }
                else
                {
                    console.log("users cache");
                    createTable(Object.values(response.data));
                }
            })
            function createTable(data)
            {
                $scope.users = data;
                $(document).ready(function() {
                    $('#userstable').DataTable( {
                        responsive: true
                    });
                });
            }
}]);

myApp.controller('cacheDetailsController', [ '$scope', '$http', '$routeParams', 'cacheService', function($scope, $http, $routeParams, cacheService){

    cacheService.getCache({params: {key : $routeParams.id }})
    .then (function(result) {
        $scope.jsonStr = JSON.stringify(result.data, null, "\t");  
    })

}]);

myApp.controller('CreateListController', [ '$scope', '$http', '$routeParams', '$timeout', '$window', 'createListService', 'updateTicketService', 'cacheService', 'loginService', 'Auth', function($scope, $http, $routeParams, $timeout, $window, createListService, updateTicketService, cacheService, loginService, Auth){

    $scope.selectedIds = new Array();
    $scope.tasks = [];

        $scope.init = function () {

            updateTicketService.findUserTickets().then(function(response){
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
            .then(function(response)
            {
            console.log(response.data);
            //add ticket to user's db
            if (Auth.getUser().role!='ADMIN')
            {
                Auth.getUser().lists.push({_id: response.data._id})
                console.log(Auth.getUser().lists);
                loginService.updateUser();
            }
            var key = {key:'list'}
            cacheService.deleteCache(key);
            $window.location.href = '#/lists';
            });

        }
    }
     

}]);

myApp.controller('ListController', [ '$scope', '$http', '$routeParams', 'createListService', 'cacheService', 'loginService', 'Auth', function($scope, $http, $routeParams, createListService, cacheService, loginService, Auth){

    $scope.deleteList = function(id)
    {
        createListService.deleteList(id)
        if (Auth.getUser().role!='ADMIN')
        {
            Auth.getUser().lists = Auth.getUser().lists.filter(list=>list._id !== id);
            loginService.updateUser();
        }
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

myApp.controller('AppController', ['$scope', '$http', '$routeParams', 'updateTicketService', 'deleteTicketService', 'cacheService', 'createListService', 'commonFuncsService', 'loginService', 'Auth', function($scope, $http, $routeParams, updateTicketService, deleteTicketService, cacheService, createListService, commonFuncsService, loginService, Auth){

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
        if (Auth.getUser().role!='ADMIN')
        {
            Auth.getUser().tasks = Auth.getUser().tasks.filter(task=>task._id !== id);
            console.log(Auth.getUser().tasks);
            loginService.updateUser();
        }
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
        cacheService.getCache({params: {key : "tasks"}})
            .then(function(response){
                if (Object.keys(response.data).length===0) //converts response to array, then checks if array is not empty
                {
                    updateTicketService.findUserTickets().then(function(response){
                        createTable(response.data);
                        cacheService.createCache('tasks', response.data);
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

    $scope.clearCache = function(){
        cacheService.clearCache();
        $('#cachetable').dataTable().fnClearTable();
    }
}]);

myApp.controller('createTicketController', ['$scope', '$http', '$window','$routeParams', 'commonFuncsService', 'newTicketService', 'updateTicketService', 'cacheService', 'loginService', 'Auth', function($scope, $http, $window, $routeParams, commonFuncsService, newTicketService, updateTicketService, cacheService, loginService, Auth){

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
                    var key = {key:'tasks'}
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
                    newTicketService.createTicket(req)
                        .then(function(response)
                        {
                            console.log(response.data);
                            //add ticket to user's db
                            if (Auth.getUser().role!='ADMIN')
                            {
                                Auth.getUser().tasks.push({_id: response.data._id})
                                console.log(Auth.getUser().tasks);
                                loginService.updateUser();
                            }
                            var key = {key:'tasks'}
                            cacheService.deleteCache(key);
                            $window.location.href = '#/';
                        });

               

               
                }
            }
        }
}]);