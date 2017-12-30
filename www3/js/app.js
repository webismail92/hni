// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'myservices', 'ngCordova', 'directives'])

  .run(function ($ionicPlatform, $ionicHistory, $location) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      $ionicPlatform.registerBackButtonAction(function (event) {
        event.preventDefault();
        console.log(event);
        if ($ionicHistory.currentStateName() != 'app.product' && $ionicHistory.currentStateName() != 'app.login') {
          $location.path('app/product');
        }
      


        //   $ionicPlatform.exitApp();
      })
    });
  })


  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'profileCtrl',

          }
        }
      })



      .state('app.register', {
        url: '/register',
        views: {
          'menuContent': {
            templateUrl: 'templates/register.html',
            controller: 'registerCtrl',

          }
        }
      })


      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
          }
        }
      })
      .state('app.retry', {
        url: '/retry',
        views: {
          'menuContent': {
            templateUrl: 'templates/retry.html',
            //  controller: 'internetcheckCtrl'
          }
        }
      })

      .state('app.product', {
        url: '/product',
        views: {
          'menuContent': {
            templateUrl: 'templates/product.html',
            controller: 'productCtrl'
          }
        }
      })

      .state('app.product-detail', {
        url: '/product-detail/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/product-detail.html',
            controller: 'productdetailsCtrl'
          }
        }
      })

      .state('app.history', {
        url: '/history',
        views: {
          'menuContent': {
            templateUrl: 'templates/history.html',
            controller: 'historyCtrl'
          }
        }
      })
      .state('app.forgotpassword', {
        url: '/forgotpassword',
        views: {
          'menuContent': {
            templateUrl: 'templates/forgotpassword.html',
            controller: 'loginCtrl'
          }
        }
      })
      .state('app.changepassword', {
        url: '/changepassword',
        views: {
          'menuContent': {
            templateUrl: 'templates/changepassword.html',
            controller: 'loginCtrl'
          }
        }
      })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise($.jStorage.get('token')?'app/product':'/app/login');
  })
  .filter('initCap', function () {
    return function (value) {
      if (value) {
        return value.replace(value.charAt(0), value.substr(0, 1).toUpperCase());
      }
    }
  })
  .filter('roundoff', function () {
    return function (value, decimals) {
      if (value) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
      }
    }
  })
