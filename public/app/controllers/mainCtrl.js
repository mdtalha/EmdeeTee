//const user = require("../../../app/models/user");

angular.module('mainController',['authServices','userServices'])

.controller('mainCtrl',function(Auth,User,$location,$timeout,$rootScope,$interval,$window,$route,AuthToken){ 
    var app=this;
    app.loadme= false;

    app.checkSession=function(){
        if(Auth.isLoggedIn()){
            app.checkingSession=true;
            var interval= $interval(function(){
                var token=$window.localStorage.getItem('token');
                if(token== null){
                    $interval.cancel(interval);                    
                }else{
                    self.parseJwt = function(token) {
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-', '+').replace('_', '/');
                        return JSON.parse($window.atob(base64));
                    }
                    var expireTime = self.parseJwt(token)
                    var timeStamp= Math.floor(Date.now() / 1000)
                    //console.log(expireTime.exp)
                    //console.log(timeStamp)
                    var timeCheck= expireTime.exp - timeStamp;
                    //console.log("a=" + timeCheck)
                    if(timeCheck <= 600){
                        console.log("expired")
                        showModal(1);
                        $interval.cancel(interval);
                    }else{
                        console.log("not exp")
                    }

                }

            },2000);


        }

    }
    app.checkSession();

    var showModal =function(option){
        app.modalHeader= undefined
        app.modalBody= undefined
        app.choiceMade= false
        app.hidebuttons= false;
        if(option==1){

        app.modalHeader= 'Timeout Warning';
        app.modalBody= 'Your session will expire in 10mins. would you like to renew sessions';
        $("#myModal").modal({backdrop: "static"});
        $timeout(function() {
            if (!app.choiceMade) app.endSession(); // If no choice is made after 10 seconds, select 'no' for them
        }, 10000);


        }else if(option== 2){
            app.hidebuttons=true;
            app.modalHeader='Logging Out..'
            $("#myModal").modal({backdrop: "static"});
            $timeout(function(){
                Auth.logout()
                $location.path('/')
                hideModal();
                $route.reload()

            },3000);

        }

        $timeout(function(){
            if(!app.choiceMade){
                
                hideModal();
            }

        },4000)
    };

    app.renewSession = function(){
        app.choiceMade=true;
        User.renewSession(app.username).then(function(data){
            if(data.data.success){
                AuthToken.setToken(data.data.token)
                app.checkSession();                
            }else{

                app.modalBody= data.data.message;

            }
        })
        hideModal();

    };

    app.endSession = function(){
        app.choiceMade=true;
        hideModal();
        $timeout(function(){
            showModal(2);
        },1000)

    };

    var hideModal = function(){
        $("#myModal").modal('hide');

    }


    $rootScope.$on('$routeChangeStart',function(){
        if(!app.checkingSession)app.checkSession();

        if(Auth.isLoggedIn()){
            //console.log("user logged in");
            app.isLoggedIn = true;
            Auth.getUser().then(function(data){
                
                app.username= data.data.username;
                app.useremail= data.data.email;
                app.loadme= true;
            })
        }else{
            //console.log('not logged in');
            app.isLoggedIn = false;            
            app.username= "";
            app.loadme=true;
        }

    })

    this.doLogin=function(loginData){
        app.load=true;   
        app.errMesg=false;
        
        Auth.login(app.logInData).then(function(data){
       
            if(data.data.success){
       
               app.load=false;
               app.successMesg=data.data.message + '....Redirecting';
               $timeout(function(){
                   $location.path('/task');
                   app.logInData='';
                   app.successMesg= false;
                   app.checkSession();
               },2000);
       
            }
            else{
       
               app.load=false;
               app.errMesg=data.data.message;
       
            }
       
        });
       
       };

       app.logout= function(){
           showModal(2);

       }
       
       });
       




