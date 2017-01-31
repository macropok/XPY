angular.module('XPY.appControllers', ['ionic','LocalStorageModule','ngCordova'])

//Transaction Page

.controller('mainCtrl', function($scope,localStorageService,$window,$location,$state) {
  $scope.goback = function () {
    $window.history.back();
  }
  $scope.refresh = function(){
    $window.location.reload();
  }
  $scope.show = localStorageService.get("showhead");
  $state.go("home");
})

//Main Page

.controller('homeCtrl', ['$scope','ApiService','$http','$state','$window','$rootScope','localStorageService','$modal', function($scope,ApiService,$http,$state,$window,$rootScope,localStorageService,$modal) {
  document.getElementById("btn_back").style.display="block";
  document.getElementById("btn_refresh").style.display="block";
  //// Balance Page
  $scope.max1="50px;";
  $scope.max2="170px;";
  if(localStorageService.get("chkAllow") == "none")
  {
    $scope.bitAllow = false;
    $(".bitAllow").hide();
    $scope.chkAllow = "none";
  }
  else
  {
    $scope.chkAllow = "block"; 
    $scope.bitAllow = true;
    $(".bitAllow").show();
  }
  //alert($scope.chkAllow);
  localStorageService.set("showhead","0");
  $scope.data ="111"; 
  $scope.xpy = {};
  if($window.screen.height <500)
    $scope.scroll = "true";
  else
    $scope.scroll = false;
  $scope.balance = {};
  $scope.xpy.qrtext = localStorageService.get('qraddr');

  ApiService.getUserData(function(data){
    $scope.xpy.qrtext = data.user.xpy.address[0].address;
    $scope.email = localStorageService.get("email");
    $scope.username = localStorageService.get("username");
    console.log($("#balace_qr"));
    //$(".qrdiv").html('<qr id="balace_qr" class="qr-text" type-number="8" correction-level="\'M\'" input-mode="\'auto\'" text="xpy.qrtext" image="true" size="100"></qr>');
    $scope.balance.xpy = (data.user.xpy.total * 1).toFixed(3);
    $scope.gravatar = data.user.gravatar;
    localStorageService.set('qraddr',data.user.xpy.address[0].address);
    ApiService.getRate(function(btcRate, curRate, currency){
      localStorageService.set("curRate",curRate);
      localStorageService.set("btcRate",btcRate);
      $scope.balance.currency = ($scope.balance.xpy * curRate).toFixed(2);
      $scope.balance.currencytype = currency;
      $scope.balance.btc = ($scope.balance.xpy * btcRate).toFixed(8);
      //console.log(localStorageService.get("price"));
    });  
  });
  
  $scope.sendMoney = function(){
    $state.go('sendmoney');
  }
  $scope.receiveMoney = function(){
    $state.go('receivemoney');
  }
  $scope.cameratap = function () {
    $state.go('sendmoney');
    $rootScope.scanqr();
  }
  $scope.clipaddr = function(){
    localStorageService.set("clipaddr", $scope.xpy.qrtext);
    alert("Address copied to clipboard");
  }

  //Transaction Page
  ApiService.getTransaction(function(data){
    $scope.items = data.data;
    console.log(data);
  });

  ApiService.getaddr(function(data){
    $scope.addrs = data.result;
    console.log(data);
  });
 

  /////Account Page

  $scope.logout = function(){
    $state.go('login');
    localStorageService.set('token','');
  }

  $scope.bitchange = function(data){

    if(data)
    {
      
      localStorageService.set('chkAllow',"block");
      $(".bitAllow").show();
    }
    else
    {
      
      localStorageService.set('chkAllow',"none"); 
      $(".bitAllow").hide();

    }
    //$state.go($state.current);
    //$state.reload();
    //$window.location.reload();
  }

  $scope.currencys = [{name:'USD'},
                    {name:'EUR'},
                    {name:'CNY'},
                    {name:'GBP'},
                    {name:'CAD'},
                    {name:'RUB'},
                    {name:'AUD'},
                    {name:'SEK'},
                    {name:'BRL'},
                    {name:'SGD'},
                    {name:'ZAR'},
                    {name:'NOK'},
                    {name:'ILS'},
                    {name:'CHF'},
                    {name:'RON'},
                    {name:'MXN'},
                    {name:'IDR'},
                    {name:'JPY'}
                    ];

  var cur="USD";
  if(localStorageService.get("currency"))
  {
    cur= localStorageService.get("currency");
  }
  var id = 0;
  for (var i = 0; i < $scope.currencys.length; i++) {
 
  if ($scope.currencys[i]["name"] == cur) {
      id = i;
    }
  }
  
  $scope.currency = $scope.currencys[id];
  $scope.currencyChange = function(data)
  {
    var price = localStorageService.get('price')
    $scope.balance.currency = ($scope.balance.xpy * price[data.name].current.price).toFixed(2);
    $scope.balance.currencytype = data.name;
    localStorageService.set("currency",data.name)
  }

  //// Address Page
  //localStorageService.remove('clipaddr');
  $scope.deladdr = function(addr){
    ApiService.deleteAddr(addr, function(data){
      ApiService.getaddr(function(data1){
        $scope.addrs = data1.result;
      });
    });  
  }
  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        clipaddr: function () {
          return localStorageService.get('clipaddr');
        }
      }
    });

    modalInstance.result.then(function (data) {

        var modalInstance1 = $modal.open({
          templateUrl: 'addAddress.html',
          controller: 'addAddressCtrl',
          size: size,
          resolve: {
            type: function () {
              return data;
            }
          }
        });
        modalInstance1.result.then(function (res) {
          $scope.addrs = res;
          
        }, function () {
         console.log('Modal dismissed at: ' + new Date());
        });
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };
}])
.controller('addAddressCtrl', function ($scope, $modalInstance, type, ApiService, localStorageService) {
  if(type == 'clip')
    address = localStorageService.get('clipaddr');
  else
    address = localStorageService.get('sendaddr');
  $scope.addAddrName = function(data){
    ApiService.addAddress(data,address, function(data){
      var res;
      ApiService.getaddr(function(data1){
        $modalInstance.close(data1.result);
      });

    });  
  }

})
.controller('ModalInstanceCtrl', function ($scope, $modalInstance, clipaddr, $rootScope) {
  
  console.log($('#btn_clipboard'));
  if(clipaddr == null)
    $scope.avclip = true;
  else
    $scope.avclip = false;
  $scope.getfromclip = function(){
    $modalInstance.close('clip');
  }
  $scope.scanadd = function()
  {
    $rootScope.scanqr();
    $modalInstance.close('scan');
  }
  
})
.controller('moneyCtrl', ['$scope','ApiService','$http','$state','$window', function($scope,ApiService,$http,$state,$window) {
  $scope.data ="111"; 
}])

//Account page
.controller('scanqrCtrl', ['$scope','ApiService','$http','$state','$window', function($scope,ApiService,$http,$state,$window) {
  $scope.data ="111"; 
  $scope.scanqr = function(){
    $state.go("scanqr")
  }

}])

//Balance Page

.controller('receivemoneyCtrl', ['$scope','ApiService','$http','$state','localStorageService', function($scope,ApiService,$http,$state,localStorageService) {
	$scope.data ="111"; 
  $scope.type = 0;
  $scope.qrtext = localStorageService.get("qraddr");
	$scope.sendMoney = function(){
		window.location.href = 'view/sendmoney.html';
	}
  $scope.changebright = function(elem){
    var element = angular.element(elem);
    var qrelement = element.find('.qrdiv1');
    qrelement.css( "color", "red");
    $scope.type = ($scope.type + 1) % 3;

    //var element = angular.element(element.find)
  }

}])
.controller('accountsCtrl', function($scope) {
  $scope.data ="222";
})

//myAddress page



.controller('loginCtrl', function($scope, ApiService, $state, $window, localStorageService, $templateCache) {
  document.getElementById("btn_back").style.display="none";
  document.getElementById("btn_refresh").style.display="none";
  $scope.submit = function(){
    ApiService.login($scope.email,$scope.password,function(msg){
      if(msg == "success")
      {
        $templateCache.removeAll();
        $state.go('home', null, { reload: true });
        
        //$window.location.reload();
        //$state.reload();
      }
      if(msg == "auth")
      {
        $state.go('login_auth');  
      }
      if(msg == "error")
      {
        $scope.errormsg = "Bad Email or Password";
      }
    });
  }
  $scope.register = function(){
    $window.location.href ="http://wallet.paycoin.com/#/access/signup";
  }
  localStorageService.set("showhead","1");
})
.controller('loginAuthCtrl', function($scope, ApiService, $state, $window, localStorageService) {
  document.getElementById("btn_back").style.display="none";
  document.getElementById("btn_refresh").style.display="none";
  $scope.submit = function(){
    console.log($scope.gcode);
    ApiService.login_auth($scope.gcode,function(msg){
      if(msg == "success")
      {
        $state.go('home', null, { reload: true });
      }
      if(msg == "error")
      {
        $scope.errormsg = "Wrong Code";
      }
    });
  }
  $scope.register = function(){
    $window.location.href ="http://wallet.paycoin.com/#/access/signup";
  }
  localStorageService.set("showhead","1");
})
.controller('sendMoneyCtrl', function($scope, $cordovaBarcodeScanner,localStorageService,$state) {
  //alert("asdf");
  if(localStorageService.get("chkAllow") == "none")
  {
    $scope.chkAllow = "none";
  }
  else
  {
    $scope.chkAllow = "block"; 
  }
  $scope.data ="333";
  $scope.curRate = localStorageService.get("curRate");
  $scope.curType= localStorageService.get("currency");
  $scope.btcRate = localStorageService.get("btcRate");
  
  //alert($scope.curRate);
  $scope.myaddress = function(){
    $state.go('myaddress');
  }
  $scope.clip = function()
  {
    $scope.qraddr = localStorageService.get("clipaddr");
    console.log(localStorageService.get("clipaddr"));
  }
  $scope.qraddr = localStorageService.get('sendaddr');
  localStorageService.set('sendaddr','');
  //console.log(localStorageService.get('sendaddr'));
})

.controller('myaddressCtrl', function($scope,ApiService,localStorageService,$state) {
  ApiService.getaddr(function(data){
    $scope.addrs = data.result;
    console.log(data);
  });
  $scope.username = localStorageService.get("username");
  
  $scope.qrcode =localStorageService.get('qraddr');
  $scope.retrieveaddr = function(addr)
  {
    localStorageService.set('sendaddr',addr);
    $state.go('sendmoney');
     //$state.transitionTo('sendmoney', {}, { reload: true, inherit: false, notify: true });

    //$state.transitionTo('sendmoney', {}, {reload: true,  inherit: true,  notify: true    });
  }
})