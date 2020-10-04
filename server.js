const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MLAB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(cors())

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date
  },
  duration: {
    type: Number
  }
})

const user = mongoose.model('user', userSchema)

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user',(req,res)=>{
  var ObjectId = require('mongodb').ObjectID;
  const newuser=new user({username: req.body.username})
  newuser.save()

  res.json({
    _id: newuser._id,
    username:newuser.username
  })
});
//USER ADDITION COMPLETED ABOVE

app.get("/api/exercise/users",(req,res)=>{
user.find({})
    .then(result=>res.json(result))
    .catch(error=>res.json(error))
})

//all Users returned

app.post("/api/exercise/add",(req,res)=>{
user.findById(req.body.userId,(err,doc)=>{
  if(err) return console.log(err)
  doc.description=req.body.description
  doc.duration=req.body.duration
  req.body.date==""?doc.date=new Date().toDateString():doc.date=req.body.date.toDateString()
  doc.save()
  res.json(doc)
})
})
//User Updated and saved

app.get("/api/exercise/log?:userId",(req,res)=>{
  let responseObject=[];
user.findById(req.query.userId,(err,doc)=>{
if(err){
  return console.log(err)
}
responseObject=doc;
if(req.query.limit){
  responseObject=responseObject.slice(0,req.query.limit)
}
if(req.query.from||req.query.to){
  let fromDate=new Date(0)
  let toDate=new Date()
  if(req.query.from){
    fromDate=new Date(req.query.from)
  }
  if(req.query.to){
    toDate = Date(req.query.to)
  }
  fromDate=fromDate.getTime()
  toDate = toDate.getTime(
    responseObject=responseObject.filter((session)=>{
      let sessionDate=new Date(session.date).getTime()
      return sessionDate>= fromDate && sessionDate<=toDate
    })
  )
}
res.json(responseObject)
})
})

// app.post("/api/exercise/add", (req, res, next) => {
//   userId = req.userId;
//   let date
//   req.date==""?date=new Date():date=req.date;
//   user.findByIdAndUpdate({
//     userId
//   }, {
//     description: req.description,
//     duration: req.duration,
//     date:date
//   },(err,data)=>{
//     if(err){
//       res.send(err)
//     }
//     else{
//       res.send(data)
//     }
//   },{new: true})

// })
// Not found middleware
// app.use((req, res, next) => {
//   return next({status: 404, message: 'not found'})
// })

// // Error Handling middleware
// app.use((err, req, res, next) => {
//   let errCode, errMessage

//   if (err.errors) {
//     // mongoose validation error
//     errCode = 400 // bad request
//     const keys = Object.keys(err.errors)
//     // report the first validation error
//     errMessage = err.errors[keys[0]].message
//   } else {
//     // generic or custom error
//     errCode = err.status || 500
//     errMessage = err.message || 'Internal Server Error'
//   }
//   res.status(errCode).type('txt')
//     .send(errMessage)
// })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})