Session.setDefault('counter', 0);
Session.setDefault('login_status', false);

Session.setDefault('student_name', "Xu Chen");
Session.setDefault('matric_no', "A0105522W");
Session.setDefault('module_code', "");
Session.setDefault('lecture_id', "");
Session.setDefault('activity_id', "");


Session.setDefault('show_add_friend_div', false);
Session.setDefault('show_add_friend_btn', false);
Session.setDefault('team_size', 1);

Session.setDefault('archive_activity_id', "");
Session.setDefault('teammates', []);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Template.welcome.onRendered(function(){
    this.$(".accordion").accordion();
});

Template.welcome.helpers({
    get_student_name: function () {
        return Session.get('student_name');
    }

    // user_logined: function () {
    // 	console.log("Check status: " + Session.get('login_status'));

    // 	return Session.get('login_status');
    // }
});

Template.welcome.events({
        
});