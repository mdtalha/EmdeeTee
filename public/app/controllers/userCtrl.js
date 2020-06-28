angular.module('userControllers',['userServices'])

.controller('regCtrl',function($http,$location,$timeout, User){

    var app=this;

    this.regUser=function(regData){
     app.load=true;   
     app.errMesg=false;
     
     User.create(app.regData).then(function(data){

         if(data.data.success){

            app.load=false;
            app.successMesg=data.data.message + '....Redirecting';
            $timeout(function(){
                $location.path('/');
            },2000);

         }
         else{

            app.load=false;
            app.errMesg=data.data.message;

         }

     });

    };
    this.checkUsername= function(regData){

        app.checkingUN=true;
        app.usernameMsg= false;
        app.usernameInvalid= false

        User.checkUsername(app.regData).then(function(data){
            if(data.data.success){
                app.checkingUN= false
                app.usernameInvalid= false
                app.usernameMsg= data.data.message
                
            }else{
                app.checkingUN= false
                app.usernameInvalid= true
                app.usernameMsg = data.data.message
                
            }
        })
    }

    this.checkEmail=function(){

        app.checkingE=true;
        app.emailMsg= false;
        app.emailInvalid= false

        User.checkEmail(app.regData).then(function(data){
            if(data.data.success){
                app.checkingE= false
                app.emailInvalid= false
                app.emailMsg= data.data.message
            }else{
                app.checking= false
                app.emailInvalid= true
                app.emailMsg = data.data.message
            }
        })
    }    
})

 .directive('match',function(){
    return{
        restrict: 'A',
        controller:function($scope){

            $scope.confirmed=false;

            $scope.doConfirm= function(values){
                values.forEach(function(ele){

                    if($scope.confirm == ele){
                        $scope.confirmed= true
                        
                    }else{
                        $scope.confirmed=false;
                    }
                })
            }
        },
        link: function(scope,element, attrs){
            attrs.$observe('match',function(){
               scope.matches= JSON.parse(attrs.match)
                scope.doConfirm(scope.matches)
            });
            scope.$watch('confirm',function(){
                scope.matches= JSON.parse(attrs.match)
                scope.doConfirm(scope.matches)
            })
        }
    }
});
