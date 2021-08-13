var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("CRM_Services_DD work properly");
});


router.get('/GetById/:Service_ID', function (req, res, next) {
    let Service_ID= req.params.Service_ID;
    let query="select * from CRM_Services_DD where Service_ID="+Service_ID+" order by CRM_SERVICES_DD_ID desc";
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
   router.post('/InsertUpdate', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('ID', model.CRM_SERVICES_DD_ID)
        .input('Service_ID', model.Service_ID)
        .input('taxid', model.taxid)
        .input('taxrate',model.taxrate)
        .input('Ord_qty', model.Ord_qty)
        .input('Bns_qty', model.Bns_qty)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateCRM_SERVICES_DD')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from CRM_Services_DD where Service_ID="+Id+";";//////////////
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Deleted Successfull.");
                    })
                    .catch(function (error) {
                      response.send(error);
                    })
    })
    .catch(function(err){
        response.send(err);     
    })
});

module.exports = router;