const express = require('express')
const app = express()
var mongo = require('mongodb');
var mongoose = require('mongoose');
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





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})