Template.archive.helpers({
        get_lecture_list: function(module_code) {
            result = ArchiveList.find({"module_code": module_code}).fetch();
            
            return result;
        }
    });

    Template.archive.events({

    });

    Template.archive_submission.helpers({
        get_group: function () {
            var id = SessionAmplify.get('archive_module_code') + "_"+SessionAmplify.get('archive_lecture_id')+"_"+SessionAmplify.get('archive_activity_id');
            console.log(id);
            var tuple = StudentAnswer.find({_id: id}).fetch();
                
            return tuple[0].answer_list;
        }
    });

    Template.archive_submission.events({

    });