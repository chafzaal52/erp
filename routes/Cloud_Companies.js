var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Cloud_Companies Work properly");
});


router.get('/GetList', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    let query="select * from Cloud_Companies";
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
router.get('/GetById/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="select *  from Cloud_Companies where companyid="+Id+";";
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
        .input('Id',model.CompanyId)
        .input('CompanyCode',model.CompanyCode)
        .input('CompanyName',model.CompanyName)
        .input('CompanyDescription',model.CompanyDescription)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('CreatedById',model.CreatedById)
        .input('DeActiveBy',model.DeActiveBy)
        .input('DeActiveTimeDate',sql.DateTime,model.DeActiveTimeDate)
        .input('RecordStatus',model.RecordStatus)
        .input('UUId',model.UUId)
        .input('CompanyUsername',model.CompanyUsername)
        .input('CompanyPassword',model.CompanyPassword)
        .input('NoOfAccounts',model.NoOfAccounts)
        .input('LogoName',model.LogoName)
        .input('LogoAddress',model.LogoAddress)
        .input('HomeImageName',model.HomeImageName)
        .input('HomeImageAddress',model.HomeImageAddress)
        .input('ThemeColor',model.ThemeColor)
        .input('CompanyLegalName',model.CompanyLegalName)
        .input('RegistrationNo',model.RegistrationNo)
        .input('ContactNo',model.ContactNo)
        .input('CompanyAddress',model.CompanyAddress)
        .input('DeActivateReason',model.DeActivateReason)
        .execute('sp_InsertUpdateCloud_Companies')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from Cloud_Companies where companyid="+Id+";";
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