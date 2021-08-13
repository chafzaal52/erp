var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Yes I am Working :) Report Setting")
});

router.get('/GetAllReportSettingList/:CompanyID', function (req, res, next) {
    const CompanyID= req.params.CompanyID;
    let query="select * from ReportSetting where CompanyId="+CompanyID;
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                     res.send(dbData.recordset);
                    })
                    .catch(function (error) {
                        res.send(error);
                    })
    })
    .catch(function(err){
        console.log(err);
        res.send(err);    
    });  
});


module.exports = router;