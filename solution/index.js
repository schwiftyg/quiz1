const createError = require('http-errors'); 
const express = require('express'); //*
const path = require('path'); //*
const cookieParser = require('cookie-parser'); //*
const logger = require('morgan'); //*

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express(); //*

// view engine setup
app.set('views', path.join(__dirname, 'views')); //*
app.set('view engine', 'ejs'); //* but installed ejs and uninstalled jade

app.use(logger('dev')); //*
app.use(express.json());

//urlencoded decodes POST requests coming from HTML forms
//This middleware comes with express and you call it on express
//You can pass in an object with options
//When "extended" is set to "true", it allows forms to POST data
//as arrays and objects. If set to false, it will only accept strings
app.use(express.urlencoded({ extended: true })); //*

const methodOverride = require('method-override');
//Most functionality default to a GET http request
//Some default or can be overridden to a POST req
//For the rest we need middleware like method-override to enable
//requests like PATCH, DELETE, PUT, etc
// docs: https://www.npmjs.com/package/method-override#custom-logic

app.use(methodOverride((req, res) => {
  if (req.body && req.body._method){
    const method = req.body._method;
      // This modifies the request object
      // it changes it from a POST request
      // to be whatever the value for _method was
      // within the form that was just submitted
      // it changes the request to that method name
      // then this request can reach the correct route
    return method;
  }
}))

app.use(cookieParser()); //* 
//above adds a property called 'cookies' to the req object
app.use(express.static(path.join(__dirname, 'public'))); //* for static assets like bootstrap

//Custom middleware to create and store cookies:
app.use((req,res, next) => {
  // const todos = req.cookies.todos || [];
  const username = req.cookies.username || '';
  // res.locals.todos = todos;
  //properties set on res.locals become accessible in any views
  //almost like a global variable
  res.locals.username = username;
  next();
})
 

app.get('/', (req, res) => {  
  res.redirect('/clucks')
})

const userRouter = require('./routes/user')
app.use('/user',userRouter);

const clucksRouter = require("./routes/clucks");
app.use("/clucks", clucksRouter)

const trendRouter = require("./routes/trend");
app.use("/trend", trendRouter)


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


//Add server Domain and Host:
const PORT = 5858;
const HOST = 'localhost';
app.listen(PORT, HOST, () => {
  console.log(`The server is listening at ${HOST}:${PORT}`)
})

module.exports = app;
