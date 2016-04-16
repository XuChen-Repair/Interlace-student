var teammate_lst = [];

Template.activity_page.onRendered(function(){
    teammate_lst = [];
    SessionAmplify.setDefault('teammates', []);
    SessionAmplify.setDefault('image_list', []);
    console.log("get in activity_page onrendered.");
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
      
            if (list.length > 0 ) {
                var result = list[0];

                SessionAmplify.set('module_code', result["module_code"]);
                SessionAmplify.set('lecture_id', result["lecture_id"]);
            } else {
                return false;
            }
            return true;
        },

        get_current_module: function() {
            return SessionAmplify.get('module_code');
        },

        get_lecture_id: function() {
            return SessionAmplify.get('lecture_id');
        }
    });

    Template.activity_page.events({

    });


    Template.activity_list.helpers({
        get_activity_list: function() {
            var module_code = SessionAmplify.get('module_code');
            var lecture_id = SessionAmplify.get('lecture_id');

            var activity_list = Activities.find({
                $and: [
                    {"module_code" : module_code},
                    {"lecture_id" : lecture_id}
                ]
            }).fetch();
            
            // console.log(activity_list);
            return activity_list;
        },

        get_team_size: function(team_size) {
            if (team_size == "1") {
                return "Individual Work";
            } else {
                return "Group Work";
            }
        },

        get_activity_type: function(activity_type) {
            if (activity_type == "simple_quiz") {
                return "Simple Quiz";
            } else if (activity_type == "design_thinking_problem") {
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
            var _id = SessionAmplify.get('module_code') + "_" + SessionAmplify.get('lecture_id') + "_" + SessionAmplify.get('activity_id');
            var tuple = Activities.find({_id: _id}).fetch();

            return tuple[0].activity_type == "simple_quiz";
        },

        is_design_thinking_problem: function() {
            var _id = SessionAmplify.get('module_code') + "_" + SessionAmplify.get('lecture_id') + "_" + SessionAmplify.get('activity_id');
            var tuple = Activities.find({_id: _id}).fetch();

            return tuple[0].activity_type == "design_thinking_problem";
        }
    });
    Template.activity.events({
        
    });


    Template.group_creation.helpers({
        teammate: function() {
            if (teammate_lst.length == 0) {
                teammate_lst.push({"matric_no" : SessionAmplify.get('student_name')});
                SessionAmplify.set('teammates', teammate_lst);
            }
            return SessionAmplify.get('teammates');
        },

        show_add_friend_div: function() {
            return SessionAmplify.get('show_add_friend_div');
        },

        show_add_friend_btn: function() {
            var _id = SessionAmplify.get('module_code') + "_" + SessionAmplify.get('lecture_id') + "_" + SessionAmplify.get('activity_id');
            var tuple = Activities.find({_id : _id}).fetch();
            var team_size = tuple[0].team_size;

            SessionAmplify.set('team_size', team_size);

            if (SessionAmplify.get('team_size') > teammate_lst.length) {
                SessionAmplify.set('show_add_friend_btn', true);
            } else {
                SessionAmplify.set('show_add_friend_btn', false);
            }
    
            return SessionAmplify.get('show_add_friend_btn');
        }
    });
    
    function index_of(teammates, remove_friend) {
        for(var i=0; i < teammates.length; i++) {
            if (remove_friend == teammates[i].matric_no) {
                return i;
            }
        }
        return -1;
    }

    Template.group_creation.events({
        'click .remove_friend': function(e) {
            e.preventDefault();
            var remove_friend = this.matric_no;
            
            var teammates = SessionAmplify.get('teammates');
            if (teammates.length > 1) {
                var idx = index_of(teammates, remove_friend);
                console.log(teammates);
                console.log(idx);
                teammates.splice(idx, idx+1);
                SessionAmplify.set('teammates', teammates);
            }

        },

        'click #add_friend_btn': function(e) {
            e.preventDefault();
            // $('.fullscreen.modal').modal('show');
            SessionAmplify.set('show_add_friend_div', true);
        },

        'click #finish_add_friend_btn': function(e) {
            e.preventDefault();
            
            $('input[class="matric_no_input"], text').each(function() {  
                var new_matric_no = $(this).val();
                
                /* Check validity of matric no */

                teammate_lst.push({"matric_no" : new_matric_no});
                SessionAmplify.set('teammates', teammate_lst);
                SessionAmplify.set('show_add_friend_div', false);

                if (SessionAmplify.get('team_size') > teammate_lst.length) {
                    SessionAmplify.set('show_add_friend_btn', true);
                } else {
                    SessionAmplify.set('show_add_friend_btn', false);
                }
            });
        }
    });

    Template.simple_quiz.helpers({
        get_student_matric: function() {
            return SessionAmplify.get('matric_no');
        },

        get_activity_name: function() {
            var str = "Activity ";
            return str + (SessionAmplify.get('activity_id'));
        },

        get_question: function() {
            var _id = SessionAmplify.get('module_code') + "_" + SessionAmplify.get('lecture_id') + "_" + SessionAmplify.get('activity_id');
            //console.log("_id: " + _id);

            var tuple = Activities.find({_id: _id}).fetch();
            var question_list = tuple[0].question_list;

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
        "submit .simple_quiz_form": function(e) {
            e.preventDefault();
            var count = 1;
            var student_answer = [];

            $('.mcq_option').each(function() {
                if (this.checked == true) {
                    var question_id = parseInt(this.name.substr(8, this.name.length));
                    /* The answer for the current mcq is the count value */
                    
                    student_answer.push({"question_id" : question_id, "question_type" : "mcq", "answer" : count});
                    count = 1;
                }
                count++;
            });

            $('input[class="saq_text"], textarea').each(function(){  
                var user_answer = $(this).val();
                var question_id = parseInt(this.name.substr(8, this.name.length));

                console.log(question_id);
                console.log(user_answer);

                /* The answer for the text is user_answer value */
                student_answer.push({"question_id" : question_id, "question_type" : "saq", "answer" : user_answer});
                
            });


            Meteor.call('save_student_answer', SessionAmplify.get('module_code'), SessionAmplify.get('lecture_id'), SessionAmplify.get('activity_id'), "simple_quiz", SessionAmplify.get('teammates'), student_answer, SessionAmplify.get('matric_no'));
            teammate_lst = [];
            SessionAmplify.setDefault('teammates', []);
            SessionAmplify.setDefault('image_list', []);
            Router.go('/activity_page');
        }
    });



    Template.mcq.helpers({
        
    });
    Template.mcq.events({

    });


    Template.saq.helpers({
        
    });
    Template.saq.events({
        'change .saq_img_upload': function(event, template) {
            FS.Utility.eachFile(event, function(file) {
                Images.insert(file, function (err, fileObj) {
                    if (err){
                        // handle error
                        console.log(err);
                    } else {
                        // handle success depending what you need to do
                    
                        var imagesURL = {
                            "profile.image": "/cfs/files/images/" + fileObj._id
                        };
                        
                    }
                });
            });
        }

    });


    Template.image.helpers({
        is_valid_url: function(image_url) {
            if (image_url.length == 0) {
                return false;
            }
            return true;
        }
    });
    Template.image.events({

    });


    Template.option.helpers({
    });
    Template.option.events({

    });


    Template.design_thinking_problem.helpers({
        get_bg_description_list: function() {
            var _id = SessionAmplify.get('module_code') + "_" + SessionAmplify.get('lecture_id') + "_" + SessionAmplify.get('activity_id');
            var tuple = Activities.find({_id : _id}).fetch();
            
            return tuple[0].description_list;
        },
        get_question_list: function() {
            var _id = SessionAmplify.get('module_code') + "_" + SessionAmplify.get('lecture_id') + "_" + SessionAmplify.get('activity_id');
            var tuple = Activities.find({_id : _id}).fetch();
            
            return tuple[0].question_list;
        },

        is_not_empty: function(content) {
            if (content == "") {
                return false;
            }
            return true;
        },

        is_description_question: function(question_type) {
            return question_type=="description_question";
        },
        is_short_answer_question: function(question_type) {
            return question_type=="short_answer_question";
        },
        is_fill_in_the_blanks: function(question_type) {
            return question_type=="fill_in_the_blanks";
        },
        is_free_sketching: function(question_type) {
            return question_type=="free_sketching";
        }
    });

    Template.design_thinking_problem.events({
        "submit .design_thinking_form": function(e) {
            e.preventDefault();
            var student_answer = [];

            $('input[class="saq_text"], textarea').each(function(){  
                var user_answer = $(this).val();
                var question_id = parseInt(this.name.substr(8, this.name.length));
                var class_attr = $(this).attr('class');
                var question_type;

                if (class_attr == "dq_text") {
                    question_type = "description_question";
                } else if (class_attr == "saq_text") {
                    question_type = "short_answer_question";
                } else {

                }

                student_answer.push({"question_id" : question_id, "question_type" : question_type, "answer" : user_answer});
            });
        
            Meteor.call('save_student_answer', SessionAmplify.get('module_code'), SessionAmplify.get('lecture_id'), SessionAmplify.get('activity_id'), "design_thinking_problem", SessionAmplify.get('teammates'), student_answer, SessionAmplify.get('matric_no'));
            teammate_lst = [];
            SessionAmplify.setDefault('teammates', []);
            SessionAmplify.setDefault('image_list', []);
            Router.go('/activity_page');
        }
    });