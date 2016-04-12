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

            var activity_list = Activities.find({
                $and: [
                    {"module_code" : "CS3219"},
                    {"lecture_id" : "1"}
                ]
            }).fetch();
            

            console.log(activity_list);
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
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            //console.log("_id: " + _id);

            var tuple = Activities.find({_id: _id}).fetch();

            return tuple[0].activity_type == "simple_quiz";
        },

        is_design_thinking_problem: function() {
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            //console.log("_id: " + _id);

            var tuple = Activities.find({_id: _id}).fetch();

            return tuple[0].activity_type == "design_thinking_problem";
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
            var tuple = Activities.find({_id : _id}).fetch();
            var team_size = tuple[0].team_size;

            Session.set('team_size', team_size);

            if (Session.get('team_size') > teammate_lst.length) {
                Session.set('show_add_friend_btn', true);
            } else {
                Session.set('show_add_friend_btn', false);
            }
            // console.log(team_size);
            // console.log(teammate_lst.length);
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

        get_question: function() {
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
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
        "submit .quiz": function(e) {
            e.preventDefault();
            var count = 1;
            var student_answer = [];

            $('.mcq_option').each(function() {
                if (this.checked == true) {
                    var question_id = parseInt(this.name.substr(8, this.name.length));
                    /* The answer for the current mcq is the count value */
                    
                    // Meteor.call('save_student_answer', Session.get('module_code'), Session.get('lecture_id'), Session.get('activity_id'), Session.get('teammates'), question_id, "MCQ", count, Session.get('matric_no'));
                    student_answer.push({"question_id" : question_id, "question_type" : "mcq", "answer" : count});
                    count = 1;
                }
                count++;
            });

            $('input[class="saq_text"], textarea').each(function(){  
                var user_answer = $(this).val();
                var question_id = parseInt(this.name.substr(8, this.name.length));



                /* The answer for the text is user_answer value */
                student_answer.push({"question_id" : question_id, "question_type" : "saq", "answer" : user_answer});
                // Meteor.call('save_student_answer', Session.get('module_code'), Session.get('lecture_id'), Session.get('activity_id'), Session.get('teammates'), question_id, "short_answer", user_answer, Session.get('matric_no'));
                
            });
            Meteor.call('save_student_answer', Session.get('module_code'), Session.get('lecture_id'), Session.get('activity_id'), Session.get('teammates'), student_answer, Session.get('matric_no'));
            //Router.redirect('/Lecture1');
        }
    });



    Template.mcq.helpers({
        // get_question_id: function() {
        //     return question_id++;
        // }
    });
    Template.mcq.events({

    });


    Template.saq.helpers({
        // get_question_id: function() {
        //     // work as a counter
        //     return question_id++;
        // },

        // question_id: function() {
        //     return question_id - 1;
        // }
    });
    Template.saq.events({
        // 'change .saq_img_upload': function(event, template) {
        //     FS.Utility.eachFile(event, function(file) {
        //         console.log("ready to upload");
        //         Images.insert(file, function (err, fileObj) {
        //             if (err){
        //                 // handle error
        //                 console.log("image upload error.");
        //             } else {
        //                 // handle success depending what you need to do
        //                 var userId = Meteor.userId();
        //                 var imagesURL = {
        //                     "profile.image": "/cfs/files/images/" + fileObj._id
        //                 };
        //                 Meteor.users.update(userId, {$set: imagesURL});
        //                 console.log("image upload successfully.");
        //              }
        //         });
        //     });
        // }
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
            // console.log("dtp: ");
            // console.log(tuple);
            // console.log(question);
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            var tuple = Activities.find({_id : _id}).fetch();
            var question = tuple[0].question_list[0];
            return question.description;
        },
        get_question_list: function() {
            var _id = Session.get('module_code') + "_" + Session.get('lecture_id') + "_" + Session.get('activity_id');
            var tuple = Activities.find({_id : _id}).fetch();
            var question = tuple[0].question_list[0];
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