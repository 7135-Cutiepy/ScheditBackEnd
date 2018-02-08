var prefs = {
	'Low':1,
	'Med':2,
	'High':3,
	'Must':5,
	'Never':-15
};
var dayToNum = {
	'M':0,
	'T':1,
	'W':2,
	'R':3,
	'F':4,
};
var averageCreditHourAssumption = 3;
function evaluateCourses(schedPrefs, sched, evaluation){
	sched.forEach(function(course){
		evaluation.score += prefs[course.priority]*
			prefs[schedPrefs.groups[course.groupName].priority];
		evaluation.totalHrs += course.section.credits;
		evaluation.groupHrs[course.groupName] += course.section.credits;
		evaluation.groupCourses[course.groupName] += 1;
	});	
}
function evaluateMinMaxGroups(schedPrefs, sched,evaluation){
	Object.keys(schedPrefs.groups).forEach(function(groupName){
		var realHrs = evaluation.groupHrs[groupName];
		var realCourses = evaluation.groupCourses[groupName];
		var minHrs = schedPrefs.groups[groupName].minHrs;
		var maxHrs = schedPrefs.groups[groupName].maxHrs;
		var minCourses = schedPrefs.groups[groupName].minCourses;
		var maxCourses = schedPrefs.groups[groupName].maxCourses;
		if((realHrs < minHrs && minHrs >=0) || (realCourses < minCourses && minCourses >=0)){
			var needToAdd = Math.max(
				minCourses >=0 ? minCourses - realCourses : 0,
				minHrs >= 0 ? Math.ceil((minHrs - realHrs) / averageCreditHourAssumption) : 0 
			);
			for(var i = 0; i < needToAdd; i++){
				evaluation.addRandCourse.push(groupName);
			}
		}
		if((realHrs > maxHrs && maxHrs >=0)||(realCourses > maxCourses && maxCourses >= 0)){
			var needToRemove = Math.max(
				maxCourses >=0 ? maxCourses - realCourses: 0,
				maxHrs >=0 ? Math.ceil((realHrs - maxHrs)/averageCreditHourAssumption) : 0
			);
			for(var i = 0; i < needToRemove; i++){
				evaluation.removeRandCourse.push(groupName);
			}
		}
	});
}
function evaluateMinMax(schedPrefs, sched, evaluation){
	evaluateMinMaxGroups(schedPrefs,sched,evaluation);
	var minHrs = schedPrefs.prefHours[0];
	var maxHrs = schedPrefs.prefHours[1];
	// estimate the amount of hours after removing and adding group hours
	var coursesAdded = evaluation.addRandCourse.length - evaluation.removeRandCourse.length;
	var estimatedHrs = evaluation.totalHrs + coursesAdded * averageCreditHourAssumption;
	if(estimatedHrs < minHrs){
		for(var i = estimatedHrs; i < minHrs; i+=averageCreditHourAssumption){
			evaluation.addRandCourse.push('');
		}
	}
	if(estimatedHrs > maxHrs){
		for(var i = maxHrs; i < estimatedHrs; i+=averageCreditHourAssumption){
			evaluation.removeRandCourse.push('');
		}
	}
}
function evaluateTimes(cal,sched,evaluation){
	sched.forEach(function(course){
		course.section.timeslots.forEach(function(timeslot){
			var day = dayToNum[timeslot.day];
			var startTime = Math.floor(timeslot.start_time/60);
			var endTime = Math.ceil(timeslot.end_time/60);
			endTime = endTime > 12 ? endTime: endTime;
			for(var i = startTime; i < endTime; i++){
				var time;
				if(i < 12){
					time = i + 'am';
				} else if(i > 12){
					time = (i-12) + 'pm';
				}else {
					time = '12pm';
				}
				evaluation.score += prefs[cal[time][day]];
			}

		});
	});
}
module.exports = function evaluate(schedPrefs, cal, sched){
	/*
		Need to address:
			class-group priority
			total credit horus/classes
			min/max from groups
			calendar times
	*/
	var evaluation = {
		score:0,
		addRandCourse:[],
		removeRandCourse:[],
		totalHrs:0,
		groupHrs:{},
		groupCourses:{}	
	};
	Object.keys(schedPrefs.groups).forEach(function(groupName){
		evaluation.groupHrs[groupName] = 0;
		evaluation.groupCourses[groupName] = 0;
	});
	evaluateCourses(schedPrefs, sched,evaluation);
	evaluateMinMax(schedPrefs, sched, evaluation);
	evaluateTimes(cal,sched, evaluation);
	return evaluation;
};