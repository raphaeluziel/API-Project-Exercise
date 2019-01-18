const express = require('express')
const app = express()
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const shortid = require('shortid');

var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


var Schema = mongoose.Schema;

var userSchema = new Schema({
  _id: {'type': String, 'default': shortid.generate},
  username: {type: String, required: true},
  activity: [{date: Date, description: String, duration: Number}]
});

var userModel = mongoose.model('userModel', userSchema);


app.route('/api/exercise/new-user').post(function(req, res){
  
  if (!req.body.username) {return res.send("No username provided");}

  var query = userModel.findOne({username: req.body.username}, function(err, doc){
    if(!doc){
      var newUser = new userModel({username: req.body.username});
      newUser.save(function(err, data){
        res.json({username: data.username, _id: data._id});
      });
    }
    else{res.json({"message": "already in database"});}
  });
  
});
  

app.route('/api/exercise/add').post(function(req, res){
  
  var date;
  req.body.date ? date = new Date(req.body.date) : date = new Date();
  
  if (!req.body.userId) {return res.send("No user ID provided");}
  if (!req.body.description) {return res.send("No description provided");}
  if (!req.body.duration) {return res.send("No duration provided");}
  if (date == "Invalid Date") {return res.send("Not a valid date format");}
  

  userModel.findById(req.body.userId, function(err, data){

    if (err) return console.log("ERROR FINDING BY ID");
    
    if(!data) {return res.send("No user with that ID exists")}
    
    data.activity.push({date: req.body.date, description: req.body.description, duration: req.body.duration});
    data.save(function(err, updatedActivity){
      if(err) return console.log("ERROR SAVING ACTIVITY");
      res.json({
        username: data.username,
        date: date.toDateString(),
        description: req.body.description,
        duration: req.body.duration,
        userId: req.body.userId
      });
    });
  });
});


app.route('/api/exercise/log').get(function(req, res){
  
  var from, to;
  
  (!req.query.from) ? from = new Date(0) : from = new Date(req.query.from);
  (!req.query.to) ? to = new Date() : to = new Date(req.query.to);
  
  if ((from == "Invalid Date") || (to == "Invalid Date")) {return res.json({message: "Not a valid date format"})}
 
  var query = userModel.findById(req.query.userId, function(err, doc){
    
    if (err) return console.log("ERROR FINDING BY ID");
    
    if(!doc) {return res.json({message: "No user with that ID exists"})}
    
    var log = [];

    var len;
    req.query.limit > doc.activity.length ? len = doc.activity.length : len = req.query.limit;
    
    for (var i = 0; i < doc.activity.length; i++){
      log.push({"date": doc.activity[i].date, "description": doc.activity[i].description, "duration": doc.activity[i].duration});
    }
    
    log.sort((a, b) => b.date - a.date);
    
    log = log.filter(d => d.date >= from && d.date <= to);
    
    if(req.query.limit > 0){
      log = log.slice(0, req.query.limit);
    }
    
    log.forEach(function(d){
      d.date = d.date.toDateString();
    });
    
    res.json({_id: doc._id, username: doc.username, from: from.toDateString(), to: to.toDateString(), count: log.length ,log: log});
  })
  
});


app.route('/api/exercise/users').get(function(req, res){
  
  userModel.find({}, function(err, doc){
    
    if (err) return console.log("ERROR FINDING ALL USERS");
    
    if(!doc) {return res.json({message: "Database is empty"})}
    
    var users = [];
    
    for (var i = 0; i < doc.length; i++){
      users[i] = {"username": doc[i].username, "userId": doc[i]._id}
    }
    
    res.send(users);
  })
  
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});