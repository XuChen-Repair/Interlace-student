if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('lecture_schedule', function lecture_schedule_publication() {
  	return LectureSchedule.find();	
  });

  Meteor.publish('assignments', function assignments_publication() {
  	return Assignments.find();
  });

  Meteor.publish('group_list', function group_list_publication() {
  	return GroupList.find();
  });

  Meteor.publish('archive_list', function archive_list_publication() {
  	return ArchiveList.find();
  });
}