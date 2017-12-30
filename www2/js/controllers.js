var product = [];
var retailersdata = {};
angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, MyServices, $location, $rootScope, $cordovaNetwork, $ionicPopup, $ionicSideMenuDelegate, $ionicHistory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function (e) {
      if ($.jStorage.get('token')) {
        MyServices.getDetails().then(function (params) {}).catch(function (fallback) {
          if (fallback.data)
            if (fallback.data.error == "Unauthenticated.") {
              $.jStorage.flush();
              Materialize.toast('You are logged in some where.', 2000);
              $location.path('app/login');
            }

        });
        MyServices.getluckydraw().then(function (response) {
          $rootScope.contestsdata = response.data.contests;
          console.log($rootScope.contestsdata);
        }).catch(function (fallback) {
          console.log(fallback);
        });
      }
      // ionic.Platform.onHardwareBackButton(function(){
      //   console.log($ionicHistory.backView());
      // })

    });

    //Check internet connection
    ionic.Platform.ready(function () {
      $scope.isonline = $cordovaNetwork.isOnline();
      if (!$scope.isonline)
        $location.path('app/retry');

    });
    //check user logged in 
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
      $ionicSideMenuDelegate.canDragContent(true);
      $scope.isonline = $cordovaNetwork.isOnline();
      checkfortoken();

    });

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
      $ionicSideMenuDelegate.canDragContent(false);
      $scope.isonline = $cordovaNetwork.isOnline();
      $location.path('app/retry');

    });
    $rootScope.id = $.jStorage.get('id');
    var ischeckfunctioncalled = false;
    var checkfortoken = function () {

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

              console.log($rootScope.redirectedtofilladdress);

            } else if (fallback.data.error == "Unauthenticated.") {
              $location.path('app/login');
            }


          }

        })


      } else {
        $location.path('app/login');
      }
    };


    checkfortoken();
    $rootScope.logoutconfirmation = function () {
      $ionicPopup.show({
        cssClass: 'overlay',
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
        $location.path('app/login');
      }).catch(function (fallback) {
        $scope.errors = fallback.data;
      });

    }



  })

  .controller('registerCtrl', function ($scope, $http, MyServices, $location, $cordovaGeolocation, $rootScope, $timeout, $interval, $ionicLoading, $ionicSideMenuDelegate) {

    $scope.$on('$ionicView.enter', function (e) {
      $ionicSideMenuDelegate.canDragContent(false);
      $('#address').trigger('autoresize');
      var infowindow;
      $scope.ret = {};
      $scope.retailer = {};
      $scope.retailer.name = "";
      $scope.retailer.email = "";
      $scope.retailer.password = "";
      $scope.retailer.c_password = "";
      $scope.retailer.gstin = "";
      $scope.retailer.pan = "";
      $scope.retailer.shopname = "";
      $scope.retailer.contact = "";
      $scope.retailer.address = "";
      $scope.retailer.pincode = "";
      $scope.retailer.city = "";
      $scope.retailer.lat = 0;
      $scope.retailer.lng = 0;
      $scope.retailer.landmark = "";
      $scope.ret.zone = "";
      $scope.retailer.neareststn = "";



    });


    //console.log($scope.myform.username);
    $scope.errors = {};
    $scope.errorsforaddress = {};


    $scope.passwordnotmatch = false;

    $scope.areas = [];
    $scope.areastation = [];


    MyServices.getAreas().then(function (params) {
      $scope.areas = params.data.areas;
      console.log($scope.areas);
    }).catch(function (fallback) {

    });

    $scope.checkaddress = function () {
      console.log($scope.retailer.address);
    }

    $scope.getmapready = function () {
      $rootScope.redirectedtofilladdress = true
      ionic.Platform.ready(getMap);
    }
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
    $rootScope.showheader = $.jStorage.get('token') && $rootScope.redirectedtofilladdress;
    console.log('test' + $rootScope.redirectedtofilladdress);

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
          insertaddress();
          // $location.path('app/product');
        }).catch(function (fallback) {
          $scope.errors = fallback.data.error;
          $rootScope.redirectedtofilladdress = false;

        });
      });
      console.log($scope.retailer);

    }
    var insertaddress = function () {
      console.log($scope.retailer);
      MyServices.insertAddress($scope.retailer).then(function (param) {
        $rootScope.redirectedtofilladdress = false;
        $rootScope.showheader = false;
        $location.path('app/product');
        console.log(param);
      }).catch(function (fallback) {
        $scope.errorsforaddress = fallback.data;

        console.log(fallback);
      });
    }
    $scope.register = function () {
      $scope.errors = {};
      $scope.errorsforaddress = {};
      console.log("registered function called !");
      if (!$rootScope.showheader)
        $scope.callfunction();
      else
        insertaddress();




    }
  })

  .controller('loginCtrl', function ($scope, MyServices, $location, $interval, $ionicSideMenuDelegate, $cordovaToast, $ionicLoading) {
    $scope.$on('$ionicView.enter', function (e) {
      $ionicSideMenuDelegate.canDragContent(false);
      $scope.retailer = {};
      $scope.changedata = {};
      $scope.errors = {};
      $scope.forgot = {};
      $scope.new = {};
      $scope.retailer.email = "";
      $scope.retailer.password = "";
      $scope.emailrequired = false;
      $scope.forgot.email = "";
      $scope.enterotp = false;
      $scope.showresetpassword = false;
      $scope.new.password = "";
      $scope.new.confirmpassword = "";
      $scope.changedata.oldpassword = "";
      $scope.changedata.newpassword = "";
      $scope.buttonname = "Verify";
    });
    var changebuttonname = true;
    var intervalfunction;
    var loading = function () {
      $ionicLoading.show({
        template: '<div class="preloader-wrapper small active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"> <div class="circle"></div></div></div></div>'
      }).then(function () {
        console.log("The loading indicator is now displayed");
      });
    }
    var stoptimer = false;
    $scope.registerPage = function () {
      $location.path('app/register');
    }
    $scope.doLogin = function () {
      console.log('i am in login');
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
        Materialize.toast($scope.errors, 2000);
        $ionicLoading.hide();


      });
    };

    var verifyOtp = function () {
      changebuttonname = false;
      console.log("i am in verify otp");
      MyServices.verifyOtp($scope.forgot.otp, $scope.uniqueId, $scope.forgot.email).then(function (param) {
        console.log(param);
        $scope.enterotp = false;
        $scope.showresetpassword = true;
      }).catch(function (fallback) {
        starttimer();
        changebuttonname = true;
        console.log(fallback);
        if (fallback.data) {
          if (fallback.data.errors) {
            if (fallback.data.errors.otp)
              Materialize.toast(fallback.data.errors.otp[0], 2000);
          } else
            Materialize.toast(fallback.data.error, 2000);
        }
      });

    };





    var resendOtp = function () {
      loading();
      console.log("i am in resend otp");
      MyServices.getOtp($scope.forgot.email).then(function (param) {
        console.log('OTP is sent');
        $ionicLoading.hide();
        $scope.uniqueId = param.data.unique_id;
        console.log($scope.uniqueId);
        $scope.enterotp = true;
        $scope.buttonname = 'Verify';
        stoptimer = false;
        changebuttonname = false;
        starttimer();
      }).catch(function (fallback) {
        console.log('OTP is not sent');
        console.log(fallback);

        $ionicLoading.hide();
        Materialize.toast(fallback.data.error, 2000);
      });

    }
    var starttimer = function () {
      $scope.min = 2;
      $scope.sec = 0;
      stoptimer = false;
      intervalfunction = $interval(setTimer, 1000);
    }
    var stopTimer = function () {
      stoptimer = true;
      if (changebuttonname) {
        $scope.forgot.otp = "";
        $scope.buttonname = "Resend OTP";
        $scope.iconname = "send";
      }
      $scope.min = 0;
      $scope.sec = 0;

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

    };

    $scope.checkForOtp = function () {

      console.log($scope.buttonname == "Verify");

      if ($scope.buttonname == "Verify")
        verifyOtp();
      else {
        console.log('i am in resend else');
        resendOtp();
      }


      stopTimer();
    }





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
          MyServices.resetPassword($scope.new, $scope.uniqueId, $scope.forgot.otp, $scope.forgot.email).then(function (params) {
            //STORE TOKEN HERE 
            $.jStorage.set('token', params.data.token);
            Materialize.toast('Your password has been reset !', 2000);
            //REDIRECT TO PRODUCT PAGE
            $location.path('app/product');
          }).catch(function (fallback) {
            if (fallback.data)
              $scope.errors = fallback.data;
          });
        } else {
          $scope.new.password = "";
          $scope.new.confirmpassword = "";
        }
      }

    }
    $scope.changepassword = function () {
      loading();
      MyServices.changepassword($scope.changedata).then(function (response) {
        $ionicLoading.hide();
        Materialize.toast('Password is reset !', 2000);
        $.jStorage.set('token', response.data.token)
        $location.path('app/product');
      }).catch(function (fallback) {
        $ionicLoading.hide();
        console.log(fallback);
        if (fallback.data) {
          if (fallback.data.error)
            Materialize.toast(fallback.data.error, 2000);


          if (fallback.data.errors)
            $scope.errors = fallback.data.errors;
        }
      });


    }

  })

  .controller('productCtrl', function ($scope, $location, MyServices, $stateParams, $rootScope, $ionicScrollDelegate) {
    $scope.products = [];
    var getproducts = function () {
      MyServices.getProducts().then(function (param) {
        $scope.showspinner = false;
        $rootScope.showblockeddiv = false;
        $scope.products = param.data.products;
        product = $scope.products;
      }).catch(function (fallback) {
        if (fallback.data.address) {
          $rootScope.redirectedtofilladdress = true;
          $location.path('app/register');
        }
        if (fallback.data.error == "Unauthenticated.") {
          $location.path('app/login');
        } else if (fallback.data.blocked)
          $rootScope.showblockeddiv = true;
      });

    }
    $scope.$on('$ionicView.enter', function () {

      getproducts();
    })

    $scope.refreshproducts = function () {
      var topposition = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
      if (topposition == 0) {
        $scope.showspinner = true;
        getproducts();
      }
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


  .controller('productdetailsCtrl', function ($scope, $stateParams, MyServices, $location, $ionicPopup) {
    $scope.errors = {};
    $scope.productdetails = {};
    $scope.products = {};
    var id = $stateParams.id;
    $scope.products.quantity = 1;
    $scope.productdetails = product[id];
    $scope.products.salesid;
    $scope.placeOrder = function () {
      $ionicPopup.show({
        cssClass: 'overlay',
        template: 'Are you sure want to place order ?',
        title: 'Confirmation',
        scope: $scope,
        buttons: [{
            text: 'No'
          },
          {
            text: '<b>Yes</b>',
            type: 'waves-effect waves-light btn red darken-1 ',
            onTap: function (e) {
              console.log($scope.products.quantity);
              MyServices.orderProducts(product[id].id, $scope.products).then(function (param) {
                console.log(param);
                $location.path('app/product');
              }).catch(function (fallback) {
                if (fallback.data.error == "Unauthenticated.") {
                  Materialize.toast('Your token has been expired! Login again.', 3000);
                  $location.path('app/login');
                }
                $scope.error = fallback.data;
                console.log(fallback);
              });
            }
          }
        ]
      });

    }
  })


  .controller('historyCtrl', function ($scope, MyServices, $cordovaToast, $interval, $location, $ionicPopup, $ionicScrollDelegate) {
    $('ul.tabs').tabs({
      // swipeable: true,
      responsiveThreshold: 1920
    });
    $scope.filter = {};

    $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.years = [];
    for (var i = 2017; i <= 2050; i++) {
      $scope.years.push(i.toString());
    }
    $scope.filter.month = $scope.months[new Date().getMonth()];
    $scope.filter.year = (new Date().getFullYear()).toString();

    $scope.orderhistory = [];
    $scope.todayorders = [];
    $scope.totaloftodayorders = 0.0;
    $scope.totalquantityoftodayorders = 0;
    var todaysdate = new Date().toLocaleDateString();
    console.log('history ctrl');
    var getOrders = function () {
      MyServices.getOrderHistory().then(function (param) {
        console.log('in history page');
        $scope.orderhistory = param.data.orders;
        for (index in param.data.orders) {
          var orderdate = new Date(param.data.orders[0].created_at).toLocaleDateString();
          if (orderdate == todaysdate && (param.data.orders[index].status == 'pending' || param.data.orders[index].status == 'dispatched')) {
            $scope.todayorders.push(param.data.orders[index]);
            console.log($scope.totaloftodayorders);
            $scope.totaloftodayorders += parseFloat(param.data.orders[index].price * param.data.orders[index].quantity);
            $scope.totalquantityoftodayorders += parseInt(param.data.orders[index].quantity);
            console.log($scope.totaloftodayorders);
          }
        }
        //console.log();
        $scope.showspinner = false;
        console.log($scope.orderhistory);
      }).catch(function (fallback) {
        if (fallback.data.error == "Unauthenticated.") {
          $location.path('app/login');
        }
      });
    }
    $scope.onSwipeDown = function () {
      var topposition = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
      if (topposition == 0) {
        $scope.showspinner = true;
        $interval(getOrders, 1000, 1);
      }
    }
    getOrders();
    $scope.cancelorder = function (index, today) {
      $ionicPopup.show({
        cssClass: 'overlay',
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
              ordercancel(index, today);
            }
          }
        ]
      });





    }



    $scope.filterorders = function (date) {
      var productmonth = $scope.months[new Date(date).getMonth()];
      var prroductyear = new Date(date).getFullYear();
      if ($scope.filter.month && $scope.filter.year) {
        if ($scope.filter.month == productmonth && $scope.filter.year == prroductyear)
          return true;
        else
          return false;
      } else
        return true;
    }
    var indexofcanceledorder;
    var checkindex = function (order) {
      return order.id == $scope.todayorders[indexofcanceledorder].id
    }
    var ordercancel = function (index, today) {
      console.log(today + " " + index);
      indexofcanceledorder = index;
      MyServices.cancelOrder(today ? $scope.todayorders[index].id : $scope.orderhistory[index].id).then(function (params) {
        // getOrders();
        if (params.data.status)
          if (today) {
            $scope.totaloftodayorders -= $scope.todayorders[index].price;
            var indexinorderhistory = $scope.orderhistory.findIndex(checkindex);
            $scope.todayorders.splice(index, 1);
            $scope.orderhistory[indexinorderhistory].status = 'cancelled';

          } else
            $scope.orderhistory[index].status = 'cancelled';
        Materialize.toast('Your order has been cancelled !', 2000);
      }).catch(function (fallback) {
        if (fallback.data)
          Materialize.toast(fallback.data.error, 3000);
      });
    }
    $scope.callfunction = function (datetime) {
      return (new Date(datetime)).toLocaleDateString(); //+"    "+ (new Date(datetime)).toLocaleTimeString();
    }

  })

  .controller('profileCtrl', function ($scope, $stateParams, MyServices) {
    $scope.$on('$ionicView.enter', function (e) {
      // $('.collapsible').collapsible();
      $('ul.tabs').tabs({
        // swipeable: true,
        responsiveThreshold: 1920
      });
      MyServices.getDetails().then(function (params) {
        $scope.retailersdata = params.data.retailer;
      });

    });


  });
