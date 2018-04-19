var express = require('express');
var router = express.Router();

var rhc = require('./../../ScheditAlgorithm/rhc');

router.get('/', function(req, res, next) {
  var request = `
  {
    "schedule":{
      "prefHours":[
        "7",
        "7"
      ],
      "groups":{
        "mustTake":{
          "courses":[
            {
              "_id":"1331",
              "ident":"1331",
              "major":"CS",
              "majorName":"Computer Science",
              "name":"Intro-Object Orient Prog",
              "instructors":[
                "Simpkins, Christopher L"
              ],
              "sections":[
                {
                  "call_number":88422,
                  "credits":3,
                  "ident":"A02",
                  "instructor":{
                    "lname":"Simpkins",
                    "fname":"Christopher L"
                  },
                  "timeslots":[
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"M",
                      "location":"Klaus 1443"
                    },
                    {
                      "start_time":990,
                      "end_time":1065,
                      "day":"T",
                      "location":"U A Whitaker Biomedical Engr 1103"
                    },
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"W",
                      "location":"Klaus 1443"
                    },
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"F",
                      "location":"Klaus 1443"
                    }
                  ]
                },
                {
                  "call_number":89123,
                  "credits":3,
                  "ident":"A04",
                  "instructor":{
                    "lname":"Simpkins",
                    "fname":"Christopher L"
                  },
                  "timeslots":[
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"M",
                      "location":"Klaus 1443"
                    },
                    {
                      "start_time":1080,
                      "end_time":1155,
                      "day":"T",
                      "location":"Van Leer C340"
                    },
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"W",
                      "location":"Klaus 1443"
                    },
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"F",
                      "location":"Klaus 1443"
                    }
                  ]
                },
                {
                  "call_number":82743,
                  "credits":3,
                  "ident":"B02",
                  "instructor":{
                    "lname":"Simpkins",
                    "fname":"Christopher L"
                  },
                  "timeslots":[
                    {
                      "start_time":545,
                      "end_time":595,
                      "day":"M",
                      "location":"Howey (Physics) L2"
                    },
                    {
                      "start_time":990,
                      "end_time":1065,
                      "day":"T",
                      "location":"Molecular Sciences & Engr 1224"
                    },
                    {
                      "start_time":545,
                      "end_time":595,
                      "day":"W",
                      "location":"Howey (Physics) L2"
                    },
                    {
                      "start_time":545,
                      "end_time":595,
                      "day":"F",
                      "location":"Howey (Physics) L2"
                    }
                  ]
                },
                {
                  "call_number":85826,
                  "credits":3,
                  "ident":"B04",
                  "instructor":{
                    "lname":"Simpkins",
                    "fname":"Christopher L"
                  },
                  "timeslots":[
                    {
                      "start_time":545,
                      "end_time":595,
                      "day":"M",
                      "location":"Howey (Physics) L2"
                    },
                    {
                      "start_time":1080,
                      "end_time":1155,
                      "day":"T",
                      "location":"Architecture (East) 207"
                    },
                    {
                      "start_time":545,
                      "end_time":595,
                      "day":"W",
                      "location":"Howey (Physics) L2"
                    },
                    {
                      "start_time":545,
                      "end_time":595,
                      "day":"F",
                      "location":"Howey (Physics) L2"
                    }
                  ]
                },
                {
                  "call_number":84929,
                  "credits":3,
                  "ident":"C02",
                  "instructor":{
                    "lname":"Simpkins",
                    "fname":"Christopher L"
                  },
                  "timeslots":[
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"M",
                      "location":"Clough Commons 152"
                    },
                    {
                      "start_time":1080,
                      "end_time":1155,
                      "day":"T",
                      "location":"Molecular Sciences & Engr 1224"
                    },
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"W",
                      "location":"Clough Commons 152"
                    },
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"F",
                      "location":"Clough Commons 152"
                    }
                  ]
                },
                {
                  "call_number":85827,
                  "credits":3,
                  "ident":"C04",
                  "instructor":{
                    "lname":"Simpkins",
                    "fname":"Christopher L"
                  },
                  "timeslots":[
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"M",
                      "location":"Clough Commons 152"
                    },
                    {
                      "start_time":990,
                      "end_time":1065,
                      "day":"T",
                      "location":"Bunger-Henry 380"
                    },
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"W",
                      "location":"Clough Commons 152"
                    },
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"F",
                      "location":"Clough Commons 152"
                    }
                  ]
                },
                {
                  "call_number":87418,
                  "credits":3,
                  "ident":"C06",
                  "instructor":{
                    "lname":"Simpkins",
                    "fname":"Christopher L"
                  },
                  "timeslots":[
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"M",
                      "location":"Clough Commons 152"
                    },
                    {
                      "start_time":1080,
                      "end_time":1155,
                      "day":"T",
                      "location":"Coll of Computing 101"
                    },
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"W",
                      "location":"Clough Commons 152"
                    },
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"F",
                      "location":"Clough Commons 152"
                    }
                  ]
                },
                {
                  "call_number":82849,
                  "credits":3,
                  "ident":"GR",
                  "instructor":{
                    "lname":"Simpkins",
                    "fname":"Christopher L"
                  },
                  "timeslots":[
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"M",
                      "location":"Klaus 1443"
                    },
                    {
                      "start_time":990,
                      "end_time":1065,
                      "day":"T",
                      "location":"Love (MRDC II) 183"
                    },
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"W",
                      "location":"Klaus 1443"
                    },
                    {
                      "start_time":610,
                      "end_time":660,
                      "day":"F",
                      "location":"Klaus 1443"
                    }
                  ]
                }
              ]
            }
          ],
          "maxCourses":-1,
          "minCourses":-1,
          "minHours":-1,
          "maxHours":-1,
          "priority":"Must"
        },
        "wantToTake":{
          "courses":[
            {
              "_id":"1600",
              "ident":"1600",
              "major":"EAS",
              "majorName":"Earth and Atmospheric Sciences",
              "name":"Intro-Environmental Sci",
              "instructors":[
                "Glass, Jennifer B",
                "Grantham, Meg Camille",
                "Huey, Lewis Gregory"
              ],
              "sections":[
                {
                  "call_number":81206,
                  "credits":4,
                  "ident":"A",
                  "instructor":{
                    "lname":"Huey",
                    "fname":"Lewis Gregory"
                  },
                  "timeslots":[
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"M",
                      "location":"Clough Commons 144"
                    },
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"W",
                      "location":"Clough Commons 144"
                    },
                    {
                      "start_time":1460,
                      "end_time":790,
                      "day":"F",
                      "location":"Clough Commons 144"
                    }
                  ]
                },
                {
                  "call_number":82838,
                  "credits":0,
                  "ident":"AM1",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":480,
                      "end_time":645,
                      "day":"M",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81211,
                  "credits":0,
                  "ident":"AM3",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":900,
                      "end_time":1065,
                      "day":"M",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81212,
                  "credits":0,
                  "ident":"AM4",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":1080,
                      "end_time":1245,
                      "day":"M",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81215,
                  "credits":0,
                  "ident":"AR1",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":480,
                      "end_time":645,
                      "day":"R",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81217,
                  "credits":0,
                  "ident":"AR2",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":1440,
                      "end_time":885,
                      "day":"R",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81210,
                  "credits":0,
                  "ident":"AR3",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":900,
                      "end_time":1065,
                      "day":"R",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81218,
                  "credits":0,
                  "ident":"AT1",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":480,
                      "end_time":645,
                      "day":"T",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81214,
                  "credits":0,
                  "ident":"AT2",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":1440,
                      "end_time":885,
                      "day":"T",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81213,
                  "credits":0,
                  "ident":"AT3",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":900,
                      "end_time":1065,
                      "day":"T",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81800,
                  "credits":0,
                  "ident":"AT4",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":1080,
                      "end_time":1245,
                      "day":"T",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":83925,
                  "credits":0,
                  "ident":"AW3",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":900,
                      "end_time":1065,
                      "day":"W",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":81812,
                  "credits":0,
                  "ident":"AW4",
                  "instructor":{
                    "lname":"Grantham",
                    "fname":"Meg Camille"
                  },
                  "timeslots":[
                    {
                      "start_time":1080,
                      "end_time":1245,
                      "day":"W",
                      "location":"Clough Commons 335"
                    }
                  ]
                },
                {
                  "call_number":87369,
                  "credits":4,
                  "ident":"EAS",
                  "instructor":{
                    "lname":"Glass",
                    "fname":"Jennifer B"
                  },
                  "timeslots":[
                    {
                      "start_time":810,
                      "end_time":885,
                      "day":"T",
                      "location":"West Village Dining Commons 275"
                    },
                    {
                      "start_time":1080,
                      "end_time":1245,
                      "day":"R",
                      "location":"Clough Commons 335"
                    },
                    {
                      "start_time":810,
                      "end_time":885,
                      "day":"R",
                      "location":"West Village Dining Commons 275"
                    }
                  ]
                },
                {
                  "call_number":88478,
                  "credits":4,
                  "ident":"HP",
                  "instructor":{
                    "lname":"Glass",
                    "fname":"Jennifer B"
                  },
                  "timeslots":[
                    {
                      "start_time":810,
                      "end_time":885,
                      "day":"T",
                      "location":"West Village Dining Commons 275"
                    },
                    {
                      "start_time":1080,
                      "end_time":1245,
                      "day":"R",
                      "location":"Clough Commons 335"
                    },
                    {
                      "start_time":810,
                      "end_time":885,
                      "day":"R",
                      "location":"West Village Dining Commons 275"
                    }
                  ]
                }
              ]
            }
          ],
          "maxCourses":-1,
          "minCourses":-1,
          "minHours":-1,
          "maxHours":-1,
          "priority":"Med"
        }
      }
    },
    "cal":{
      "8:00am":{
        "0":"Low",
        "1":"Low",
        "2":"Low",
        "3":"Low",
        "4":"Low"
      },
      "9:00am":{
        "0":"Med",
        "1":"Med",
        "2":"Med",
        "3":"Med",
        "4":"Med"
      },
      "10:00am":{
        "0":"Med",
        "1":"Med",
        "2":"Med",
        "3":"Med",
        "4":"Med"
      },
      "11:00am":{
        "0":"Med",
        "1":"Med",
        "2":"Med",
        "3":"Med",
        "4":"Med"
      },
      "12:00pm":{
        "0":"Med",
        "1":"Med",
        "2":"Med",
        "3":"Med",
        "4":"Med"
      },
      "1:00pm":{
        "0":"Med",
        "1":"Med",
        "2":"Med",
        "3":"Med",
        "4":"Med"
      },
      "2:00pm":{
        "0":"Med",
        "1":"Med",
        "2":"Med",
        "3":"Med",
        "4":"Med"
      },
      "3:00pm":{
        "0":"Med",
        "1":"Med",
        "2":"Med",
        "3":"Med",
        "4":"Med"
      },
      "4:00pm":{
        "0":"Med",
        "1":"Med",
        "2":"Med",
        "3":"Med",
        "4":"Med"
      },
      "5:00pm":{
        "0":"Low",
        "1":"Low",
        "2":"Low",
        "3":"Low",
        "4":"Low"
      },
      "6:00pm":{
        "0":"Never",
        "1":"Never",
        "2":"Never",
        "3":"Never",
        "4":"Never"
      },
      "7:00pm":{
        "0":"Never",
        "1":"Never",
        "2":"Never",
        "3":"Never",
        "4":"Never"
      },
      "8:00pm":{
        "0":"Never",
        "1":"Never",
        "2":"Never",
        "3":"Never",
        "4":"Never"
      },
      "9:00pm":{
        "0":"Never",
        "1":"Never",
        "2":"Never",
        "3":"Never",
        "4":"Never"
      }
    }
  }
  `;
  res.send(rhc(JSON.parse(request)));
  // res.send(rhc(require('./schedprefs.json')));
});

module.exports = router;