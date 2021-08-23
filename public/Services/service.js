myApp.service('createListService', ['$http', function($http) {
      
        this.getIds = function(){
                return $http.get('/api/findallids').then(function(response)
                {
                        return response;
                });
        }
        this.getLists = function(){
                return $http.get('/api/list/findall').then(function(response)
                {
                        return response;
                });
        }
        this.getList = function(list){
            
                return $http.get('/api/list/find', {params: list}).then(function(response)
                {
                        return response;
                });
        }
        this.updateList = function(list){
                $http.post('/api/list/update', list).then(function(response)
                {
                        return response;
                });
        }
        this.deleteList = function(id){
                var data = {
                        _id : id
                };
                $http.post('/api/list/delete', data).then(function(response)
                {
                        var row = $('#' + id);
                        $('#listtable').dataTable().fnDeleteRow(row);
                        // var key = {key:'api'}
                        // cacheService.deleteCache(key);
                });
        }

        this.createList = function(list){
                var data = {
                        title: list.title,
                        tasks:  list.tasks

                };
   
                $http.post('/api/list/save', data).then(function(response)
                {
                        return response;
                });  
        }
}]);

myApp.service('updateTicketService', ['$http', function($http) {

        this.findAllTickets = function(){
                return $http.get('/api/findall').then(function(response)
                {
                        return response;
                });
        }

        this.findTicket = function(id){
                return $http.get('/api/find', {params: {id : id }}).then(function(response)
                {
                        var t = {
                                id : response.data._id,
                                title: response.data.title,
                                desc: response.data.desc,
                                due: response.data.due,
                                status: response.data.status
                        }
                        return t;                
                });
        }
        this.updateTicket = function(ticket)
        {
        var data = {
                id : ticket.id,
                title: ticket.title,
                desc: ticket.desc,
                due: ticket.due,
                status: ticket.status
        }
                $http.post('/api/update', data).then(function(response)
                {})
        }
}]);

myApp.service('deleteTicketService', ['$http', 'cacheService', function($http, cacheService) {

        this.deleteTicket = function(id){
                var data = {
                        id : id
                };
                $http.post('/api/delete', data).then(function(response)
                {
                        var row = $('#' + id);
                        $('#dtable').dataTable().fnDeleteRow(row);
                        var key = {key:'api'}
                        cacheService.deleteCache(key);
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
                        var ticket = {
                                title : response.data.title,
                                desc : response.data.desc,
                                due : response.data.due,
                                status : response.data.status
                        };
                        var req = {
                                key: response.data._id,
                                value: ticket
                        }   
                });
        
        }


}]);
      
myApp.service('cacheService', ['$http', function($http) {

        this.createCache = function(key, value){
                var data = {
                        key:key,
                        value:value
                }
                $http.post('/api/cache/save', data)
        }
        this.getAllCache = function(){

                return $http.get('/api/cache/findall')
        }
        this.getCache = function(key){
                
                 return $http.get('/api/cache/find', key)
        }

        this.deleteCache = function(id){
                $http.post('/api/cache/delete', id)
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

myApp.service('popService', ['$http', '$resource', function($http, $resource,) {
      
        //         this.popu = function()
        //       {
        
        //         return $http.get('/api/findall').then(function(response)
        //         {
        //                 return response;
        //         });
        
        //          $(document).ready(function() {
              
        //           $.each()
        //               $('#dtable').DataTable( {
        //               ajax: {
        //                       url: url,
        //                       headers: {},
        //                       type : 'GET',
        //                       dataType : 'json',
        //                       dataSrc : "",
        //                       cache : true
        //               },
        //               columns: [
        //                       { data: '_id',
        //                       render:  function (data, type, row) {
        //                               return '<span id=id >' + row._id + '</span>'
        //                           }
        //                       },
        //                       { data: 'title',
        //                       render:  function (data, type, row) {
        //                               return '<span id=title >' + row.title + '</span>'
        //                           } },
        //                       { data: 'desc',
        //                       render:  function (data, type, row) {
        //                               return '<span id=desc >' + row.desc + '</span>'
        //                           } },
        //                       { data: 'due',
        //                       render:  function (data, type, row) {
        //                               return '<span id=due >' + row.due + '</span>'
        //                           } },
        //                       { data: 'status',
        //                       render:  function (data, type, row) {
        //                               return '<span id=status >' + row.status + '</span>'
        //                           } },
        //                       {
        //                           'data': null,
        //                           'render': function (data, type, row) {
        //                                         return '<a id="' + row._id +'" class="btn btn-outline-success" href="#/edit/' + row._id + '"">Edit</a> <a id="' + row._id + '" class="btn btn-outline-danger" onClick="rowClick(id)" >Delete</a>' 
              
        //                                     }
        //                      }
        //                   //    {
        //                   //         'data': null,
        //                   //         'render': function (data, type, row) {
        //                   //                           return '<button id="' + row.id + '" class="dodo" onclick="deleteClick(this)">Delete</button>' 
        //                   //                   }
        //                   //    }
        //                       // { 'data': null, title: 'Action', wrap: true, "render": function (item) { return '<div class="btn-group"><form method="get"action="#/create"><button type="submit"class="btn btn-primary">Edit</button></form></div>' } },
        //                       ]
        //               } );
        //          });
        //       }
        //       $('#datatable').on('click', 'button', function () {
        //           var id = $(this).data();
        //           //var id = table.row($(this)).data();
        //           alert(JSON.stringify(id));
        //       });
         }]);
        