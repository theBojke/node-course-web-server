const express = require('express');
const hbs = require('hbs');

//node modules
const fs = require('fs');

//creating Express application
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

//handlebars helpers
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//app set allows to set various express settings using key, value pairs
//here we are setting view engine to hbs
//"views" directory is default directory that express.js uses for your templates
app.set('view engine', 'hbs');

//middleware lets you configure how your express app works
//app.use() is registering middleware by taking middleware function as first parameter
//middleware function can be third party module or it can be an internal express function
//middleware is executed in the order you call app.use()

//next tells to express when your middleware is done
//if next() is not called, app will stop
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    fs.appendFile('server.log', log + '\n', (err) => {
      if(err){
          console.log('Unable to append server.log'); 
      }
    });

    next();
});

//app.use((req, res, next) => {
//    res.render('maintenance.hbs');
//});

//__dirname stores path to your project directory (node-web-server in this case)
//defining static directory
app.use(express.static(__dirname + '/public'));

//http route handlers
app.get('/', (req, res) => {
    //res.send('<h1>Hello Express!</h1>');
    //res.send({
    //    name: 'Nikola',
    //    likes: ['Comics', 'Chess']
    //})

    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome Home'
    })
});

app.get('/about', (req, res) => {
    //res.render renders any of the templates specified with current view engine
    res.render('about.hbs', {
        pageTitle: 'About Page'
    })
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});