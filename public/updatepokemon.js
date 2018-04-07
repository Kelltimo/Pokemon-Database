function updatePokemon(id) {
	$.ajax({
		url: '/pokemon/' + id, 
		type: 'PUT', 
		data: $('#update-pokemon').serialize(), 
		success: function(result) {
		  window.location.replace("./"); 
		}
	})
};
