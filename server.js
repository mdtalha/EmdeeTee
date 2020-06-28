 var express   = require('express');
 var app       = express();
 var port      = process.env.port||8080;
 var morgan    = require('morgan');
 var mongoose  = require('mongoose');
 var bodyParser = require('body-parser');
 var router    = express.Router();
 var appRoutes = require('./app/routes/api')(router);
 var path      = require('path');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }))// parse application/x-www-form-urlencoded
app.use(bodyParser.json())// parse application/json
app.use(express.static(__dirname + '/public'))
app.use('/api',appRoutes);
//8080/api/users

mongoose.connect('mongodb://localhost:27017/mean',{ useNewUrlParser: true, useUnifiedTopology: true},function(err)
{
    if(err){
        console.log("not connected to bd " + err);
    }else{
        console.log("connected to bd");
    }
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


app.get('*',function(req,res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
 
app.listen(port,function(){
     console.log("running on the server "+ port);
 });