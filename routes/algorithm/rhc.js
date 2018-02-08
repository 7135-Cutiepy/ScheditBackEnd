var schedEdit = require('./schedEdit');
var evaluate = require('./evaluateSched');
// the amount of times this will attempt to improve a schedule
// higher = more time but better schedule
var schedIterations = 15000;
// amount of times this will attempt to fix a schedule
//before giving up on it.
var fixAtempts = 200;
//the number of schedules to generate
var numScheds = 10;

function applyEvaluationChanges(schedPrefs, sched, evaluation) {
  //TODO take into account the best of the dupes to keep.
  evaluation.removeRandCourse.forEach(function (groupName) {
    sched = schedEdit.removeRandCourse(schedPrefs, sched, groupName);
  });
  evaluation.addRandCourse.forEach(function (groupName) {
    sched = schedEdit.addRandCourse(schedPrefs, sched, groupName);
  });
  return sched;
}

function removeDupes(oSched) {
  var sched = [];
  var seen = [];
  oSched.forEach(function (c) {
    var key = c.major + c.name;
    if (seen.indexOf(key) === -1) {
      sched.push(c);
    }
    seen.push(key);
  });
  return sched;
}

function fixSched(schedPrefs, cal, sched) {
  var evaluation = evaluate(schedPrefs, cal, sched);
  var changes = evaluation.addRandCourse.length + evaluation.removeRandCourse.length;
  var i = 0;
  while (changes > 0 && i < fixAtempts) {
    sched = applyEvaluationChanges(schedPrefs, sched, evaluation);
    sched = removeDupes(sched);
    evaluation = evaluate(schedPrefs, cal, sched);
    changes = evaluation.addRandCourse.length + evaluation.removeRandCourse.length;
    i++;
  }
  if (changes > 0) {
    evaluation.score -= 10000;
  }
  return {
    sched: sched,
    evaluation: evaluation
  };
}

function schedClimber(schedPrefs, cal, iterations, onSched) {
  var topSched = fixSched(schedPrefs, cal, []);
  for (var i = 0; i < iterations; i++) {
    if (i % 10 === 0) {
      console.log('on schedule: ' + onSched + ' and iteration: ' + i)
    }
    var scheds = schedEdit.getRandNeighbors(
        schedPrefs,
        topSched.sched
    );
    var fixedScheds = [];
    scheds.forEach(function (s) {
      fixedScheds.push(fixSched(schedPrefs, cal, s));
    });
    fixedScheds.forEach(function (s) {
      if (topSched.evaluation.score < s.evaluation.score) {
        topSched = s;
      }
    });
  }
  return topSched;
}
module.exports = function (preferences) {
  var scheds = [];
  for (var i = 0; i < numScheds; i++) {
    console.log('finding schedule: ' + i)
    try {
      scheds.push(schedClimber(preferences.schedule, preferences.cal, schedIterations, i));
      console.log('sched score: ' + scheds[scheds.length - 1].evaluation.score);
    } catch (a) {
      console.log(a);
      console.log('failure experienced at ' + i);
      i--;
    }
  }
  scheds.sort(function (a, b) {
    return b.evaluation.score - a.evaluation.score
  });
  console.log('done');
  console.log(scheds);
  return scheds;
}