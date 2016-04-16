var search = function () {
    // console.log("in search func");
    var p = window.location.search.substr(1).split(/\&/), l = p.length, kv, r = {};
    while (l--) {
        kv = p[l].split(/\=/);
        r[kv[0]] = kv[1] || true; //if no =value just set it as true
    }
    return r;
}();
var token;
if (search.token && search.token.length > 0 && search.token != 'undefined') {
    token = search.token;
    console.log("search token: " + token);
    SessionAmplify.set('token', token);

    get_student_name_nus();
    get_matric_no();
}

SessionAmplify = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function(value, key) {
    return [key, JSON.stringify(value)]
  })),
  set: function (key, value) {
    Session.set.apply(this, arguments);
    amplify.store(key, value);
  },
});

if (token && SessionAmplify.get('token')!="") {
  console.log("if check token: " + token);
  SessionAmplify.set('login_choice_flag', false);
  SessionAmplify.set("register_interlace_flag", true);
}

Template.login.onRendered(function(){
  SessionAmplify.setDefault('register_interlace_flag', false);
  SessionAmplify.setDefault('login_choice_flag', true);
  SessionAmplify.setDefault('token', "");

  SessionAmplify.setDefault('username', "");
  SessionAmplify.setDefault('student_name', "");
  SessionAmplify.setDefault('matric_no', "");
  SessionAmplify.setDefault('module_code', "");
  SessionAmplify.setDefault('lecture_id', "");
  SessionAmplify.setDefault('activity_id', "");


  SessionAmplify.setDefault('show_add_friend_div', false);
  SessionAmplify.setDefault('show_add_friend_btn', false);
  SessionAmplify.setDefault('team_size', 1);

  SessionAmplify.setDefault('archive_module_code', "");
  SessionAmplify.setDefault('archive_lecture_id', "");
  SessionAmplify.setDefault('archive_activity_id', "");
  SessionAmplify.setDefault('teammates', []);
  SessionAmplify.setDefault('image_list', []);
  console.log("login onrendered");
});

Template.login.helpers({
    register_interlace: function() {
        return SessionAmplify.get('register_interlace_flag');
    },

    show_login_choice: function() {
      return SessionAmplify.get('login_choice_flag');
    }
});

Template.login.events({
    'click #login_ivle_btn': function(e) {
        e.preventDefault();
        login_ivle();
    }
});

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        console.log("trying to register");
        var user_id = $('[name=user_id]').val();
        var password = $('[name=password]').val();

        Accounts.createUser({
          username: user_id,
          password: password
        }, function(error){
          if(error){
            console.log(error.reason); // Output error if registration fails
          } else {
            Router.go("welcome"); // Redirect user if registration succeeds
          }
        });
        SessionAmplify.set('username', user_id);
        Meteor.call('save_user', user_id, SessionAmplify.get('matric_no'), SessionAmplify.get('student_name'));
    }
});

Template.login_to_interlace.events({
	'submit form': function (e) {
		e.preventDefault();
		var user_id = e.target.user_id.value;
		var password = e.target.password.value;
		!Meteor.loginWithPassword(user_id, password, function(err){
    		if (err)
        		$('#login_error').css("display", "inline");
    		else
       			// The user has been logged in.
        		SessionAmplify.set('username', user_id);
            
            var user = UserInfo.find({user_id: user_id}).fetch();
            console.log("login interlace: " + user[0].matric_no);
            console.log("login interlace: " + user[0].student_name);
            
            SessionAmplify.set('matric_no', user[0].matric_no);
            SessionAmplify.set('student_name', user[0].student_name);
      });
	}
});

function login_ivle() {
  var APIKey = "HkwaOupOwuKRoKglP8Gep";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var returnURL = '';
  if (window.location.href.indexOf("localhost") > -1)
    returnURL = "localhost:3000/welcome";
  else if (window.location.href.indexOf("") > -1)
    returnURL = "interlace.meteor.com";

  var LoginURL = APIDomain + "api/login/?apikey=HkwaOupOwuKRoKglP8Gep&url=http%3A%2F%2F" + returnURL;

  window.location = LoginURL;
}

function get_student_name_nus() {
  var APIKey = "HkwaOupOwuKRoKglP8Gep";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var _token = SessionAmplify.get('token');
  console.log("pupoltae token: " +_token);
  var url = APIUrl + "UserName_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + _token;

  jQuery.getJSON(url, function (data) {
      SessionAmplify.set('student_name', data);
  });
}

function get_matric_no() {
  var APIKey = "HkwaOupOwuKRoKglP8Gep";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var _token = SessionAmplify.get('token');
  var url = APIUrl + "UserID_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + _token;

  jQuery.getJSON(url, function (data) {
      SessionAmplify.set('matric_no', data);
  });
}