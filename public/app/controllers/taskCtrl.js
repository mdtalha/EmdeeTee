angular.module('taskController',['userServices'])

.controller('taskCtrl',function(User, $scope){
  var app=this

  //get task
  function getTasks(){
        
    User.getTask().then(function(data){  
      app.tasks= data.data.tasks                        
      })
  }

getTasks(); 

  //post task
  app.createTask=function(taskData){
      
    User.addTask(this.taskData).then(function(data){  
      app.taskData.title=""        
      getTasks()
      
    })
    
  }

  //delete task
  app.deleteTask = function(id) {
   
  User.deleteTask(id).then(function(data) {

    getTasks()
         
   });
  };

});



