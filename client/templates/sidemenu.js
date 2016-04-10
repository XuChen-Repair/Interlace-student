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
  Meteor.subscribe('assignments');
  Meteor.subscribe('group_list');
  Meteor.subscribe('archive_list');
});
    
Template.sidemenu.helpers({
  // user_logined: function () {
  //   console.log("Check status: " + Session.get('login_status'));

  //   return Session.get('login_status');
  // }
  get_matric_no: function () {
    return Session.get('matric_no');
  }
});
    
Template.sidemenu.events({
  'click #logout': function(e) {
    e.preventDefault();

    Meteor.logout();
  }
});

// function loginIVLE() {
//         var APIKey = "HkwaOupOwuKRoKglP8Gep";
//         var APIDomain = "https://ivle.nus.edu.sg/";
//         var APIUrl = APIDomain + "api/lapi.svc/";
//         var returnURL = '';
//         if (window.location.href.indexOf("localhost") > -1)
//             returnURL = "localhost:3000/welcome";
//         else if (window.location.href.indexOf("") > -1)
//             returnURL = "interlace.meteor.com";

//         var LoginURL = APIDomain + "api/login/?apikey=HkwaOupOwuKRoKglP8Gep&url=http%3A%2F%2F" + returnURL;

//         window.location = LoginURL;
//         Session.set('login_status', true);
//         console.log(Session.get('login_status'));
//     }