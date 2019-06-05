'use babel'
import DatabaseHelper from './database'
const express = require('express')
var app = module.exports = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
// require('./router.js')(app);
const session = require('express-session');
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))

require('./router')(app);
app.use(express.static(__dirname + '/views'));

app.use((request, response, next) => {
    console.log(`${request.method} ${request.url}: ${new Date()}`);
    next();
});

app.use(express.static('views'))

app.listen(3001, () => {
    console.log("Server works");
})

app.set('view engine', 'pug');
app.get('/', (request, response) => {
    response.render('login.pug');
});
