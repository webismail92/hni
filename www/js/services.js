
var adminurl = "my url";
var myservices = angular.module('myservices', [])


    .factory('MyServices', function ($http, $location,$httpParamSerializerJQLike ) {




        return {
            insertUser: function (retailerdata) {
                console.log("in insertuser function ! ");
                return $http({
                    url: 'http://localhost:8000/api/retailer/register',
                    method: 'POST',
                    data: $httpParamSerializerJQLike(retailerdata), // Make sure to inject the service you choose to the controller
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                    }
                  }).success(function(response) { /* do something here */ });

            },
            doLogin: function (retailerdata) {
                console.log("in dologin function ! ");
                return $http.post("http://localhost:8000/api/retailer/register");
                    
            }
                    
            


        }
    });