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
app.use(express.static('/'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/')
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////

var Schema = mongoose.Schema;

var userSchema = new Schema({
  _id: {'type': String, 'default': shortid.generate},
  username: {type: String, required: true},
  activity: [{date: Date, description: String, duration: Number}]
});

var userModel = mongoose.model('userModel', userSchema);

app.route('/api/exercise/new-user').post(function(req, res){
  
  if (!req.body.username) {return res.send("No username provided");}

  var query = userModel.findOne({username: req.body.username});
  
  query.then(function(doc){
    if(!doc){
      //var newId = shortid.generate; console.log(newId);
      var newUser = new userModel({username: req.body.username});
      newUser.save(function(err, data){
        res.json({username: data.username, _id: data._id});
      });
    }
    else{res.json({"message": "already in database"});}
  });
  
});
  
app.route('/api/exercise/add').post(function(req, res){
  
  var date = new Date(req.body.date);
  
  if (date == "Invalid Date") {return res.send("Not a valid date format");}
  if (!req.body.description) {return res.send("No description provided");}
  if (!req.body.duration) {return res.send("No duration provided");}
  if (!req.body.userId) {return res.send("No user ID provided");}

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


//////////////////////////////////////////////////////////////////////////////////////////////////////////


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})