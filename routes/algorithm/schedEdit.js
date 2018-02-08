var util = require('./util');
/*
 Returns a random course from one of the groups in groups object
 if groupName is passed in, it will return a random class from that specific group
 */
function getRandCourse(groups, groupName, sched) {

  if (groupName) {
    i = groupName;

  } else {
    var groupNames = Object.keys(groups);
    var i = groupNames[util.rand(groupNames.length)];
  }
  if (!candidateCourses[i]) {
    var keys = [];
    sched.forEach(function (course) {
      keys.push(course.major + course.ident);
    });
    candidateCourses[i] = groups[i].courses.filter(function (course) {
      var key = course.major + course.ident;
      return keys.indexOf(key) == -1;
    });
  }
  var course = candidateCourses[i][util.rand(candidateCourses[i].length)];
  return {
    course: course,
    groupName: i
  };
}

function placeCourseInSchedule(course, sched, groupName) {
  var sectionsTried = [];
  var fit = false;
  var len = course.sections.length > 5 ? Math.floor(course.sections.length / 2) :
      course.sections.length;
  var i;
  while (sectionsTried.length < len && !fit) {
    i = util.rand(course.sections.length, sectionsTried);
    sectionsTried.push(i);
    var conflict = false;
    course.sections[i].timeslots.forEach(function (timeslot) {
      sched.forEach(function (course) {
        course.section.timeslots.forEach(function (existingTimeslot) {
          if (util.overlap1D(existingTimeslot.start_time, existingTimeslot.end_time,
                  timeslot.start_time, timeslot.end_time)) {
            conflict = true;
          }
        });
      })
    });
    fit = !conflict && course.sections[i].timeslots.length > 0;
  }
  if (fit) {
    sched.push({
      name: course.name,
      professors: course.professors,
      priority: course.priority,
      ident: course.ident,
      section: course.sections[i],
      groupName: groupName,
      major: course.major,
      majorName: course.majorName
    });
    return true;
  }
  return false;
}

//ammortize for speed purposes, should be ceared everytime addRandCourse is called.
var candidateCourses = {};
/*
 Adds a random course to the passed in schedule based on the schedulePrefs.
 If groupName is defined, it will pick a random course from that group
 */
function addRandCourse(schedulePrefs, sched, groupName) {
  var added = false;
  candidateCourses = {};
  var i = 0;
  while (!added && i < 15) {
    i++;
    added = true;
    var course = getRandCourse(schedulePrefs.groups, groupName, sched);
    if (course && course.course) {
      added = placeCourseInSchedule(course.course, sched, course.groupName);
    }
  }
  return sched;
}
/*
 removes a random course, if groupName is passed in, it will remove
 a group from that groupname
 */
function removeRandCourse(schedulePrefs, sched, groupName) {
  if (groupName) {
    var coursesInGroup = [];
    sched.forEach(function (course, i) {
      if (course.groupName === groupName) {
        coursesInGroup.push(i);
      }
    });
    // sets index to negative -1 if there were no courses in groupName
    index = coursesInGroup.length ? coursesInGroup[util.rand(coursesInGroup.length)] : -1;
  } else {
    index = util.rand(sched.length);
  }
  if (index >= 0) {
    sched.splice(index, 1)
  }
  return sched;
}

function changeRandCourse(schedulePrefs, sched) {
  return addRandCourse(
      schedulePrefs,
      removeRandCourse(schedulePrefs, sched)
  );
}

function getRandNeighbors(schedulePrefs, sched, numNeigbors) {
  var scheds = [sched];
  var neighbors = numNeigbors || 5;
  for (var i = 0; i < neighbors - 1; i++) {
    var index = util.rand(funcs.length)
    // pick a random mutate function and apply it to the schedule
    scheds.push(
        edits[funcs[index]](schedulePrefs, sched.slice())
    );
  }
  return scheds;
}
var edits = {
  addRandCourse: addRandCourse,
  removeRandCourse: removeRandCourse,
  changeRandCourse: changeRandCourse
};
var funcs = Object.keys(edits);
// placed after object.keys so that it isnt included in funcs
edits.getRandNeighbors = getRandNeighbors;
module.exports = edits;