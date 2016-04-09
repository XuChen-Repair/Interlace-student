Template.archive.helpers({
        get_lecture_list: function() {
            result = ArchiveList.find({}).fetch();
            console.log("sub:");
            console.log(result.length);
            return result;
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