var $__trip_auth_intercepter_js = (function(){
 angular.module('trip.authintercepter.service', ['LocalStorageModule', 'trip.config.service'], null).factory('AuthIntercepter', function(localStorageService, $q, Config){
  return {
   request: function(config){
    config.headers = config.headers || {};
    var user = localStorageService.get('user');
    if (user && user.token && config.url.indexOf(Config.apiPath) === 0){
     config.headers.Authorization = user.token;
    }
    return config;
   },
   response: function(response){
    if (response.status === 401){
     localStorageService.remove('user');
    }
    return response || $q.when(reponse);
   }
  }
 });
 return Object.preventExtensions(Object.create(null, {}));
}).call(this);