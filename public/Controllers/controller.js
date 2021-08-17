myApp.controller('cacheDetailsController', [ '$scope', '$http', '$routeParams', 'cacheService', function($scope, $http, $routeParams, cacheService){

  
    cacheService.getCache({params: {key : $routeParams.id }})
    .then (function(result) {
        $scope.jsonStr = JSON.stringify(result.data, null, "\t");
      
 })

   


}]);


myApp.controller('ListController', [ '$scope', '$http', '$routeParams', 'createListService', function($scope, $http, $routeParams, createListService){


  // $scope.tasks = 
    $scope.selectedIds = [];

    $scope.init = function () {

        createListService.getIds()
        .then(function(response)
        {
            var ids = response.data;
    
            ids.forEach((id => {
                $scope.tasks.push(id._id);
                console.log(id._id);
            }));
        })

           $('select').selectpicker();
      }
      $scope.tasks = [];
    
 
      $scope.clickFunction = function(id){

        console.log($scope.selectedIds + 'ewf')
      }

}]);

myApp.controller('AppController', ['$scope', '$http', 'popService', 'deleteTicketService', 'cacheService', function($scope, $http, popService, deleteTicketService, cacheService){

    $scope.tickets = [];

    $scope.rowClick = function(id){
       
        deleteTicketService.deleteTicket(id);

    }

    function createTable (response){

        response.forEach((c => {
            $scope.tickets.push(c)
        }))
        $(document).ready(function() {
            $('#dtable').DataTable( {
                responsive: true
            } );
        });

    }
    
    cacheService.getCache({params: {key : "api"}})
        .then(function(response){
            if (Object.keys(response.data).length===0)
            {
                popService.popu().then(function(response){

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

        
    
  
  //  popService.popu("/api/findall");
}]);
myApp.controller('CacheController', ['$scope', '$http', 'cacheService', 'deleteTicketService', function($scope, $http, cacheService, deleteTicketService){

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
    // popService.popu("/api/cache/findall");
}]);


myApp.controller('createTicketController', ['$scope', '$http', '$window','$routeParams', 'commonFuncsService', 'newTicketService', 'updateTicketService', 'cacheService', function($scope, $http, $window, $routeParams, commonFuncsService, newTicketService, updateTicketService, cacheService){

   // console.log($scope.status);

 

    $scope.validDate = commonFuncsService.validDate;

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

