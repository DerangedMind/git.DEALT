const express = require('express')
const app = express()
const path = require('path')
const favicon = require('serve-favicon')
const knex = require('./knexserver')

const logger            = require('morgan')
const cookieParser      = require('cookie-parser')
const bodyParser        = require('body-parser')
const session           = require ('express-session')

const passport          = require('passport')
const flash             = require('connect-flash')
const FacebookStrategy  = require('passport-facebook').Strategy

require('./config/passport')(passport)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ilovekombucha'
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

const routes = require('./routes/index.js')(app, passport)
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
