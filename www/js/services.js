
var adminurl = "my url";
var myservices = angular.module('myservices', [])


    .factory('MyServices', function ($http, $location) {




        return {
            insertUser: function (retailerdata) {
               
                return $http({
                    url: 'http://localhost:8000/api/retailer/register',
                    method: 'POST',
                    data : retailerdata,
                  
                     "async" : false,
                   
                  }).success(function(response) { 
                   
                  }).error(function(response){
              
                 });
        
            },
            doLogin: function (retailerdata) {
                console.log("in dologin function ! ");
                return $http.post("http://localhost:8000/api/demo");
                    
            },
            getProducts:function(){
                return $http({
                    url: 'http://localhost:8000/api/products',
                    method: 'GET',
                 
               
                   
                  }).success(function(response) { 
                   
                  }).error(function(response){
              
                 });
        

            },
                    
            
            getOrderHistory:function(){
                return $http({
                    url: "http://localhost:8000/api/demo",
                    method: 'GET',
                 
               
                   
                  }).success(function(response) { 
                   
                  }).error(function(response){
              
                 });
        

            },
            cancelOrder:function(id){
                return $http({
                    url: "http://localhost:8000/api/order/"+id,
                    method: 'POST',
                  
                   
                  }).success(function(response) { 
                   
                  }).error(function(response){
              
                 });
        

            },

        }
    });