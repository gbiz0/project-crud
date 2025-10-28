// DEBUG=srvFront:* npm start
var createError = require('http-errors');
var nunjucks = require("nunjucks")
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');



const envFilePath = path.resolve(__dirname, './srvFront.env');
require('dotenv').config({ path: envFilePath });

const port = process.env.PORT
var rtIndex = require('./routes/rtIndex');
var rtContas = require('./routes/rtContas');
var rtFornecedores = require('./routes/rtFornecedores');
jwtchave = process.env.JWTCHAVE;



var app = express();

nunjucks.configure('apps', {
    autoescape: true,
    express: app,
    watch: true
});

app.use(express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWTCHAVE, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null },
  })
);


app.use('/', rtIndex);
app.use('/contas', rtContas);
app.use('/fornecedores', rtFornecedores);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
