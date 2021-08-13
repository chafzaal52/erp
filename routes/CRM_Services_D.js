var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("CRM_Services_D work properly");
});


router.get('/GetById/:Service_ID', function (req, res, next) {
    let Service_ID= req.params.Service_ID;
    let query="select * from CRM_Services_D where Service_ID="+Service_ID+" order by CRM_Services_D_ID desc";
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
        .input('ID', model.CRM_Services_D_ID)
        .input('Service_ID', model.Service_ID)
        .input('Charges', model.Charges)
        .input('StDate', sql.DateTime, model.StDate)
        .input('EdDate', sql.DateTime, model.EdDate)
        .input('Comments', model.Comments)
        .input('distributor_Discount', model.distributor_Discount)
        .input('FixPrice', model.FixPrice)
        .input('TagPrice', model.TagPrice)
        .input('MemberDisc', model.MemberDisc)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateCRM_Services_D')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from CRM_Services_D where Service_ID="+Id+";";//////////////
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