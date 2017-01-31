// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('XPY', ['ionic', 'XPY.appControllers','ja.qr','LocalStorageModule','XPY.services','tabSlideBox','ngCordova','ngRoute','ui.bootstrap'])

app.run(function($rootScope,$ionicPlatform,localStorageService,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  console.log(localStorageService.get("token"));
  //localStorageService.set("token","6d1c4a7fe61cc5afd90573d587376404");
  $rootScope.scanqr = function(){
    alert("Scanning");
    $cordovaBarcodeScanner.scan().then(function(imageData) {
            localStorageService.set("sendaddr", imageData.text);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
  }

  localStorageService.set("showhead","0");
  if(!localStorageService.get("token"))
  {
    window.location.href = "/#/login";
    localStorageService.set("showhead","1");
  }
})
.config(function($stateProvider, $routeProvider) {
  $routeProvider.when('/home',
                   { templateUrl: 'View/home.html',
                    controller: 'homeCtrl'})
                .otherwise({
        redirectTo: '/home'
      });
  $stateProvider.state('login', {
    url: '/login',
    views: {
      'mainview': {
      templateUrl: 'View/login.html',
      controller: 'loginCtrl'
    }}
  })
  $stateProvider.state('home', {
    url: '/home',
    views: {
      'mainview': {
      templateUrl: 'View/home.html',
      controller: 'homeCtrl'
    }
    }
  })
  $stateProvider.state('login_auth', {
    url: '/login_auth',
    views: {
      'mainview': {
      templateUrl: 'View/login_auth.html',
      controller: 'loginAuthCtrl'
    }}
  })
  $stateProvider.state('receivemoney', {
    url: '/receivemoney',
    views: {
      'mainview': {
      templateUrl: 'View/ReceiveMoney.html',
      controller: 'receivemoneyCtrl'
    }
    }
  })

  $stateProvider.state('scanqr', {
    url: '/scanqr',
      templateUrl: 'View/accounts.html',
      controller: 'scanqrCtrl'
  })
  $stateProvider.state('sendmoney', {
    url: '/sendmoney', 
    views: {
      'mainview': {
      templateUrl: 'View/sendmoney.html',
      controller: 'sendMoneyCtrl' 
    }},
    cache: false
  })
  $stateProvider.state('myaddress', {
    url: '/myaddress', 
      views: {
      'mainview': {
      templateUrl: 'View/myaddress.html',
      controller: 'myaddressCtrl' 
    }}
  })
  
})
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('XPY');
})
.config(function function_name ($httpProvider) {
  //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  //$httpProvider.interceptors.push('AuthIntercepter');
  //$httpProvider.defaults.headers.common={'Authorization' : "Bearer 8db934e784600b77438d7d212bcb05657a211518"};
  console.log($httpProvider.defaults.headers);
});
