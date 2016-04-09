var question_id = 1;
var teammate_lst = [];

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

        get_team_size: function(data) {
            if (data.team_size == "1") {
                return "Individual Work";
            } else {
                return "Group Work";
            }
            //return data.type;
        },

        get_activity_type: function(data) {
            if (data.activity_type == "simple_quiz") {
                return "Simple Quiz";
            } else if (data.activity_type == "design_thinking_problem") {
                return "Design Thinking Problem";
            } else {
                return "None";
            }
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
        is_simple_quiz: function() {
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            //console.log("_id: " + _id);

            var tuple = Assignments.find({_id: _id}).fetch();
            var data = tuple[0].data;

            return data.activity_type == "simple_quiz";
        },

        is_design_thinking_problem: function() {
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            //console.log("_id: " + _id);

            var tuple = Assignments.find({_id: _id}).fetch();
            var data = tuple[0].data;

            return data.activity_type == "design_thinking_problem";
        }
    });
    Template.activity.events({
        
    });


    Template.group_creation.helpers({
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

    Template.group_creation.events({

        'click #add_friend_btn': function(e) {
            e.preventDefault();
            // $('.fullscreen.modal').modal('show');
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

    // Template.activity.onRendered(function(){
    //     this.$('.fullscreen.modal').modal('show');
    // });
    Template.simple_quiz.helpers({
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
        }
    });
    Template.simple_quiz.events({
        "submit .quiz": function(e) {
            e.preventDefault();
            var count = 1;

            $('.mcq_option').each(function() {
                if (this.checked == true) {
                    var question_id = parseInt(this.name.substr(8, this.name.length));
                    /* The answer for the current mcq is the count value */
                    console.log(count);
                    //Meteor.call('saveStudentAnswer', Session.get('ModuleId'), Session.get('lectureId'), Session.get('assignmentId'), Session.get('assignmentType'), "MCQ", question_id, count, Session.get('studentId'));
                    count = 1;
                }
                count++;
            });

            $('input[class="saq_text"], textarea').each(function(){  
                var user_answer = $(this).val();
                var question_id = parseInt(this.name.substr(8, this.name.length));

                /* The answer for the text is user_answer value */
                console.log(user_answer);
                //Meteor.call('saveStudentAnswer', Session.get('ModuleId'), Session.get('lectureId'), Session.get('assignmentId'), Session.get('assignmentType'), "short_answer", question_id, user_answer, Session.get('studentId'));        
            });

            //Router.redirect('/Lecture1');
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


    Template.design_thinking_problem.helpers({
        get_bg_description_list: function() {
            console.log("dtp: ");
            console.log(tuple);
            console.log(question);
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            var tuple = Assignments.find({_id : _id}).fetch();
            var question = tuple[0].data.question_list[0];
            return question.description;
        },
        get_question_list: function() {
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            var tuple = Assignments.find({_id : _id}).fetch();
            var question = tuple[0].data.question_list[0];
            return question.content;
        },

        is_description_question: function(question_type) {
            return question_type=="Description Question";
        },
        is_short_answer_question: function(question_type) {
            return question_type=="Short Answer Question";
        },
        is_fill_in_the_blanks: function(question_type) {
            return question_type=="Fill in the blanks";
        },
        is_free_drawing: function(question_type) {
            return question_type=="Free Drawing";
        }
    });

    Template.design_thinking_problem.events({

    });