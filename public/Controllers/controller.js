
myApp.controller('updateController', [ '$scope', '$http', '$routeParams', 'updateTicketService', function($scope, $http, $routeParams, updateTicketService){

 
      

  
   // $scope.init = function() {

            updateTicketService.updateTicket($routeParams.id)
            .then(function(ticket){
                $scope.ticket = ticket;
                console.log(ticket);
            })
            $('#submitBtn').text('Update');
    //     id : data.id,
    //     title: data.title,
    //     desc: data.desc,
    //     due: data.due,
    //     status: data.status
    // }

   // }
}]);


myApp.controller('AppController', ['$scope', '$http', 'popService', 'deleteTicketService', function($scope, $http, popService, deleteTicketService){

    rowClick = function(id){
       
        deleteTicketService.deleteTicket(id);

    }
    
    popService.popu("/api/findall");
}]);
myApp.controller('CacheController', ['$scope', '$http', 'popService', 'deleteTicketService', function($scope, $http, popService, deleteTicketService){

    rowClick = function(id){
       
        deleteTicketService.deleteTicket(id);
    }
    popService.popu("/api/cache/findall");
}]);


myApp.controller('createTicketController', ['$scope', '$http', '$window','$routeParams', 'commonFuncsService', 'newTicketService', 'updateTicketService', function($scope, $http, $window, $routeParams, commonFuncsService, newTicketService, updateTicketService){

   // console.log($scope.status);

 

    $scope.validDate = commonFuncsService.validDate

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
                console.log(req + 'req');
                updateTicketService.updateTicket(req);
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
                $window.location.href = '#/';
            }

        }
    }


}]);

