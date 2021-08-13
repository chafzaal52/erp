var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("DocAttachments worked properly");
});

router.get('/GetById/:CompanyID/:ChequeNo/:ifrom', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    var ifrom= req.params.ifrom;
    var ChequeNo= req.params.ChequeNo;
    var query="select * from DocAttachments where ChequeNo='"+ChequeNo+"' and ifrom='"+ifrom+"' and CompanyID="+CompanyID;
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
   router.get('/GetByFormList/:CompanyID/:ifrom', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    var ifrom= req.params.ifrom;
    var query="select * from DocAttachments where ifrom='"+ifrom+"' and CompanyID="+CompanyID;
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
        .input('ID',model.MaxId)
        .input('RefId',model.RefId)
        .input('SrNo',model.SrNo)
        .input('DocPath',model.DocPath)
        .input('ChequeNo',model.ChequeNo)
        .input('ifrom',model.ifrom)
        .input('Whno',model.Whno)
        .input('FYear',model.FYear)
        .input('EDate',sql.DateTime,model.EDate)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertDocAttachments')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:CompanyID/:ChequeNo/:ifrom', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    var ifrom= req.params.ifrom;
    var ChequeNo= req.params.ChequeNo;
    var query="delete from DocAttachments where ChequeNo='"+ChequeNo+"' and ifrom='"+ifrom+"' and CompanyID="+CompanyID;
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