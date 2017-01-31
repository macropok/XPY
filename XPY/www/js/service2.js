angular.module('XPY.services', [])
.constant('API_SERVER', 'http://wallet.paycoin.com/api/account/')
.constant('Crypto_Key', 'ca2357e4672ea96acc9bae949538ad8f')
.constant('Crypto_Secret', '$2y$12$Zq/fU5cNJi6lcrn/U4/mDeuYYULBlTaA.Vemk0ZWHFCJbSIubhJPS')
.constant('API_SERVER_RATE','http://paycoinprice.api.cryptoapi.io/v2/price')
.factory('ApiService', ['$http', '$q', 'API_SERVER','localStorageService','API_SERVER_RATE', 'Crypto_Key', 'Crypto_Secret', function($http, $q, API_SERVER,localStorageService,API_SERVER_RATE, Crypto_Key, Crypto_Secret) {

  //Return public API
  return ({
    login : login,
    getRate : getRate,
    getUserData : getUserData,
    getTransaction : getTransaction
  });
  
  function login(email_addr,pass,callback){
    var userdata = {"email" : email_addr, "password" : pass};
    $http({
      method: 'POST',
      url: API_SERVER+"login/",
      data: userdata})
      .success(function(data)
      {
        
        if(!data.error)
        {
          if(data.msg == "success")
          {
            console.log(data.user.id);
            localStorageService.set("email",data.user.email);
            localStorageService.set("token",data.user.id);
            localStorageService.set("username",data.user.username);
            alert(data.user.id);
            return callback("success");  
          }
          else
          {
            return callback("auth");
          }
        }
        else
        {
          //Notification.show(data.error.msg, 'danger', 1);
          alert(data.error.msg);
        }
  
      })
      .error(function(data) {
          console.log(data);
      });
  }
  
  function getTransaction(callback)
  {
    var token = "6d1c4a7fe61cc5afd90573d587376404";
    console.log(token);
    senddata = {"id" : token}
    $http({
      method: 'POST',
      url: API_SERVER+"transactions/",
      data: senddata})
      .success(function(data)
      {
        
        if(!data.error)
        {
          return callback(data);
        }
        else
        {
          //Notification.show(data.error.msg, 'danger', 1);
          alert(data.error.msg);
        }
  
      })
      .error(function(data) {
          console.log(data);
      });
  }
  function getUserData(callback)
  {
    var token = "6d1c4a7fe61cc5afd90573d587376404";
    console.log(token);
    senddata = {"id" : token};
    $http({
      method: 'POST',
      url: API_SERVER+"data/",
      data: senddata})
      .success(function(data)
      {
        
        if(!data.error)
        {
          return callback(data);
        }
        else
        {
          //Notification.show(data.error.msg, 'danger', 1);
          alert(data.error.msg);
        }
  
      })
      .error(function(data) {
          console.log(data);
      });
  }

  // XPY rate update

  function getRate(callback){
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
    var cur="USD";
    if(localStorageService.get("currency"))
    {
      cur= localStorageService.get("currency");
    }
    localStorageService.set("currencyType",cur);

    $http({
    method: 'POST',
    url: API_SERVER_RATE+'/'+cur,
    data: "key=" + Crypto_Key + "&secret=" + Crypto_Secret,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    .success(function(data)
    {
      //localStorageService.set("BTCRate",data.response.price.BTC.current.price);
      //localStorageService.set("CURRate",data.response.price[cur].current.price);
      console.log(data.response.price[cur].current.price);
      return callback(data.response.price.BTC.current.price, data.response.price[cur].current.price, cur);
    })
    .error(function(data) {
         console.log(data);
      });

  }

}]);
/*
.factory('AuthIntercepter', function(localStorageService, $q){
  return {
   request: function(config){
   	
    config.headers = config.headers || {};
    var token = localStorageService.get('token');
    if (token){
     config.headers.Authorization ="Bearer: " + token;
    }
    console.log(config);
    return config;
   },
   response: function(response){
   	//console.log(response);
    if (response.status === 401){
     localStorageService.remove('token');

    }
    return response || $q.when(reponse);
   }
  }
 });



*/