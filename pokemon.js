module.exports = function(){
    var express = require('express');
    var router = express.Router();
   
    function getMoves(res, mysql, context, complete) {
	mysql.pool.query("SELECT id, primarymovename FROM primarymove", function(error, results, fields){
		if(error) {
		 res.write(JSON.stringify(error));
		 res.end();
		}
		context.move = results; 
		complete();
	     }); 
	}
 
    function getPokemon(res, mysql, context, complete){
        mysql.pool.query("SELECT pokemon.id, pokemon.pokemonname,pokemon.evolutionlevel, primarymove.primarymovename AS movename FROM pokemon INNER JOIN primarymove ON movename = primarymove.id",  function(error, results, fields){  
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pokemon = results; 
            complete();
        });
    }
	
    
    function getAPokemon(res, mysql, context, id, complete) {
	var sql = "SELECT id, pokemonname, evolutionlevel, movename FROM pokemon WHERE id=?";
	var inserts = [id];
	mysql.pool.query(sql, inserts, function(error, results, fields) {
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.pokemon = results[0];
		complete();
	     });
	}	

 


 
    router.get('/', function(req, res){
        var callbackCount = 0; 
        var context = {}; 
        context.jsscripts = ["deletepokemon.js", "search.js"]; 
        var mysql = req.app.get('mysql'); 
        getPokemon(res, mysql, context, complete);
	getMoves(res, mysql, context, complete);
        function complete() {
            callbackCount++; 
            if(callbackCount >= 2){
                res.render('pokemon', context); 
            }
	}
});
    
   router.post('/', function(req, res){
	var mysql = req.app.get('mysql');
	var sql = "INSERT INTO pokemon (pokemonname, evolutionlevel, movename) VALUES (?, ?, ?)";
	var inserts = [req.body.pokemonname, req.body.evolutionlevel, req.body.movename];
	sql = mysql.pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error)); 
			res.end();
		} else{
			res.redirect('/pokemon');
		 }
	});

   });

    //Display One Pokemone and update
    router.get('/:id', function(req, res){
	callbackCount = 0;
	var context = {};
	context.jsscripts = ["selectMove.js", "updatepokemon.js"];
	var mysql = req.app.get('mysql');
	getAPokemon(res, mysql, context, req.params.id, complete); 
	getMoves(res, mysql, context, complete); 
	function complete() {
		callbackCount++; 
		if(callbackCount >= 2) {
		 res.render('update-pokemon', context); 
		}
	}
});

   router.get('/search', function(req, res){
	var mysql =  req.app.get('mysql');
	var sql='SELECT pokemonname FROM pokemon WHERE pokemonname LIKE "%' + req.query.key + '%';
	sql = mysql.pool.query(sql, function(error, results, fields) {
		if(error) {
		   res.write(JSON.stringify(error));
		   res.end();
		} else {
			res.status(200);		
			res.end();
	}
   });
}); 

//The URI that data is sent to to dupate Pokemon
    router.put('/:id', function(req, res){
	var mysql = req.app.get('mysql');
	var sql = "UPDATE pokemon SET pokemonname=?, evolutionlevel=?, movename=? WHERE id=?"; 
	var inserts = [req.body.pokemonname, req.body.evolutionlevel, req.body.movename, req.params.id];
	sql = mysql.pool.query(sql, inserts, function(error, results, fields){
		if(error){
		  res.write(JSON.stringify(error));
		  res.end(); 
		} else {
			res.status(200);
			res.end(); 
		  }
		});
	});

router.delete('/:id', function(req, res) {
	var mysql = req.app.get('mysql'); 
	var sql = "DELETE FROM pokemon WHERE id=?";
	var inserts = [req.params.id];
	sql = mysql.pool.query(sql, inserts, function(error, results, fields){
		if(error){
		 res.write(JSON.stringify(error)); 
   		 res.status(400); 
		 res.end(); 
		} else{
			res.status(202).end();
		}
	    })
	})


	return router; 
}();

