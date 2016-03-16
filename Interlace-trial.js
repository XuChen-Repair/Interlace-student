Router.route('/welcome');

Router.route('/activity_page',{
    template: 'activity_page'
});
Router.route('/archive', {
    template: 'archive'
});

Router.route('/lecture:_lecture_id',{
    template: 'activity_list'
});

Router.route('/activity:_activity_id', {
    template: 'activity',
    data: function() {
        //console.log(this.params._activity_id);
        Session.set('activity_id', this.params._activity_id);
    }
});

Router.route('/archive/lecture:_lecture_id/activity:_activity_id', {
    template: 'archive_submission',
    data: function() {
        Session.set('archive_lecture_id', this.params._lecture_id);
        Session.set('archive_activity_id', this.params._activity_id);
    }
});

Router.configure({
    layoutTemplate: 'sidemenu'
});


LectureSchedule = new Mongo.Collection("lecture_schedule");
Assignments = new Mongo.Collection("assignments");
GroupList = new Mongo.Collection("student_answer");
SubmissionList = new Mongo.Collection("submission_list");


if (Meteor.isCordova) {

}


if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Session.setDefault('student_name', "Xu Chen");
    Session.setDefault('matric_no', "A0105522W");
    Session.setDefault('module_code', "");
    Session.setDefault('lecture_id', "");
    Session.setDefault('activity_id', "");


    Session.setDefault('show_add_friend_div', false);
    Session.setDefault('show_add_friend_btn', false);
    Session.setDefault('team_size', 1);

    Session.setDefault('archive_activity_id', "");

    // var activity_id = 1;
    var question_id = 1;
    var teammate_lst = [];

    Session.setDefault('teammates', teammate_lst);

    Template.body.helpers({

    });

    Template.body.events({
        
    });

    Template.welcome.helpers({
        get_student_name: function () {
        return Session.get('student_name');
        }
    });

    Template.welcome.events({
        
    });

    Template.activity_page.helpers({
        has_current_module: function() {
            var cur_date = moment().startOf('day');
            var tomo_date = moment(cur_date).add(1, 'days');
            
            var list = LectureSchedule.find({
                date : {
                    $gte: cur_date.toDate(),
                    $lt: tomo_date.toDate()
                }
            }).fetch();
      
            //var cur_module_code = "";
            //console.log(list);

            if (list.length > 0 ) {
                var result = list[0];

                Session.set('module_code', result["module_code"]);
                Session.set('lecture_id', result["lecture_id"]);

                //cur_module_code = result["module_code"];
                //console.log("1");
            } else {
                //console.log("2");
                return false;
            }
            //console.log("3");
            return true;
        },

        get_current_module: function() {
            return Session.get('module_code');
        },

        get_lecture_id: function() {
            return Session.get('lecture_id');
        }
    });

    Template.activity_page.events({

    });


    Template.activity_list.helpers({
        get_activity_list: function() {
            var module_code = Session.get('module_code');
            var lecture_id = Session.get('lecture_id');

            var activity_list = Assignments.find({
                $and: [
                    {"data.module_code" : "CS3219"},
                    {"data.lecture_id" : "1"}
                ]
            }).fetch();
            

            //console.log(activity_list);
            return activity_list;
        },

        get_activity_name: function(data) {
            var str = "Activity ";
            return str.concat(data.activity_id);
        },

        get_activity_type: function(data) {
            if (data.team_size == "1") {
                return "Individual Work";
            } else {
                return "Group Work";
            }
            //return data.type;
        },

        get_activity_description: function() {
            return "Dummy description";
        },

        is_enabled_activity: function(status) {
            //console.log(status);
            return status == "enabled";
        },

        is_individual_activity: function(team_size) {
            return team_size == "1";
        }

    });

    Template.activity_list.events({
        
    });


    Template.activity.helpers({
        get_student_matric: function() {
            return Session.get('matric_no');
        },

        get_activity_name: function() {
            var str = "Activity ";
            return str + (Session.get('activity_id'));
        },

        question: function() {
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            //console.log("_id: " + _id);

            var tuple = Assignments.find({_id: _id}).fetch();
            var data = tuple[0].data;
            var question_list = data.question_list;

            return question_list;
        },

        is_mcq_type: function(type) {
            return type == "mcq";
        },

        is_saq_type: function(type) {
            return type == "saq";
        },

        teammate: function() {
            if (teammate_lst.length == 0) {
                teammate_lst.push({"matric_no" : Session.get('matric_no')});
                Session.set('teammates', teammate_lst);
            }
            return Session.get('teammates');
        },

        show_add_friend_div: function() {
            return Session.get('show_add_friend_div');
        },

        show_add_friend_btn: function() {
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            var tuple = Assignments.find({_id : _id}).fetch();
            var team_size = tuple[0].data.team_size;

            Session.set('team_size', team_size);

            if (Session.get('team_size') > teammate_lst.length) {
                Session.set('show_add_friend_btn', true);
            } else {
                Session.set('show_add_friend_btn', false);
            }
            console.log(team_size);
            console.log(teammate_lst.length);
            return Session.get('show_add_friend_btn');
        }
    });
    Template.activity.events({
        "submit .quiz": function(e) {
            e.preventDefault();
            var count = 1;

            $('.mcq_option').each(function() {
                if (this.checked == true) {
                    var question_id = parseInt(this.name.substr(8, this.name.length));
                    /* The answer for the current mcq is the count value */

                    //Meteor.call('saveStudentAnswer', Session.get('ModuleId'), Session.get('lectureId'), Session.get('assignmentId'), Session.get('assignmentType'), "MCQ", question_id, count, Session.get('studentId'));
                    count = 1;
                }
                count++;
            });

            $('input[class="saq_text"], textarea').each(function(){  
                var user_answer = $(this).val();
                var question_id = parseInt(this.name.substr(8, this.name.length));

                /* The answer for the text is user_answer value */

                //Meteor.call('saveStudentAnswer', Session.get('ModuleId'), Session.get('lectureId'), Session.get('assignmentId'), Session.get('assignmentType'), "short_answer", question_id, user_answer, Session.get('studentId'));        
            });

            Router.redirect('/Lecture1');
        },


        'click #add_friend_btn': function(e) {
            e.preventDefault();
            Session.set('show_add_friend_div', true);
        },

        'click #finish_add_friend_btn': function(e) {
            e.preventDefault();
            
            $('input[class="matric_no_input"], text').each(function() {  
                var new_matric_no = $(this).val();
                
                /* Check validity of matric no */

                teammate_lst.push({"matric_no" : new_matric_no});
                Session.set('teammates', teammate_lst);
                Session.set('show_add_friend_div', false);

                if (Session.get('team_size') > teammate_lst.length) {
                    Session.set('show_add_friend_btn', true);
                } else {
                    Session.set('show_add_friend_btn', false);
                }
            });
        }
    });



    Template.mcq.helpers({
        get_question_id: function() {
            return question_id++;
        }
    });
    Template.mcq.events({

    });


    Template.saq.helpers({
        get_question_id: function() {
            // work as a counter
            return question_id++;
        },

        question_id: function() {
            return question_id - 1;
        }
    });
    Template.saq.events({

    });


    Template.image.helpers({
        is_empty_url: function(image_url) {
            return image_url == "";
        }
    });
    Template.image.events({

    });


    Template.option.helpers({
        question_id: function() {
            return question_id - 1;
        }
    });
    Template.option.events({

    });


    Template.archive.helpers({
        get_lecture_list: function() {
            return SubmissionList.find({}).fetch();
        }
    });

    Template.archive.events({

    });

    Template.archive_submission.helpers({
        get_group: function () {
            var id = "CS3219_"+Session.get('archive_lecture_id')+"_"+Session.get('archive_activity_id');
            var tuple = GroupList.find({_id: id}).fetch();
                
            return tuple[0].data.group_list;
        }
    });

    Template.archive_submission.events({

    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup
    });
}
