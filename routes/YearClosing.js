var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("YearClosing work properly");
});


router.get('/GetLocation_Detail/', function (req, res, next) {
    let query="select * from GetLocation_Detail";
     new sql.connect(config).then(pool=> {   
            return pool.request()
                    .query(query)
                    .then(result => {
                     res.send(result.recordset);
                    })
                    .catch(err => {
                        res.send(err);
                    })
                })
});
router.get('/AutoYearClosingWithOpBalance/:POSId/:FromYear/:stDate/:endDate', function (req, res, next) {
    let POSId= req.params.POSId;
    let FromYear= req.params.FromYear;
    let stDate= req.params.stDate;
    let endDate= req.params.endDate;
    let query="exec sp_AutoYearClosingWithOpBalance "+POSId+","+FromYear+",'"+stDate+"','"+endDate+"'";
     new sql.connect(config).then(pool=> {   
            return pool.request()
                    .query(query)
                    .then(result => {
                     res.send(result.recordset);
                    })
                    .catch(err => {
                        res.send(err);
                    })
                })
});

router.get('/AutoYearCloseWOOpBal/:POSId/:FromYear/:stDate/:endDate', function (req, res, next) {
    let POSId= req.params.POSId;
    let FromYear= req.params.FromYear;
    let stDate= req.params.stDate;
    let endDate= req.params.endDate;
    let query="exec sp_AutoYearCloseWOOpBal "+POSId+","+FromYear+",'"+stDate+"','"+endDate+"'";
     new sql.connect(config).then(pool=> {   
            return pool.request()
                    .query(query)
                    .then(result => {
                     res.send(result.recordset);
                    })
                    .catch(err => {
                        res.send(err);
                    })
                })
});

router.get('/OBalanceDeleteAndGetList/:POSId/:ToYear', function (req, res, next) {
    let POSId= req.params.POSId;
    let ToYear= req.params.ToYear;
    let query="delete from dbo.obalance where GodownId=" + POSId + " and fyear=" + ToYear + " ;select * from dbo.OBalance where  GodownId=" + POSId + " and fyear=" + ToYear;
     new sql.connect(config).then(pool=> {   
            return pool.request()
                    .query(query)
                    .then(result => {
                     res.send(result.recordset);
                    })
                    .catch(err => {
                        res.send(err);
                    })
                })
});

module.exports = router;