if (Meteor.isServer) {
  	// This code only runs on the server
  	// Only publish tasks that are public or belong to the current user
  	Meteor.publish('lecture_schedule', function () {
  		return LectureSchedule.find();	
  	});

  	Meteor.publish('activities', function () {
  		return Activities.find();
  	});

  	Meteor.publish('user_info', function () {
  		return UserInfo.find();
  	});

  	Meteor.publish('archive_list', function () {
  		return ArchiveList.find();
  	});

  	Meteor.publish('student_answer', function () {
  		return StudentAnswer.find();
  	});


	Images.allow({
  		'insert': function () {
    		// add custom authentication code here
    		return true;
  		}
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
			},


			save_user: function(user_id, matric_no, student_name) {
				console.log("save_user: " + user_id);
				console.log("save_user: " + matric_no);
				console.log("save_user: " + student_name);
				UserInfo.insert({user_id: user_id, matric_no: matric_no, student_name: student_name});
			},

			// get_student_name: function(user_id) {
			// 	var tuple = Users.find({user_id: user_id}).fetch();
			// 	if (tuple.length == 0) {
			// 		return "dear user";
			// 	}
			// 	return tuple[0].student_name;
			// },

			// get_matric_no: function(user_id) {
			// 	console.log("get user_id: " + user_id);
			// 	var tuple = Users.find({user_id: user_id}).fetch();
			// 	if (tuple.length == 0) {
			// 		return "xc";
			// 	}
			// 	console.log("get matric_no: " + tuple[0].matric_no);
			// 	return tuple[0].matric_no;
			// }

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