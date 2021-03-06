require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, ('connection error')))
db.once('open', () => {
  console.log('Connected database')
})

// const indexRouter = require('./routes/index');
const customerRouter = require('./routes/customers');
const itemRouter = require('./routes/items');
const cartRouter = require('./routes/carts');
const adminRouter = require('./routes/admin')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/api/customers', customerRouter);
app.use('/api/items', itemRouter);
app.use('/api/carts', cartRouter);
app.use('/api/admin', adminRouter);

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

module.exports = app;
