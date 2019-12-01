const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const dirRouter = require('./routes/dir');
const fileRouter = require('./routes/file');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/custom-nas',{
  useNewUrlParser:true,
  useUnifiedTopology:true,
})
  .then(() => {
    console.log('connect db');
  }).catch((err) => {
    console.error(err);
  });

require('dotenv').config();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200
}));
app.set('jwt-secret', process.env.secret);

app.use('/auth', authRouter);
app.use('/dir', dirRouter);
app.use('/file', fileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: err.message
  })
});

module.exports = app;