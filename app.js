var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv/config')
//const { MongoClient, ServerApiVersion } = require('mongodb');

var usersRouter = require('./routes/users');
var costsRouter = require('./routes/costs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/costs', costsRouter);

app.get('/',(req,res) => {
  res.send('HomePage :O')
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//mongoose.connect('' , ()=> console.log("connected"));
mongoose.connect(
    process.env.MONGO_URL)
    .then(()=>console.log('connected'))
    .catch(e=>console.log(e));

/*const uri = "mongodb+srv://natip:@65GudhjEhzgb@p@asyncproject.md58a.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("AsyncProject").collection("AsyncDev.customers");
  // perform actions on the collection object
  client.close();*/
//});


module.exports = app;
