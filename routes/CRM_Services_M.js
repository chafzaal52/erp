var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("CRM_Services_M work properly");
});


router.get('/GetById/:ItCode', function (req, res, next) {
    let ItCode= req.params.ItCode;
    let query="select * from CRM_Services_M where ItemCode="+ItCode;
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
        .input('ID', model.Service_ID)
        .input('Service_Code', model.Service_Code)
        .input('Service_Desc', model.Service_Desc)
        .input('EffectonStock', model.EffectonStock)
        .input('ItemCode', model.ItemCode)
        .input('MSISDN', model.MSISDN)
        .input('Obsolete', model.Obsolete)
        .input('userid', model.userid)
        .input('GLCode', model.GLCode)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateCRM_Services_M')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from CRM_Services_M where Code="+Id+";";/////////////
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