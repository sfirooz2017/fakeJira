

myApp.controller('AppController', ['$scope', '$http', 'popService', function($scope, $http, popService){

    $scope.statuses = new Array();

    popService.popu();


    

    $http.get('/contactlist').success(function(response) {

        for (var res of response)
        {
            //console.log("get response:" + res.title);
            var ticket = 
            {
                id: res._id,
                title: res.title,
                desc: res.desc,
                due: res.due,
                status: res.status
            }
                //$scope.contactlist = response;
                if (!$scope.statuses[ticket.status]) 
                {
                    $scope.statuses[ticket.status] = new Array();
                }
                $scope.statuses[ticket.status].push(ticket);
                // for (var t of $scope.statuses[ticket.status])
                // {
                // console.log(t);
                // } 
              
        }

           

    });


 

    $scope.deleteTicket = function(id){
        
        $http.delete('/contactlist/' + id).success(function(response){
            console.log("edited");
            //remove from persistent data
        })
    };
    $scope.editTicket = function(id){
        
        $http.get('/contactlist/edit/' + id).success(function(response){
            console.log("edited");
            //add to persistent data
        })
    };

    $scope.updateTicket = function(id){
        
        $http.get('/contactlist/' + id).success(function(response){
            console.log("edited");
            //add to persistent data
        })
    };

}]);

myApp.controller('ticketController', ['$scope', '$http', function($scope, $http){
    $http.get('/contactlist').success(function(response) {
        $scope.ticket = response;

       console.log("contact list " + response[0].title);

    });

}]);

myApp.controller('createTicketController', ['$scope', '$http', 'commonFuncsService', 'newTicketService', function($scope, $http, commonFuncsService, newTicketService){

   // console.log($scope.status);
    console.log($scope.title);

    $scope.validDate = commonFuncsService.validDate
  
  
    $scope.addTicket = function(req){
       // console.log($scope.ticket);
        $http.post('/contactlist', req); //post to the route contactlist with the data ticket to server
    }; 
    $scope.newTicket = function(req){
        var req = {
            "title": $scope.title,
            "desc": $scope.desc,
            "due": $scope.due,
            "status": "Todo"
        }
        newTicketService.createTicket(req);
    }


}]);


//SERVICES

myApp.service('popService', ['$resource', function($resource) {

  //  this.mongoAPI = $resource("/findall", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
 //  console.log(this.mongoAPI);
  // this.weatherResult = this.mongoAPI.get({ q: $scope.city, cnt: $scope.days, appid: "504c6405e52501d037a8bdaff8774761" });


  this.popu = function()
{
   $(document).ready(function() {

    $.each()
        $('#dtable').DataTable( {
        ajax: {
                url: "/api/findall",
                headers: {},
                type : 'GET',
                dataType : 'json',
                dataSrc : "",
                cache : true
        },
        columns: [
                { data: '_id' },
                { data: 'title' },
                { data: 'desc' },
                { data: 'due' },
                { data: 'status' },
                { 'data': null, title: 'Action', wrap: true, "render": function (item) { return '<div class="btn-group"><form method="get"action="#/create"><button type="submit"class="btn btn-primary">Edit</button></form></div>' } },
                ]
        } );
   });
}

}]);

myApp.service('newTicketService', ['$http', function($http) {

    this.createTicket = function(ticket){


        var data = {
            title : ticket.title,
            desc : ticket.desc,
            due : ticket.due,
            status : ticket.status
        };
        $http.post('/api/save', data).then(function(response)
        {
            console.log(response.data + "controller");
            
         });
        // $http({
        //     method: 'POST',
        //     url: '/api/save',
        //     data: {
        //         title : ticket.title,
        //         desc : ticket.desc,
        //         due : ticket.due,
        //         status : ticket.status
        //     }
        // });

    }


}]);

myApp.service('commonFuncsService', [function() {

    this.validDate = function (dateString)
    {
        // First check for the pattern
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
            return false;
    
        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);
    
        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;
    
        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    
        // Adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;
    
        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    };

}]);