var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

var rhc = require('./../../ScheditAlgorithm/rhc');

router.post('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('schedules');

  var result = rhc(req.body);
  result[0]['email'] = req.body['email'];
  result[0]['name'] = 'schedule';
  result[0]['status'] = 'done';
  collection.insert(result[0]);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'scheditmail@gmail.com',
      pass: 'ramblingwreck3312'
    }
  });
  
  var mailOptions = {
    from: 'scheditmail@gmail.com',
    to: req.body['email'],
    subject: 'Your schedule is ready to view!',
    text: 'Please visit http://localhost:4200 to login and view your completed schedule'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.send({success: "true", msg: "Schedule request submitted!"});
});

router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('schedules');

  collection.findOne({_id: req.params.id}).then((doc) => {
    res.send(doc)
  })
});

router.get('/user/:email', function(req, res, next) {
  var db = req.db;
  var collection = db.get('schedules');

  collection.find({email: req.params.email}).then((docs) => {
    res.send(docs)
  })
});

router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('schedules');

  schedule = `{"sched": [
    {
      "groupName": "any",
      "ident": "3521",
      "major": "AE",
      "majorName": "Aerospace Engineering",
      "name": "Flight Dynamics",
      "priority": "Med",
      "professors": [
        {
          "name": "Any",
          "priority": "Med"
        }
      ],
      "section": {
        "id": "562580d90248b461481330a1",
        "call_number": 20819,
        "credits": 4,
        "ident": "A",
        "instructor": {
          "fname": "Eric Marie J ",
          "lname": "Feron"
        },
        "seat_time": "2016-03-20T17:24:10.353Z",
        "seats": {
          "actual": 62,
          "capacity": 65,
          "remaining": 3
        },
        "timeslots": [
          {
            "id": "569ae16f14583c20002f025a",
            "day": "M",
            "end_time": 595,
            "location": "Guggenheim 442",
            "start_time": 545
          },
          {
            "id": "569ae16f14583c20002f0259",
            "day": "T",
            "end_time": 565,
            "location": "Guggenheim 442",
            "start_time": 485
          },
          {
            "id": "569ae16f14583c20002f0258",
            "day": "R",
            "end_time": 565,
            "location": "Guggenheim 442",
            "start_time": 485
          }
        ]
      }
    },
    {
      "groupName": "any",
      "ident": "3756",
      "major": "APPH",
      "majorName": "Applied Physiology",
      "name": "Physiology Lab",
      "priority": "Med",
      "professors": [
        {
          "name": "Any",
          "priority": "Med"
        }
      ],
      "section": {
        "id": "5625778c0248b4614813286e",
        "call_number": 27773,
        "credits": 1,
        "ident": "B",
        "instructor": {
          "fname": "Edward Michael ",
          "lname": "Balog"
        },
        "seat_time": "2016-03-01T23:10:03.246Z",
        "seats": {
          "actual": 15,
          "capacity": 24,
          "remaining": 9
        },
        "timeslots": [
          {
            "id": "569ae15414583c20002efb04",
            "day": "T",
            "end_time": 1075,
            "location": "Clough Undergraduate Commons 483",
            "start_time": 905
          }
        ]
      }
    },
    {
      "groupName": "any",
      "ident": "1120",
      "major": "AS",
      "majorName": "Air Force Aerospace Studies",
      "name": "Foundations of the Af II",
      "priority": "Med",
      "professors": [
        {
          "name": "Any",
          "priority": "Med"
        }
      ],
      "section": {
        "id": "562577710248b46148132334",
        "call_number": 20519,
        "credits": 1,
        "ident": "A",
        "instructor": {
          "fname": "Michael C ",
          "lname": "Olvera"
        },
        "seat_time": "2016-03-13T18:26:20.921Z",
        "seats": {
          "actual": 22,
          "capacity": 60,
          "remaining": 38
        },
        "timeslots": [
          {
            "id": "569ae13d14583c20002ef24f",
            "day": "T",
            "end_time": 685,
            "location": "O'Keefe 202",
            "start_time": 635
          }
        ]
      }
    },
    {
      "groupName": "any",
      "ident": "4420",
      "major": "AS",
      "majorName": "Air Force Aerospace Studies",
      "name": "Prep for Active Duty",
      "priority": "Med",
      "professors": [
        {
          "name": "Any",
          "priority": "Med"
        }
      ],
      "section": {
        "id": "5625778e0248b461481328d9",
        "call_number": 20526,
        "credits": 3,
        "ident": "A",
        "instructor": {
          "fname": "Lindsey E ",
          "lname": "Myhr"
        },
        "seat_time": "2016-03-20T17:24:10.040Z",
        "seats": {
          "actual": 9,
          "capacity": 40,
          "remaining": 31
        },
        "timeslots": [
          {
            "id": "569ae15214583c20002efa4e",
            "day": "T",
            "end_time": 685,
            "location": "O'Keefe 201",
            "start_time": 605
          },
          {
            "id": "569ae15214583c20002efa4d",
            "day": "R",
            "end_time": 685,
            "location": "O'Keefe 201",
            "start_time": 605
          }
        ]
      }
    },
    {
      "groupName": "any",
      "ident": "2220",
      "major": "AS",
      "majorName": "Air Force Aerospace Studies",
      "name": "Us Air & Space Power II",
      "priority": "Med",
      "professors": [
        {
          "name": "Any",
          "priority": "Med"
        }
      ],
      "section": {
        "id": "5625777c0248b46148132525",
        "call_number": 23316,
        "credits": 1,
        "ident": "B",
        "instructor": {
          "fname": "Michael C ",
          "lname": "Olvera"
        },
        "seat_time": "2016-01-15T00:53:40.680Z",
        "seats": {
          "actual": 3,
          "capacity": 50,
          "remaining": 47
        },
        "timeslots": [
          {
            "id": "569ae14514583c20002ef535",
            "day": "R",
            "end_time": 865,
            "location": "O'Keefe 202",
            "start_time": 815
          }
        ]
      }
    },
    {
      "groupName": "any",
      "ident": "2340",
      "major": "CS",
      "majorName": "Computer Science",
      "name": "Objects and Design",
      "priority": "Med",
      "professors": [
        {
          "name": "Any",
          "priority": "Med"
        }
      ],
      "section": {
        "id": "562580d40248b46148132f4c",
        "call_number": 20764,
        "credits": 3,
        "ident": "A",
        "instructor": {
          "fname": "Robert Lee ",
          "lname": "Waters"
        },
        "seat_time": "2016-03-25T04:34:18.093Z",
        "seats": {
          "actual": 300,
          "capacity": 300,
          "remaining": 0
        },
        "timeslots": [
          {
            "id": "569ae16814583c20002f0118",
            "day": "M",
            "end_time": 835,
            "location": "Clough Undergraduate Commons 152",
            "start_time": 785
          },
          {
            "id": "569ae16814583c20002f0117",
            "day": "W",
            "end_time": 835,
            "location": "Clough Undergraduate Commons 152",
            "start_time": 785
          },
          {
            "id": "569ae16814583c20002f0116",
            "day": "F",
            "end_time": 835,
            "location": "Clough Undergraduate Commons 152",
            "start_time": 785
          }
        ]
      }
    },
    {
      "groupName": "any",
      "ident": "1601",
      "major": "AE",
      "majorName": "Aerospace Engineering",
      "name": "Introduction to Ae",
      "priority": "Med",
      "professors": [
        {
          "name": "Any",
          "priority": "Med"
        }
      ],
      "section": {
        "id": "562577780248b46148132456",
        "call_number": 28763,
        "credits": 1,
        "ident": "B",
        "instructor": {
          "fname": "Amy R ",
          "lname": "Pritchett"
        },
        "seat_time": "2016-03-23T22:51:36.277Z",
        "seats": {
          "actual": 42,
          "capacity": 42,
          "remaining": 0
        },
        "timeslots": [
          {
            "id": "569ae14214583c20002ef3eb",
            "day": "T",
            "end_time": 805,
            "location": "Instr Center 219",
            "start_time": 725
          },
          {
            "id": "569ae14214583c20002ef3ea",
            "day": "R",
            "end_time": 805,
            "location": "Instr Center 219",
            "start_time": 725
          }
        ]
      }
    }
  ]}`;
  var sched = JSON.parse(schedule)
  sched.email = 'fmarzen@gmail.com';
  console.log(sched);
  collection.insert(sched);
  res.send(200)
});

module.exports = router;