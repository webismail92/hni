
var adminurl = "my url";
var myservices = angular.module('myservices', [])


    .factory('MyServices', function ($http, $location,) {




        return {
            insertUser: function (retailerdata) {
                console.log(retailerdata);
                return $http({
                    url: 'http://localhost:8000/api/retailer/register',
                    method: 'POST',
                    data: {
                        name: "Kim",
                        status: "Best Friend"
                    }
                  }).success(function(response) { 
                      console.log(response);
                  });

            },
            doLogin: function (retailerdata) {
                console.log("in dologin function ! ");
                return $http.post("http://localhost:8000/api/retailer/register");
                    
            }
                    
            


        }
    });