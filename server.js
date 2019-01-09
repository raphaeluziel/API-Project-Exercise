const express = require('express')
const app = express()
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')

var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });

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
  username: {type: String, required: true},
  //userId: {type: String, required: true}
});

var userModel = mongoose.model('userModel', userSchema);

app.route('/api/exercise/new-user').post(function(req, res){

  res.json({"message": req.body.username});

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})