var product = [];
var retailersdata = {};
angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, MyServices, $location, $rootScope, $cordovaNetwork, $ionicPopup) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    //Check internet connection
    /* ionic.Platform.ready(function() {
      $scope.isonline = $cordovaNetwork.isOnline();
      if(!$scope.isonline)
      $location.path('app/errorpage');
     
    });
    //check user logged in 
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      alert('called online');
     $scope.isonline= $cordovaNetwork.isOnline();
     checkfortoken();

    });

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){

       $scope.isonline=$cordovaNetwork.isOnline();
       $location.path();
    
    }); */
    $rootScope.id = $.jStorage.get('id');
    var ischeckfunctioncalled = false;
    var checkfortoken = function () {
      console.log('check function called');
      $scope.errors = {};
      $rootScope.redirectedtofilladdress = false;
      if ($.jStorage.get('token')) {
        //make request on details 

        MyServices.getDetails().then(function (params) {

          retailersdata = params.data.retailer;

          if (retailersdata.blocked == 1) {

            $rootScope.showblockeddiv = true;
          }

          $location.path('app/product');
          console.log('checking flow ', $rootScope.showblockeddiv);
        }).catch(function (fallback) {
          console.log('i am in fallback')
          console.log(fallback);
          if (fallback.data) {
            if (fallback.data.address) {
              console.log(fallback.data.address);
              $location.path('app/register');
              $rootScope.redirectedtofilladdress = true;



            } else if (fallback.data.error == "Unauthenticated.") {
              $location.path('app/login');
            }


          } else {
            $location.path('app/login');
          }

        })


      }
    };


    checkfortoken();
    $scope.logoutconfirmation = function () {
      $ionicPopup.show({
        template: 'Are you sure want to exit app ?',
        title: 'Confirmation',
        scope: $scope,
        buttons: [{
            text: 'Cancel'
          },
          {
            text: '<b>Yes</b>',
            type: 'waves-effect waves-light btn red darken-1 ',
            onTap: function (e) {
              logout();
            }
          }
        ]
      });
    }

    var logout = function () {

      MyServices.logOut().then(function (params) {
        console.log("log out function called !");
        $.jStorage.flush();
        console.log($.jStorage.get('token'));
        $location.path('app/login');
      }).catch(function (fallback) {
        $scope.errors = fallback.data;
      });

    }



  })

  .controller('registerCtrl', function ($scope, $http, MyServices, $location, $cordovaGeolocation, $rootScope, $timeout, $interval, $ionicLoading, $ionicSideMenuDelegate) {

    $scope.$on('$ionicView.enter', function (e) {
      $ionicSideMenuDelegate.canDragContent(false);
    });

    //console.log($scope.myform.username);
    $scope.errors = {};
    var infowindow;
    $scope.ret = {};
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
    $scope.retailer.landmark = "";
    $scope.ret.zone = "";
    $scope.retailer.neareststn = "";

    $scope.passwordnotmatch = false;

    $scope.areas = [];
    $scope.areastation = [];


    MyServices.getAreas().then(function (params) {
      $scope.areas = params.data.areas;
      console.log($scope.areas);
    }).catch(function (fallback) {

    });
    var previousmarker;
    var getPlace = function (id) {
      console.log(id);
      var service = new google.maps.places.PlacesService($scope.map);
      service.getDetails({
        placeId: id
      }, callback);

      function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          $scope.retailer.landmark = place.name;
        } else
          console.log(status);
      }

    }
    var getMap = function () {
      console.log("method getMap called");
      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };

      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var pyrmont = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        google.maps.event.addListener($scope.map, 'click', function (event) {
          $scope.retailer.lat = event.latLng.lat();
          $scope.retailer.lng = event.latLng.lng();
          getPlace(event.placeId);
          console.log(event.placeId);
          createMarker(event.latLng);

        });


        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        searchBox.addListener('places_changed', function () {
          var places = searchBox.getPlaces();
          console.log(places);

          $scope.retailer.lat = places[0].geometry.location.lat();
          $scope.retailer.lng = places[0].geometry.location.lng();
          console.log();
          $scope.retailer.landmark = places[0].name;
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

      if (previousmarker)
        previousmarker.setMap(null);
      console.log(previousmarker);
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

    ionic.Platform.ready(getMap);
    $scope.callfunction = function () {
      $ionicLoading.show({
        template: 'Processing....',
        duration: 500
      }).then(function () {
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
          $scope.errors = fallback.data.error;

        });
      });
      console.log($scope.retailer);

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

  .controller('loginCtrl', function ($scope, MyServices, $location, $interval, $ionicSideMenuDelegate, $cordovaToast, $ionicLoading) {
    $scope.$on('$ionicView.enter', function (e) {
      $ionicSideMenuDelegate.canDragContent(false);
    });

    $scope.errors = {};
    $scope.retailer = {};
    $scope.retailer.email = "jyoti@gmail.com";
    $scope.retailer.password = "jyoti";
    $scope.emailrequired = false;
    $scope.forgot = {};
    $scope.forgot.email = "";
    $scope.enterotp = false;
    $scope.showresetpassword = false;
    $scope.new = {};
    $scope.new.password = "";
    $scope.new.confirmpassword = "";

    $scope.buttonname = "Verify";

    var loading = function () {
      $ionicLoading.show({
        template: '<div class="preloader-wrapper small active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"> <div class="circle"></div></div></div></div>'
      }).then(function () {
        console.log("The loading indicator is now displayed");
      });
    }
    var stoptimer = false;
    $scope.min = 2, $scope.sec = 00;
    $scope.registerPage = function () {
      $location.path('app/register');
    }
    $scope.doLogin = function () {
      loading();
      console.log($scope.retailer.email);
      $.jStorage.flush();
      MyServices.doLogin($scope.retailer).then(function (param) {
        $.jStorage.set('name', param.data.success.retailer.name);
        $.jStorage.set('token', param.data.success.token);
        $.jStorage.set('id', param.data.success.retailer.id);
        $location.path('app/product');
        console.log(param);
        $ionicLoading.hide();

      }).catch(function (fallback) {
        $scope.errors = fallback.data.error;
        console.log($scope.errors);
        Materialize.toast($scope.errors, 4000);
        $ionicLoading.hide();


      });
    }
    $scope.checkForOtp = function () {
      console.log($scope.forgot.otp);
      if ($scope.forgot.otp) {
        stopTimer();
        verifyOtp();
      } else {
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
      loading();
      console.log("i am in resend otp");
      MyServices.getOtp($scope.forgot.email).then(function (param) {
        console.log('OTP is sent');
        $ionicLoading.hide();
        $scope.uniqueId = param.data.unique_id;
        console.log($scope.uniqueId);
        $scope.enterotp = true;
      }).catch(function (fallback) {
        console.log('OTP is not sent');
        console.log(fallback);

        $ionicLoading.hide();
        Materialize.toast(fallback.data.error, 2000);
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
          $scope.sec = 60;
          $scope.min--;
        } else
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

        $scope.errors.email = "Email is required !";
      console.log($scope.errors.email);
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
            Mater
            //REDIRECT TO PRODUCT PAGE
            $location.path('app/product');
          }).catch(function (fallback) {
            $scope.errors = fallback.data;
          });
        } else {
          $scope.new.password = "";
          $scope.new.confirmpassword = "";
        }
      }

    }

  })

  .controller('productCtrl', function ($scope, $location, MyServices, $stateParams, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
      getproducts();
    })

    var getproducts = function () {

      console.log($rootScope.showblockeddiv);
      $scope.products = {};
      $scope.products.quantity = 0;
      $scope.products = [];
      // }
      MyServices.getProducts().then(function (param) {
        $rootScope.showblockeddiv = false;
        $scope.products = param.data.products;
        product = $scope.products;
        console.log($scope.products);
      }).catch(function (fallback) {
        if (fallback.data.error == "Unauthenticated.") {
          $location.path('app/login');
        } else if (fallback.data.blocked)
          $rootScope.showblockeddiv = true;
      });

    }
    // Written by Farhan
    // getproducts();

    // End Farhan

    // Written by Jyoti

    $scope.getStatus = function () {

      console.log('in Enter');
      getproducts();
      // $scope.showblockeddiv = true;
    }

    // End Jyoti

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
    $scope.products.salesid;
    $scope.placeOrder = function () {
      console.log($scope.products.quantity);
      MyServices.orderProducts(product[id].id, $scope.products).then(function (param) {
        console.log(param);
        $location.path('app/history');
      }).catch(function (fallback) {
        if (fallback.data.error == "Unauthenticated.") {
          $location.path('app/login');
        }
        $scope.error = fallback.data;
        console.log(fallback);
      });
    }
  })


  .controller('historyCtrl', function ($scope, MyServices, $cordovaToast, $interval) {
    $scope.orderhistory = [];
    console.log('history ctrl');
    var getOrders = function () {
      MyServices.getOrderHistory().then(function (param) {
        console.log('in history page');
        $scope.orderhistory = param.data.orders;
        $scope.showspinner = false;
        console.log($scope.orderhistory);
      }).catch(function (fallback) {
        if (fallback.data.error == "Unauthenticated.") {
          $location.path('app/login');
        }
      });
    }
    $scope.onSwipeDown = function () {
      $scope.showspinner = true;
      $interval(getOrders, 1000, 1);
    }
    getOrders();
    $scope.cancelorder = function (index) {
      $ionicPopup.show({
        template: 'Are you sure want to cancel order ?',
        title: 'Confirmation',
        scope: $scope,
        buttons: [{
            text: 'No'
          },
          {
            text: '<b>Yes</b>',
            type: 'waves-effect waves-light btn red darken-1 ',
            onTap: function (e) {
              ordercancel(index);
            }
          }
        ]
      });




      
    }
    var ordercancel=function(index){
      console.log(index);
      MyServices.cancelOrder($scope.orderhistory[index].id).then(function (params) {
        // getOrders();
        if (params.data.status)
          $scope.orderhistory[index].status = 'cancelled'
      }).catch(function (fallback) {
        $cordovaToast.showLongBottom(fallback.error).then(function (success) {
          // success
          console.log(success);
        }, function (error) {
          // error
          console.log(error);
        });
      });
    }
    $scope.callfunction = function (datetime) {
      return (new Date(datetime)).toLocaleDateString(); //+"    "+ (new Date(datetime)).toLocaleTimeString();
    }

  })

  .controller('profileCtrl', function ($scope, $stateParams) {
    $scope.$on('$ionicView.enter', function (e) {
      $scope.retailersdata = retailersdata;
    });



  });
