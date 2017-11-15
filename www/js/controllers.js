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

  .controller('registerCtrl', function ($scope, $http, MyServices, $location,$cordovaGeolocation) {
    //console.log($scope.myform.username);
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
    $scope.showAddressPage = false;
    var getMap=function(){
      console.log("method getMap called");
      var options = {timeout: 10000, enableHighAccuracy: true};
      
       $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      
         var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
         var mapOptions = {
           center: latLng,
           zoom: 15,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         };
      
         $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      
       }, function(error){
         console.log("Could not get location");
       });
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
        $scope.showAddressPage=true;
        
        // $location.path('app/product');
      }).catch(function (fallback) {
        console.log("i am in fallback");
        console.log(fallback);
      });
    }
    $scope.register = function () {
      console.log("registered function called !");





    }
  })

  .controller('loginCtrl', function ($scope, MyServices, $location) {
    $scope.retailer = {};
    $scope.retailer.email = "jyoti@gmail.com";
    $scope.retailer.password = "jyoti";
    $scope.emailrequired = false;
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
      }).catch(function(fallback){
        console.log(fallback);
      });
    }
    $scope.generateOtp = function () {
      if ($scope.retailer.email) {
        MyServices.getOtp($scope.retailer.email).then(function (param) {

        });
        // }).catch(function (fallback) {

        // });

      } else
        $scope.emailrequired = true;
      console.log("otp generation function called");
    }
  })

  .controller('productCtrl', function ($scope, $location, MyServices, $stateParams) {
    $scope. products={};
    $scope. products.quantity=0;
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
    $scope.productdetails;
    var id = $stateParams.id;
    $scope.productdetails = product[id];
    $scope.placeOrder=function(){
      console.log($scope. products.quantity);
      MyServices.orderProducts(product[id].id,$scope.products.quantity).then(function (param) {
      console.log(param);
        
      });
    }

  })
 

  // .controller('productdetailsCtrl', function ($scope,$stateParams) {
  //   $scope.productdetails;
  //   var id= $stateParams.id;
  //   $scope.productdetails=product[id];

  // })


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
