function getUsers(searchinput){
	$.ajax({
		type: 'GET', 
		url: '/search/?key=' + searchinput,
		success: function(result){
			window.location.reload(true);
		}
	})  
};
