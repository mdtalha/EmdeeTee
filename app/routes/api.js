var User      = require('../models/user');
var Task      = require('../models/task');
var jwt       = require('jsonwebtoken');
var secret    = 'harrypotter';


module.exports=function(router){

    //user reg.
 router.post('/users',function(req,res){
    var user=new User();
   user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.name = req.body.name;
    if(req.body.username ==null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''|| req.body.name ==null || req.body.name == '' ){
        
        res.json({success:false ,message:'Ensure all fields are  provided'});
    }
    else{
        user.save(function(err){
            if(err){
                if(err.errors != null){

                    if(err.errors.email){
                        res.json({success:false ,message: err.errors.email.message});
                    }else if(err.errors.username){
                        res.json({success:false ,message: err.errors.username.message});
                    }else if(err.errors.password){
                        res.json({success:false ,message: err.errors.password.message});
                    }else{
                        res.json({success:false ,message: err});
                    }
                } 

                else if(err){
                    if(err.code == 11000){
                        res.json({success:false ,message: "Username or E-mail address already exist" });
                      
                   }else{
                    res.json({success:false ,message: err});
                    }
                }
                
            }else {
                res.json({success:true ,message:'user created'});
            }
        });
    }
});


router.post('/checkusername',function(req,res){
    User.findOne({ username: req.body.username}).select(' username ').exec(function(err,user){
        if(err) throw err;

        if(user){
            res.json({success:false ,message:'Username is already taken'});
        }else{
            res.json({success:true ,message:'Valid username'});
        }


    });
});

router.post('/checkemail',function(req,res){
    User.findOne({ email: req.body.email}).select(' email ').exec(function(err,user){
        if(err) throw err;

        if(user){
            res.json({success:false ,message:'E-mail is already taken'});
        }else{
            res.json({success:true ,message:'Valid E-mail'});
        }


    });
});


//user auth
router.post('/authenticate',function(req,res){
    User.findOne({ username: req.body.username}).select('email username password').exec(function(err,user){
        if(err) throw err;

        if(!user){
            res.json({success:false ,message:'Could not authenticate user'});
        }else if(user){
            if(req.body.password) {
                var validPassword= user.comparePassword(req.body.password);
            }
            else{   res.json({success:false ,message:'No Password Provided'})    }
            if(!validPassword){
                res.json({success:false ,message:'Could not authenticate Password'});  
            }else{
                var token = jwt.sign({ _id:user._id, username: user.username, email: user.email},secret, {expiresIn: '2h'});
                res.json({success: true ,message:' User authenticated ',token: token});
            }

        }
    });
});

router.use(function(req,res,next){
   var token= req.body.token||req.body.query||req.headers['x-access-token'];
   if(token){
       jwt.verify(token, secret, function(err,decoded){
           if(err){
                res.json({success: false, message: 'token invalid'})
           }else{
               req.decoded= decoded;                
               next();
           }
       })

   }else{
       res.json({sucess:false,message:"no token provided"});
   }
})

router.post('/me',function(req,res){
    res.send(req.decoded)
});

router.get('/renewToken/:username', function(req,res){
    User.findOne({username: req.params.username}).select().exec(function(err,user){
        if(err) throw err;
        if(!user){
            res.json({sucess:false ,message:"no user found"})
        }else{
            var newToken = jwt.sign({ username: user.username, email: user.email},secret, {expiresIn: '2h'});
            res.json({success: true ,token: newToken});

        }

    })
})
router.get('/tasks', function(req, res)  {
Task.find({_userId: req.decoded._id},function(err,Tasks){
    if(err){
        res.json({Error:err})
    }else{
        res.json({tasks: Tasks});
    }
})

})

router.post('/tasks',function(req, res)  {
 
    var title1 = req.body.title

    var newTask = new Task({
        title: title1,
        _userId:req.decoded._id
        
    });
    
    
    newTask.save().then((taskDoc) => {
        
        res.json({tasks: taskDoc});
    })
});

router.patch('/tasks/:id', (req, res) => {
    
    Task.findOneAndUpdate({ _id: req.params.id, _userId: req.decoded._id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
});

router.delete('/tasks/:id', (req, res) => {
    
    Task.findOneAndRemove({
        _id: req.params.id,
        _userId: req.decoded._id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

    })
});






return router;
}



