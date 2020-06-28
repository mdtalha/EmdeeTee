angular.module('userServices',[])

.factory('User',function($http){
    var userFactory = {};


    userFactory.create=function(regData){
        return $http.post('/api/users', regData)
    }

    userFactory.checkUsername=function(regData){
        return $http.post('/api/checkusername', regData)
    }

    userFactory.checkEmail=function(regData){
        return $http.post('/api/checkemail', regData)
    }
    userFactory.renewSession=function(username){
        return $http.get('/api/renewToken/' + username) 
    }
    //task services
    userFactory.getTask=function(){
        return $http.get('/api/tasks') 
    }
    userFactory.addTask=function(taskData){
        return $http.post('/api/tasks',taskData) 
    }
    userFactory.deleteTask=function(taskId){
        return $http.delete('/api/tasks/' + taskId) 
    }



    return userFactory;
});

    
