angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','mainController','authServices','taskController'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
})
