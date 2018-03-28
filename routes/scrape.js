var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

router.get('/test', function(req, res, next) {
    var test = `
        Freshmen Only See cc.gatech.edu/regdates
        <br>
        <span class="fieldlabeltext">Associated Term: </span>Fall 2018 
        <br>
        <span class="fieldlabeltext">Registration Dates: </span>Mar 26, 2018 to Aug 24, 2018 
        <br>
        <span class="fieldlabeltext">Levels: </span>Graduate Semester, Undergraduate Semester 
        <br>
        <br>
        Georgia Tech-Atlanta * Campus
        <br>
        Lecture* Schedule Type
        <br>
        10 Instructional Method
        <br>
               1.000 Credits
        <br>
        <span class="fieldlabeltext">Grade Basis: </span>P 
        <br>
        <a href="/pls/bprod/bwckctlg.p_display_courses?term_in=201808&amp;one_subj=CS&amp;sel_crse_strt=1100&amp;sel_crse_end=1100&amp;sel_subj=&amp;sel_levl=&amp;sel_schd=&amp;sel_coll=&amp;sel_divs=&amp;sel_dept=&amp;sel_attr=">View Catalog Entry</a>
        <br>
        <br>
        <table class="datadisplaytable" summary="This table lists the scheduled meeting times and assigned instructors for this class.."><caption class="captiontext">Scheduled Meeting Times</caption>
        <tbody><tr>
        <th class="ddheader" scope="col">Type</th>
        <th class="ddheader" scope="col">Time</th>
        <th class="ddheader" scope="col">Days</th>
        <th class="ddheader" scope="col">Where</th>
        <th class="ddheader" scope="col">Date Range</th>
        <th class="ddheader" scope="col">Schedule Type</th>
        <th class="ddheader" scope="col">Instructors</th>
        </tr>
        <tr>
        <td class="dddefault">Class</td>
        <td class="dddefault">3:00 pm - 3:50 pm</td>
        <td class="dddefault">T</td>
        <td class="dddefault">College of Business 100</td>
        <td class="dddefault">Aug 20, 2018 - Dec 13, 2018</td>
        <td class="dddefault">Lecture*</td>
        <td class="dddefault">Jennifer Nicole  Whitlow (<abbr title="Primary">P</abbr>)<a href="mailto:jwhitlow@cc.gatech.edu" target="Jennifer N. Whitlow"><img src="/wtlgifs/web_email.gif" align="middle" alt="E-mail" class="headerImg" title="E-mail" name="web_email" hspace="0" vspace="0" border="0" height="28" width="28"></a></td>
        </tr>
        </tbody></table>
        <br>
        <br>`;

    var $ = cheerio.load(test);

    var arrOfHtml = [];
    $('body').children().each(function(){
        arrOfHtml.push($(this));
    });

    var rawString = $('body')
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .split('\n');

    var semester = $('.fieldlabeltext:contains("Associated Term:")')[0].nextSibling.nodeValue.trim();
    var credits = 0;
    rawString.forEach((element)=>{
        if (element.match(/credits/i)) {
            credits = +element.match(/([^\s]+)/)[0];
        }
    });
    
    var classObj = {
        semester: semester,
        credits: credits
    };
    console.log(classObj);

    var timeslot_array = [];
    var timeslot_table = $('body>table>tbody>tr:not(:first-child)').each(function() {
        timeslot_array.push($(this).toString());
    });

    var timeslot_array_final = [];
    for (var i = 0; i < timeslot_array.length; i++) {
        timeslot_array[i]=timeslot_array[i].split('\n');
        
        var timeslot_obj = {};
        var times = [];

        var time = $(timeslot_array[i][2]).text().trim().split('-');
        var converted_times = [];
        time.forEach((element)=>{
            var split_time = element.split(':');
            split_time[1] = split_time[1].split(' ');
            var time_obj = {
                hours: +split_time[0],
                minutes: +split_time[1][0],
                am_pm: split_time[1][1]
            };
            converted_times.push((time_obj.hours * 60 + time_obj.minutes) + ((time_obj.am_pm == 'pm') ? 12*60 : 0));
        });
        timeslot_obj.start_time = converted_times[0];
        timeslot_obj.end_time = converted_times[1];
        timeslot_obj.days = $(timeslot_array[i][3]).text().trim();
        timeslot_obj.location = $(timeslot_array[i][4]).text().trim();
        timeslot_obj.instructor = $(timeslot_array[i][7]).text().trim().split(',')[0];
        
        // timeslot_obj.instructors.forEach((element, i)=>{
        //     timeslot_obj.instructors[i] = element.trim();
        // });
        
        timeslot_array_final.push(timeslot_obj);
    }
    


    classObj.timeslots = timeslot_array_final;

    res.send(classObj);
});

router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('majors');
    collection.drop();

    request.get('https://oscar.gatech.edu/pls/bprod/bwckgens.p_proc_term_date?p_calling_proc=bwckschd.p_disp_dyn_sched&p_term=201808', (error, response, body)=>{
        var $ = cheerio.load(body);
        var majors = [];
        $('.dataentrytable option').each(function() {
            majors.push({
                code: $(this).val(),
                name: $(this).text()
            });
        });
        console.log(majors);
        collection.insert(majors);

        var major = {
            code: 'CS',
            name: 'Computer Science'
        };
        // majors.forEach((major)=>{
            request.post('https://oscar.gatech.edu/pls/bprod/bwckschd.p_get_crse_unsec?term_in=201808&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj='+major.code+'&sel_crse=&sel_title=&sel_schd=%25&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_ptrm=%25&sel_instr=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a', (error, response, body)=>{
                $ = cheerio.load(body);
                
                var sections = [];
                
                $('.datadisplaytable .ddtitle a').each(function(i) {
                    sections.push(create_section($(this).html()));
                    // var major_obj = majors.filter((major)=>{
                    //     return major.code == sections[i].major;
                    // })[0];
                    // console.log(sections[i]);
                    // console.log(major_obj.name);
                    // sections[i].majorName = major_obj.name;
                });

                $('.pagebodydiv>.datadisplaytable>tbody>tr>.dddefault').each(function(i) {
                    var additional_info = create_section_2($(this).html());

                    sections[i].semester = additional_info.semester;
                    sections[i].credits = additional_info.credits;
                    sections[i].timeslots = additional_info.timeslots;
                });
                res.send(sections);
            });
        // });
    });
});

router.get('/majors', function(req, res, next) {
    var db = req.db;
    var collection = db.get('majors');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/dbinsert', function(req, res, next) {
    var db = req.db;
    var collection = db.get('schedit');
    collection.insert({name:'Frank'});
    res.send(200);
});

var create_section = function(section_string) {
    var split = section_string.split(' - ');
    var split_2 = split[2].split(' ');

    var name = split[0];
    var crn = split[1];
    var major = split_2[0];
    var ident = split_2[1];
    var section = split[3];

    var class_obj = {
        call_number: crn,
        name: name,
        major: major,
        ident: ident,
        section: section
    };

    return class_obj;
}

var create_section_2 = function(section_string) {

    var $ = cheerio.load(section_string);
    
    var arrOfHtml = [];
    $('body').children().each(function(){
        arrOfHtml.push($(this));
    });

    var rawString = $('body')
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .split('\n');

    var semester = $('.fieldlabeltext:contains("Associated Term:")')[0].nextSibling.nodeValue.trim();
    var credits = 0;
    rawString.forEach((element)=>{
        if (element.match(/credits/i)) {
            credits = +element.match(/([^\s]+)/)[0];
        }
    });
    
    var classObj = {
        semester: semester,
        credits: credits
    };

    var timeslot_array = [];
    var timeslot_table = $('body>table>tbody>tr:not(:first-child)').each(function() {
        timeslot_array.push($(this).toString());
    });

    var timeslot_array_final = [];
    for (var i = 0; i < timeslot_array.length; i++) {
        timeslot_array[i]=timeslot_array[i].split('\n');
        
        var timeslot_obj = {};
        var times = [];

        var time = $(timeslot_array[i][2]).text().trim().split('-');

        if (time != 'TBA') {
            var converted_times = [];

            time.forEach((element)=>{
                var split_time = element.split(':');
                split_time[1] = split_time[1].split(' ');
                var time_obj = {
                    hours: +split_time[0],
                    minutes: +split_time[1][0],
                    am_pm: split_time[1][1]
                };
                converted_times.push((time_obj.hours * 60 + time_obj.minutes) + ((time_obj.am_pm == 'pm') ? 12*60 : 0));
            });
            timeslot_obj.start_time = converted_times[0];
            timeslot_obj.end_time = converted_times[1];
        } else {
            timeslot_obj.start_time = 'TBA';
            timeslot_obj.end_time = 'TBA';
        }
        timeslot_obj.days = $(timeslot_array[i][3]).text().trim();
        timeslot_obj.location = $(timeslot_array[i][4]).text().trim();
        var primary_instructor = $(timeslot_array[i][7]).text().trim().split(',')[0];
        // TODO: fix this
        timeslot_obj.instructor = primary_instructor;
        
        timeslot_array_final.push(timeslot_obj);
    }
    


    classObj.timeslots = timeslot_array_final;

    return classObj;
};

module.exports = router;