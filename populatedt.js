myApp.service('popService', [function($) {

    
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