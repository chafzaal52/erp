var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("RCBank Work properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select b.*,ac.ACHEAD,ac.AcNoD from RCBank b,ACLIST ac where b.GlCode=ac.ACNO and b.CompanyId="+CompanyId+";";
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
    let Id= req.params.Id;
    var query="select b.*,ac.ACHEAD,ac.AcNoD from RCBank b,ACLIST ac where b.GlCode=ac.ACNO and b.BankID="+Id;
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
        .input('ID', model.BankID)
        .input('BankCode', model.BankCode)
        .input('b1', model.b1)
        .input('b2', model.b2)
        .input('b3', model.b3)
        .input('b4', model.b4)
        .input('b5', model.b5)
        .input('blevel', model.blevel)
        .input('bparent', model.bparent)
        .input('bstatus', model.bstatus)
        .input('Bankname', model.Bankname)
        .input('bkAddr', model.bkAddr)
        .input('GlCode', model.GlCode)
        .input('branchcode', model.branchcode)
        .input('BankACNo', model.BankACNo)
        .input('Brcode', model.Brcode)
        .input('Obal_bank', model.Obal_bank)
        .input('Obal_Bank_Date', sql.DateTime, model.Obal_Bank_Date)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('IsActive', model.IsActive)
        .input('CompanyId', model.CompanyId)
        .input('posid', model.posid)
        .execute('sp_InsertUpdateRCBank')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from RCBank where BankID="+Id+";";
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