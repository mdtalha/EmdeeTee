angular.module('authServices',[])

.factory('Auth',function($http, AuthToken){ 
    authFactory = {};


    authFactory.login=function(logInData){
        return $http.post('/api/authenticate', logInData).then(function(data){
            
            AuthToken.setToken(data.data.token);
            return data;
        });
    };
    

    authFactory.isLoggedIn=function(){
        if(AuthToken.getToken()){
            return true;

        }else{
            return false;
        }

    }
    //Auth.getuser()
    authFactory.getUser = function(){
        if(AuthToken.getToken()){
            return $http.post('/api/me');
        }else{
            $q.reject({message:"user has no token"})
        }
    }
    //Auth.logout();
    authFactory.logout= function(){

        AuthToken.setToken();

        }

    return authFactory;
})

.factory('AuthToken',function($window){
    var authTokenFactory = {};

   // 
    authTokenFactory.setToken=function(token){
        if(token){
        $window.localStorage.setItem('token',token);
        }else{
            $window.localStorage.removeItem('token',token);
        }
    };
    //authTokenFactory.getToken();
    authTokenFactory.getToken= function(){
        return $window.localStorage.getItem('token');
    }

    return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken){
    var authInterceptors={};

    authInterceptors.request=function(config){
        
        var token = AuthToken.getToken();

        if(token) config.headers['x-access-token']= token;
        
        return config;
    }

    return authInterceptors;
})