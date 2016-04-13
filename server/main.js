if (Meteor.isServer) {
  	// This code only runs on the server
  	// Only publish tasks that are public or belong to the current user
  	Meteor.publish('lecture_schedule', function () {
  		return LectureSchedule.find();	
  	});

  	Meteor.publish('activities', function () {
  		return Activities.find();
  	});

  	Meteor.publish('group_list', function () {
  		return GroupList.find();
  	});

  	Meteor.publish('archive_list', function () {
  		return ArchiveList.find();
  	});

  	Meteor.publish('student_answer', function () {
  		return StudentAnswer.find();
  	});

  	var imageStore = new FS.Store.GridFS("images");

	Images = new FS.Collection("images", {
		stores: [imageStore],
		allow: {
    		contentTypes: ['image/*'],
    		extensions: ['png', 'PNG', 'jpg', 'JPG']
		}
	});

	Images.allow({
		insert: function(userId, doc) { return true; },
		update: function(userId,doc) { return true; },
		remove: function(userId,doc) { return false; },
		download: function(userId, doc) {return true;},
	});

  	Meteor.publish("images", function () { return Images.find(); });


  	Meteor.startup(function () {
		Meteor.methods({
            // Meteor.call('save_student_answer', Session.get('module_code'), Session.get('lecture_id'), Session.get('activity_id'), Session.get('teammates'), student_answer, Session.get('matric_no'));
	  		save_student_answer: function (module_code, lecture_id, activity_id, activity_type, teammates, student_answer, student_id) {
				// console.log("submit module_code: " + module_code);
				// console.log("submit lecture_id: " + lecture_id);
				// console.log("submit activity_id: " + activity_id);
				
				// for(i=0; i<teammates.length; i++) {
				// 	console.log("submit teammates: " + teammates[i]["matric_no"]);
				// }
				// console.log("submit student_answer: " + student_answer);
				// console.log("submit student_id: " + student_id);

				var _id = module_code + "_" + lecture_id + "_" + activity_id;
				console.log("_id"+ _id);
				// StudentAnswer.insert({"_id" : "CS3219_1_2","module_code": "CS3219","lecture_id": "1","activity_id": "2","answer_list": [{"teammates": ["xc", "tzj"],"answer": [{"question_id":"1", "question_type":"mcq", "answer":"2"},{"question_id":"2", "question_type":"saq", "answer":"donnot"}]}]});
				temp = StudentAnswer.find({"_id": _id}).fetch()
				if (temp.length == 0) {
					StudentAnswer.insert({"_id": _id, "module_code": module_code, "lecture_id": lecture_id, "activity_id": activity_id, activity_type, "answer_list": [{"teammates":teammates, "answer": student_answer}] });
				} else {
					StudentAnswer.update({"_id": _id}, {$push:{"answer_list": { "teammates":teammates, "answer": student_answer  } }});
				}
				

				// Add tuple into archive_list for later display purpose
				var _id_archive_list = module_code + "_" + lecture_id;
				temp = ArchiveList.find({"_id": _id_archive_list}).fetch();
				if (temp.length == 0) {
					ArchiveList.insert({ "_id": _id_archive_list, "module_code": module_code, "lecture_id": lecture_id, "activity_list": [activity_id] });
					console.log("archive empty");
				} else {
					console.log(temp[0].activity_list);
					if (get_index(temp[0].activity_list, activity_id) == -1) {
						ArchiveList.update({"_id": _id_archive_list}, {$push:{"activity_list": activity_id } } );
					}
				}


			}
 		});
  	});

	function get_index(arr, val) {
		console.log("here");
		for (var i=0; i<arr.length; i++) {
			if (arr[i] == val) {
				console.log("compare:" +arr[i] + "-"+val);
				return i;
			}
		}
		return -1;
	}
}