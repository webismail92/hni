// var baseUrl="http://192.168.0.106:8000/api/";
var baseUrl="http://hniperfumes.in/api/";
var myservices = angular.module('myservices', [])


  .factory('MyServices', function ($http, $location) {




    return {
      insertUser: function (retailerdata) {
        console.log('i am in insert user');
        return $http({
          url: baseUrl + "retailer/register",
          method: 'POST',
          data: retailerdata,



        }).success(function (response) {
          console.log(response);
        }).error(function (response) {
          console.log(response);
        });

      },


      doLogin: function (retailerdata) {
        console.log("in dologin function ! ");
        return $http({
          url: baseUrl + 'retailer/login',
          method: 'POST',
          data: retailerdata,

          "async": false,

        }).success(function (response) {

        }).error(function (response) {

        });

      },
      getProducts: function () {
        return $http({
          url: baseUrl + 'retailer/products',
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
        console.log('getOrderHistory  ' + $.jStorage.get('token'));
        return $http({
          url: baseUrl + "retailer/orders/history",
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + $.jStorage.get('token')
          }


        }).success(function (response) {
          console.log('in success');
          console.log(response);
        }).error(function (response) {
          console.log(response);
        });


      },
      cancelOrder: function (id) {
        return $http({
          url: baseUrl + "retailer/cancel-order/" + id,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + $.jStorage.get('token')
          }

        }).success(function (response) {
          console.log(response);
        }).error(function (response) {
          console.log(response);
        });


      },
      getOtp: function (emailid) {
        return $http({
          url: baseUrl + "retailer/password/forgot",
          method: 'POST',
          data: {
            'email': emailid
          }

        }).success(function (response) {

        }).error(function (response) {

        });


      },
      orderProducts: function (id, products) {
        var orderdetail = {
          'product_id': id,
          'quantity': products.quantity,
          'salesman_id': products.salesid,
          'state':$.jStorage.get('state')

        };

        return $http({
          url: baseUrl + "retailer/place-order",
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
      insertAddress: function (retailerdata) {

        var senddata = {
          'address': retailerdata.address,
          'pincode': retailerdata.pincode,
          'city': retailerdata.city,
          'latitude': retailerdata.lat.toString(),
          'longitude': retailerdata.lng.toString(),
          'landmark': retailerdata.landmark,
          'area': retailerdata.neareststn,
          'state': retailerdata.state
        };
        console.log(senddata);
        return $http({
          url: baseUrl + "retailer/address/add",
          method: 'POST',
          data: senddata,
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + $.jStorage.get('token')
          }


        }).success(function (response) {
          console.log(response.success);
        }).error(function (response) {
          console.log(response.error);
        });
      },
      verifyOtp: function (otp, id, email) {
        return $http({
          url: baseUrl + "retailer/password/verify-otp",
          method: 'POST',
          data: {
            'otp': otp,
            'id': id,
            'email': email
          }

        }).success(function (response) {
          console.log(response.success);
        }).error(function (response) {
          console.log(response.error);
        });
      },
      getDetails: function () {
        return $http({
          url: baseUrl + 'retailer/details',
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + $.jStorage.get('token')
          }
        }).success(function (response) {

        }).error(function (response) {

        });
      },
      logOut: function () {
        return $http({
          url: baseUrl + 'retailer/logout',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + $.jStorage.get('token')
          }
        }).success(function (response) {
          console.log(response);
        }).error(function (error) {
          console.log(error);
        })


      },
      resetPassword: function (newpassord, uniqueid, otp, email) {
        return $http({
          url: baseUrl + 'retailer/password/reset',
          method: 'post',
          data: {
            c_password: newpassord.confirmpassword,
            password: newpassord.password,
            otp: otp,
            id: uniqueid,
            email: email
          }

        }).success(function (response) {
          console.log(response);

        }).error(function (response) {
          console.log(response);
        });

      },
      getAreas: function () {
        return $http({
          url: baseUrl + 'areas',
          method: 'GET',


        }).success(function (response) {
          console.log(response);

        }).error(function (response) {
          console.log(response);
        });
      },
      getluckydraw: function () {
        return $http({
          url: baseUrl + 'retailer/lucky-draw',
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + $.jStorage.get('token')
          }

        }).success(function (response) {


        }).error(function (response) {

        });
      },
      changepassword: function (changedata) {
        console.log(changedata);
        return $http({
          url: baseUrl + 'retailer/password/change',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + $.jStorage.get('token')
          },
          data: changedata
        }).success(function (response) {


        }).error(function (response) {

        });
      }


    }
  });
