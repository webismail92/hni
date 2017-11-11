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

  .controller('registerCtrl', function ($scope, $http, MyServices) {
    //console.log($scope.myform.username);
    $scope.retailer = {};
    $scope.retailer.username = "";
    $scope.retailer.email = "";
    $scope.retailer.password = "";
    $scope.retailer.c_password = "";
    $scope.retailer.gstin = "";
    $scope.retailer.pan = "";
    $scope.retailer.shopname = "";
    $scope.retailer.contact = "";
    $scope.passwordnotmatch = false;
    $scope.register = function () {
      console.log("registered function called !");
      if ($scope.retailer.c_password != $scope.retailer.password) {
        $scope.retailer.c_password = "";
        $scope.retailer.password = "";
        $scope.passwordnotmatch = true;
        console.log("password do not match");
      }
      else
      {
        var status=MyServices.insertUser($scope.retailer);
        console.log(status);
      }
    }
  })

  .controller('loginCtrl', function ($scope,MyServices) {
    $scope.retailer = {};
    $scope.retailer.email = "";
    $scope.retailer.password = "";
    $scope.doLogin=function(){
    
      var status=MyServices.doLogin($scope.retailer);
      console.log(status);
    }
  })

  .controller('productCtrl', function ($scope, $location) {
    $scope.proToProDetail = function () {
      console.log('called');
      $location.path("app/product-detail");


    }
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) { });
