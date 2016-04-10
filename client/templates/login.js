// Accounts.createUser({
//     user_id: user_id,
//     password: password
// });
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var user_id = $('[name=user_id]').val();
        var password = $('[name=password]').val();
    }
});

Template.login.events({
	'submit form': function (e) {
		e.preventDefault();
		var user_id = e.target.user_id.value;
		var password = e.target.password.value;
		!Meteor.loginWithPassword(user_id, password, function(err){
    		if (err)
        		$('#login_error').css("display", "inline");
    		else
       			// The user has been logged in.
        		Session.set('matric_no', user_id);
    	});
	}
});