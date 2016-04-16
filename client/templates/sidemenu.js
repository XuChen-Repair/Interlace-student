Template.sidemenu.onRendered(function(){
  this.$('.sidebar.menu').sidebar('attach events', '.toc.item');
  this.$('.masthead').visibility({
    once: false,
    onBottomPassed: function() {
     $('.fixed.menu').transition('fade in');
    },
    onBottomPassedReverse: function() {
      $('.fixed.menu').transition('fade out');
    }
  }); 
  Meteor.subscribe('lecture_schedule');
  Meteor.subscribe('activities');
  Meteor.subscribe('archive_list');
  Meteor.subscribe('student_answer');
  Meteor.subscribe('images');
  Meteor.subscribe('user_info');
});
    
Template.sidemenu.helpers({
  get_student_name: function () {
    return SessionAmplify.get('student_name');
  }
});
    
Template.sidemenu.events({
  'click #logout': function(e) {
    e.preventDefault();
    SessionAmplify.set('register_interlace_flag', false);
    SessionAmplify.set('login_choice_flag', true);
    teammate_lst = [];
    Meteor.logout();
  }
});