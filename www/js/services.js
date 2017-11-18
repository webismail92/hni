
var baseUrl = "http://localhost:8000/api/";
var myservices = angular.module('myservices', [])


    .factory('MyServices', function ($http, $location) {




        return {
            insertUser: function (retailerdata) {

                return $http({
                    url: 'http://localhost:8000/api/retailer/register',
                    method: 'POST',
                    data: retailerdata,

                    "async": false,

                }).success(function (response) {

                }).error(function (response) {

                });

            },


            doLogin: function (retailerdata) {
                console.log("in dologin function ! ");
                return $http({
                    url: 'http://localhost:8000/api/retailer/login',
                    method: 'POST',
                    data: retailerdata,

                    "async": false,

                }).success(function (response) {

                }).error(function (response) {

                });

            },
            getProducts: function () {
                return $http({
                    url: 'http://localhost:8000/api/retailer/products',
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + $.jStorage.get('token'),

                    },



                }).success(function (response) {
                    console.log(response);
                }).error(function (response) {
                    console.log(response);
                });


            },


            getOrderHistory: function () {
                return $http({
                    url: "http://localhost:8000/api/demo",
                    method: 'GET',



                }).success(function (response) {

                }).error(function (response) {

                });


            },
            cancelOrder: function (id) {
                return $http({
                    url: "http://localhost:8000/api/cancel-order/" + id,
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'bearer ' + $.jStorage.get('token')
                    }

                }).success(function (response) {
                    console.log(response);
                }).error(function (response) {
                    console.log(response);
                });


            },
            getOtp: function (emailid) {
                return $http({
                    url: baseUrl+"retailer/forget-password",
                    method: 'POST',
                    data: { 'email': emailid }
                    
                }).success(function (response) {

                }).error(function (response) {

                });


            },
            orderProducts: function (id, qty) {
                var orderdetail = {
                    'product_id': id,
                    'quantity': qty,

                };

                return $http({
                    url: "http://localhost:8000/api/retailer/place-order",
                    method: 'POST',
                    data: orderdetail,
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + $.jStorage.get('token')
                    }

                }).success(function (response) {
                    console.log('success');
                    console.log(response);

                }).error(function (response) {
                    console.log('error');
                    console.log(response);
                });

            },
            insertUser: function (retailerdata) {
                var address = { 'address': retailerdata.address, 'pincode': retailerdata.pincode, 'city': retailerdata.city }
                return $http({
                    url: baseUrl + "retailer/address",
                    method: 'POST',
                    data: address

                }).success(function (response) {
                    console.log(response.success);
                }).error(function (response) {
                    console.log(response.error);
                });
            },
            verifyOtp:function(otp){
                return $http({
                    url: baseUrl + "retailer/verify-otp",
                    method: 'POST',
                    data: otp

                }).success(function (response) {
                    console.log(response.success);
                }).error(function (response) {
                    console.log(response.error);
                });
            },
            

        }
    });