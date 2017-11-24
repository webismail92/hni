var product = [];
angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, MyServices, $location, $rootScope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    //check user logged in 
    // MyServices.logOut();
    $scope.errors = {};
    $rootScope.redirectedtofilladdress = false;
    if ($.jStorage.get('token')) {
      //make request on details 
      MyServices.getDetails().then(function (params) {
        console.log('i am in success');
        console.log(params);
        $location.path('app/product');
      }).catch(function (fallback) {
        console.log('i am in fallback')
        console.log(fallback);
        if (fallback.data) {
          if (fallback.data.address) {
            console.log(fallback.data.address);
            $location.path('app/register');
            $rootScope.redirectedtofilladdress = true;
          


          } else if (fallback.data.blocked) {
            console.log(fallback.data.blocked);
            $location.path('app/product');
            $rootScope.showblockeddiv = true;
          }
        }

      })


    }
    $scope.logOut = function () {
      console.log("log out function called !");
      MyServices.logOut().then(function (params) {
        $.jStorage.flush();
        $location.path('app/login');
      }).catch(function (fallback) {
        $scope.errors = fallback.data;
      });

    }



  })

  .controller('registerCtrl', function ($scope, $http, MyServices, $location, $cordovaGeolocation, $rootScope) {
   
    
    $('select').material_select(); 
    //console.log($scope.myform.username);
    $scope.errors = {};
    var infowindow;
    $scope.retailer = {};
    $scope.retailer.name = "jyoti";
    $scope.retailer.email = "jyoti@gmail.com";
    $scope.retailer.password = "jyoti";
    $scope.retailer.c_password = "jyoti";
    $scope.retailer.gstin = "";
    $scope.retailer.pan = "zxcvbnm123";
    $scope.retailer.shopname = "jyoti";
    $scope.retailer.contact = "9768941186";
    $scope.retailer.address = "";
    $scope.retailer.pincode = "";
    $scope.retailer.city = "";
    $scope.retailer.lat = 0;
    $scope.retailer.lng = 0;
    $scope.passwordnotmatch = false;
    $scope.areas=[];
    MyServices.getAreas().then(function (params) { 
      $scope.areas=params.data.areas;
      console.log($scope.areas);
    }).catch(function (fallback) { 

    });
    var previousmarker = {};
    var getMap = function () {
      console.log("method getMap called");
      var options = { timeout: 10000, enableHighAccuracy: true };

      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var pyrmont = { lat: position.coords.latitude, lng: position.coords.longitude };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        google.maps.event.addListener($scope.map, 'click', function (event) {
          $scope.retailer.lat = event.latLng.lat();
          $scope.retailer.lng = event.latLng.lng();
          console.log(event.latLng);
          createMarker(event.latLng);

        });


        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        searchBox.addListener('places_changed', function () {
          var places = searchBox.getPlaces();
          console.log($scope.map);
          $scope.retailer.lat = places[0].geometry.location.lat();
          $scope.retailer.lng = places[0].geometry.location.lng();

          latLng = new google.maps.LatLng(places[0].geometry.location.lat(), places[0].geometry.location.lng());
          mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          //$scope.map.animateCamera();
          console.log($scope.map);
          $scope.map.setOptions(mapOptions);

          createMarker(places[0].geometry.location);
          console.log(places[0].geometry.location.lat() + " " + places[0].geometry.location.lng());
          if (places.length == 0) {
            return;
          }
        });
        // $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // var service = new google.maps.places.PlacesService($scope.map);


      }, function (error) {
        console.log("Could not get location");
      });
    }


    function createMarker(place) {
      //var placeLoc = place.geometry.location;
      // infowindow.close();
      var marker = new google.maps.Marker({
        map: $scope.map,
        position: place
      });
      previousmarker = marker;
      console.log("place object");
      console.log(place);
      //$scope.map.addMarker(marker);


    }

    getMap();
    $scope.callfunction = function () {
      console.log("i am in controller");
      MyServices.insertUser($scope.retailer).then(function (param) {
        console.log("i am in controller");
        $.jStorage.flush();
        $.jStorage.set('name', param.data.success.name);
        $.jStorage.set('token', param.data.success.token);
        $.jStorage.set('id', param.data.success.id);
        console.log(param);
        $rootScope.redirectedtofilladdress = true;

        // $location.path('app/product');
      }).catch(function (fallback) {
        $scope.errors = fallback.data;
        console.log("i am in fallback");
        console.log(fallback);
      });
    }
    $scope.register = function () {
      console.log("registered function called !");

      MyServices.insertAddress($scope.retailer).then(function (param) {
        $location.path('app/product');
        console.log(param);
      }).catch(function (fallback) {
        $scope.errors = fallback.data;
        console.log(fallback);
      });




    }
  })

  .controller('loginCtrl', function ($scope, MyServices, $location, $interval) {
    $scope.errors = {};
    $scope.retailer = {};
    $scope.retailer.email = "jyoti@gmail.com";
    $scope.retailer.password = "jyoti";
    $scope.emailrequired = false;
    $scope.forgot = {};
    $scope.forgot.email = "";
    $scope.enterotp = false;
    $scope.showresetpassword = true;
    $scope.new = {};
    $scope.new.password = "";
    $scope.new.confirmpassword = "";

    $scope.buttonname = "Verify";


    var stoptimer = false;
    $scope.min = 2, $scope.sec = 00;
    $scope.registerPage = function () {
      $location.path('app/register');
    }
    $scope.doLogin = function () {
      console.log($scope.retailer.email);
      $.jStorage.flush();
      MyServices.doLogin($scope.retailer).then(function (param) {
        $.jStorage.set('name', param.data.success.retailer.name);
        $.jStorage.set('token', param.data.success.token);
        $.jStorage.set('id', param.data.success.retailer.id);
        $location.path('app/product');
        console.log(param);
      }).catch(function (fallback) {
        $scope.errors = fallback.data;
        console.log(fallback);
      });
    }
    $scope.checkForOtp = function () {
      console.log($scope.forgot.otp);
      if ($scope.forgot.otp) {
        stopTimer();
        verifyOtp();
      }
      else {
        resendOtp();
      }
    }
    var verifyOtp = function () {

      console.log("i am in verify otp");
      MyServices.verifyOtp($scope.forgot.otp, $scope.uniqueId, $scope.forgot.email).then(function (param) {
        console.log(param);
        $scope.enterotp = false;
        $scope.showresetpassword = true;
      }).catch(function (fallback) {
        resendOtp();
      });

    }
    var resendOtp = function () {

      console.log("i am in resend otp");
      MyServices.getOtp($scope.forgot.email).then(function (param) {
        console.log('OTP is sent');

        $scope.uniqueId = param.data.unique_id;
        console.log($scope.uniqueId);
        $scope.enterotp = true;
      }).catch(function (fallback) {
        console.log('OTP is not sent');
        console.log(fallback);
        $scope.errors = fallback.data;
      });

    }
    var stopTimer = function () {
      stoptimer = true;
      $scope.forgot.otp = "";
      $scope.buttonname = "Resend OTP";
      // $scope.checkForOtp();
      console.log("I am called");
      $interval.cancel(intervalfunction);
    }
    var setTimer = function () {
      // console.log("i am called");
      if ($scope.sec == 0) {

        if ($scope.min > 0) {
          $scope.sec = 60; $scope.min--;
        }
        else
          stopTimer();

      }

      if (!stoptimer)
        $scope.sec--;

    }
    var intervalfunction = $interval(setTimer, 1000);


    $scope.generateOtp = function () {
      console.log("otp generation function called");
      console.log($scope.forgot);
      if ($scope.forgot.email) {
        resendOtp();

      } else
        $scope.emailrequired = true;

    }

    //Reset password function
    $scope.resetPassword = function () {
      console.log("reset function called !");
      if ($scope.new.password || $scope.new.confirmpassword) {
        if ($scope.new.password == $scope.new.confirmpassword) {
          ///password/reset
          MyServices.resetPassword($scope.new).then(function (params) {
            //STORE TOKEN HERE 
            $.jStorage.set('token', params.data.token);
            //REDIRECT TO PRODUCT PAGE
            $location.path('app/product');
          }).catch(function (fallback) {
            $scope.errors = fallback.data;
          });
        }
        else {
          $scope.new.password = "";
          $scope.new.confirmpassword = "";
        }
      }

    }

  })

  .controller('productCtrl', function ($scope, $location, MyServices, $stateParams, $rootScope) {

    console.log($rootScope.showblockeddiv);
    $scope.products = {};
    $scope.products.quantity = 0;
    $scope.products = [];
    // }
    MyServices.getProducts().then(function (param) {
      $scope.products = param.data.products;
      product = $scope.products;
      console.log($scope.products);
    });
    $scope.proToProDetail = function (id) {
      console.log('called');
      $location.path("app/product-detail/" + id);

    };

  })


  .controller('productdetailsCtrl', function ($scope, $stateParams, MyServices, $location) {
    $scope.errors = {};
    $scope.productdetails = {};
    $scope.products = {};
    var id = $stateParams.id;
    $scope.products.quantity = 1;
    $scope.productdetails = product[id];
    $scope.placeOrder = function () {
      console.log($scope.products.quantity);
      MyServices.orderProducts(product[id].id, $scope.products.quantity).then(function (param) {
        console.log(param);
        $location.path('app/history');
      }).catch(function (fallback) {
        $scope.error = fallback.data;
        console.log(fallback);
      });
    }
  })


  .controller('historyCtrl', function ($scope, MyServices) {
    $scope.orderhistory = [];
    MyServices.getOrderHistory().then(function (param) {
      $scope.orderhistory = param.data.orders;

      console.log(param.data.orders);
    });
    $scope.cancelorder = function (index) {
      MyServices.cancelOrder($scope.orderhistory[index].id);
    }

  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) { });
