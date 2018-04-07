var express = require('express'), 
    mysql = require('./dbcon.js'), 
    bodyParser = require('body-parser'), 
    path = require('path');	   
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.use(express.static( path.join(__dirname, 'public')));
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.set('port', 10506); 

app.use('/pokemon', require('./pokemon.js'));

app.use(function(req, res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
}); 






app.listen(app.get('port'), function () {
  console.log('App listening' );
});
