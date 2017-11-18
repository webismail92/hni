var product = [];
angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal

    // $scope.registerData = {};
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('registerCtrl', function ($scope, $http, MyServices, $location, $cordovaGeolocation) {
    //console.log($scope.myform.username);
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
    $scope.passwordnotmatch = false;
    $scope.showAddressPage = true;
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
          //  $scope.map.remove(previousmarker);

          createMarker(event.latLng);
          console.log(event.va);//.view.window.close());
        });
        //$scope.map.setVisible(true);
        var infowindow = new google.maps.InfoWindow();
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        searchBox.addListener('places_changed', function () {
          var places = searchBox.getPlaces();
          console.log($scope.map);


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
      MyServices.insertUser($scope.retailer).then(function (param) {
        console.log("i am in controller");
        $.jStorage.flush();
        $.jStorage.set('name', param.data.success.name);
        $.jStorage.set('token', param.data.success.token);
        $.jStorage.set('id', param.data.success.id);
        console.log(param);
        $scope.showAddressPage = true;

        // $location.path('app/product');
      }).catch(function (fallback) {
        console.log("i am in fallback");
        console.log(fallback);
      });
    }
    $scope.register = function () {
      console.log("registered function called !");
      MyServices.insertAddress($scope.retailer).then(function (param) {
        console.log(param);
      }).catch(function (fallback) {
        console.log(fallback);
      });




    }
  })

  .controller('loginCtrl', function ($scope, MyServices, $location,$interval) {
    $scope.retailer = {};
    $scope.retailer.email = "jyoti@gmail.com";
    $scope.retailer.password = "jyoti";
    $scope.emailrequired = false;
    $scope.forgot={};
    $scope.forgot.email="";
    $scope.enterotp=false;
    $scope.showresetpassword=false;
  
    $scope.buttonname="Verify";
   

    var stoptimer=false;
       $scope.min=2,$scope.sec=00;
    $scope.registerPage = function () {
      $location.path('app/register');
    }
    $scope.doLogin = function () {
      $.jStorage.flush();
      MyServices.doLogin($scope.retailer).then(function (param) {
        $.jStorage.set('name', param.data.success.retailer.name);
        $.jStorage.set('token', param.data.success.token);
        $.jStorage.set('id', param.data.success.retailer.id);
        $location.path('app/product');
        console.log(param);
      }).catch(function (fallback) {
        console.log(fallback);
      });
    }
    $scope.checkForOtp=function(){
      console.log($scope.forgot.otp);
      if($scope.forgot.otp)
      { 
        stopTimer();  
       verifyOtp();
      }
      else
      {
      resendOtp();
      }
    }
   var verifyOtp=function(){
   
    console.log("i am in verify otp");
    MyServices.verifyOtp($scope.forgot.otp).then(function (param) {
      console.log(param);
       $scope.enterotp=false;
       $scope.showresetpassword=true;
     }).catch(function (fallback) {
       resendOtp();
      });

    }
    var resendOtp=function(){
     
      console.log("i am in resend otp");
      MyServices.getOtp($scope.forgot.email).then(function (param) {
        console.log('OTP is sent');
        
        $scope.uniqueId=param.data.unique_id;
        console.log( $scope.uniqueId);
         $scope.enterotp=true;
       }).catch(function (fallback) {
        console.log('OTP is not sent');
        console.log(fallback);
      });

    }
    var stopTimer=function(){
      stoptimer=true;
      $scope.forgot.otp="";
     $scope.buttonname="Resend OTP";
      // $scope.checkForOtp();
      console.log("I am called");
      $interval.cancel(intervalfunction);
    }
    var setTimer=function(){
     // console.log("i am called");
           if($scope.sec==0 )  
           {        
            
             if($scope.min>0) 
             {
             $scope.sec=60;                                                                                         $scope.min--;
             }
             else
             stopTimer();    
           
              }
         
           if(!stoptimer)
           $scope.sec--;

    }
    var intervalfunction=$interval(setTimer, 1000);


    $scope.generateOtp = function () {
      console.log("otp generation function called");
      console.log($scope.forgot);
      if ($scope.forgot.email) {
        resendOtp();

      } else
        $scope.emailrequired = true;
    
    }
  })

  .controller('productCtrl', function ($scope, $location, MyServices, $stateParams) {
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


  .controller('productdetailsCtrl', function ($scope, $stateParams) {
    $scope.productdetails = {};
    var id = $stateParams.id;

    $scope.productdetails = product[id];
    $scope.placeOrder = function () {
      console.log($scope.products.quantity);
      MyServices.orderProducts(product[id].id, $scope.products.quantity).then(function (param) {
        console.log(param);

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
