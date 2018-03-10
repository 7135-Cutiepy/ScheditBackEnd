var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

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

module.exports = router;