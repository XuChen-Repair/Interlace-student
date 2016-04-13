Template.archive.helpers({
        get_lecture_list: function(module_code) {
            result = ArchiveList.find({"module_code": module_code}).fetch();
            
            return result;
        }

        // user_logined: function () {
        //     console.log("Check status: " + Session.get('login_status'));

        //     return Session.get('login_status');
        // }
    });

    Template.archive.events({

    });

    Template.archive_submission.helpers({
        get_group: function () {
            var id = "CS3219_"+Session.get('archive_lecture_id')+"_"+Session.get('archive_activity_id');
            var tuple = StudentAnswer.find({_id: id}).fetch();
                
            return tuple[0].answer_list;
        }
    });

    Template.archive_submission.events({

    });