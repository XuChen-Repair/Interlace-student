
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Template.welcome.onRendered(function(){
    this.$(".accordion").accordion();
});

Template.welcome.helpers({
    get_student_name: function () {
        return SessionAmplify.get('student_name');
    }
});

Template.welcome.events({
        
});