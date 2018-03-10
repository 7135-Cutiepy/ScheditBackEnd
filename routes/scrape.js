var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

router.get('/test', function(req, res, next) {
    var test = `
        <div id="parent">
        <span class="fieldlabeltext">Associated Term: </span>Fall 2018 
        <br>
        <span class="fieldlabeltext">Registration Dates: </span>Mar 26, 2018 to Aug 24, 2018 
        <br>
        <span class="fieldlabeltext">Levels: </span>Graduate Semester 
        <br>
        <br>
        Georgia Tech-Atlanta * Campus
        <br>
        Dissertation* Schedule Type
        <br>
            1.000 TO       21.000 Credits
        <br>
        <span class="fieldlabeltext">Grade Basis: </span>P 
        <br>
        <a href="/pls/bprod/bwckctlg.p_display_courses?term_in=201808&amp;one_subj=CS&amp;sel_crse_strt=9000&amp;sel_crse_end=9000&amp;sel_subj=&amp;sel_levl=&amp;sel_schd=&amp;sel_coll=&amp;sel_divs=&amp;sel_dept=&amp;sel_attr=">View Catalog Entry</a>
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
        <td class="dddefault"><abbr title="To Be Announced">TBA</abbr></td>
        <td class="dddefault">&#xA0;</td>
        <td class="dddefault"><abbr title="To Be Announced">TBA</abbr></td>
        <td class="dddefault">Aug 20, 2018 - Dec 13, 2018</td>
        <td class="dddefault">Dissertation*</td>
        <td class="dddefault">Ellen   Zegura (<abbr title="Primary">P</abbr>)<a href="mailto:ewz@cc.gatech.edu" target="Ellen Zegura"><img src="/wtlgifs/web_email.gif" align="middle" alt="E-mail" class="headerImg" title="E-mail" name="web_email" hspace="0" vspace="0" border="0" height="28" width="28"></a></td>
        </tr>
        </tbody></table>
        <br>
        <br>
        </div>`;

    var $ = cheerio.load(test);

    var arrOfHtml = [];
    $('#parent').children().each(function(){
        arrOfHtml.push($(this));
    });
    console.log(arrOfHtml.toString());
    res.send(test);
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
                });

                $('.pagebodydiv>.datadisplaytable>tbody>tr>.dddefault').each(function(i) {
                    console.log(">>>>>>>>>begin raw");
                    console.log($(this).html());
                    console.log(">>>>>>>>>end raw");

                    // console.log(">>>>>>>>>begin formatted");
                    // console.log($(this:nth-child(0)));
                    // console.log(">>>>>>>>>end formatted");
                    console.log("");
                });
                // res.send(sections);
                res.send(body);
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
    var number = split_2[1];
    var section = split[3];

    var class_obj = {
        name: name,
        crn: crn,
        major: major,
        number: number,
        section: section
    };

    return class_obj;
}

module.exports = router;