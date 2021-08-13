var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("i am works properly");
});
router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from TaxRatesM where CompanyId="+CompanyId+";";
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
router.get('/GetDetailDiscount/:taxid/:StDate', function (req, res, next) {
    let taxid= req.params.taxid;
    let StDate= req.params.StDate;
    let query="exec  [SpDot_ERP_Tax_DiscountCombo]  "+taxid+" ,'"+ StDate+"'";
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
    var query="select *  from TaxRatesM where Taxid="+Id+";";
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
   router.get('/GetDetailById/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="select *  from TaxRatesD where taxid="+Id+";";
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
        .input('Taxid',model.Taxid)
        .input('Taxno',model.Taxno)
        .input('TaxDesc',model.TaxDesc)
        .input('isobsolete',model.isobsolete)
        .input('userid',model.userid)
        .input('fyear',model.fyear)
        .input('ExTaxid',model.ExTaxid)
        .input('IsCalOnExTax',model.IsCalOnExTax)
        .input('GLCode',model.GLCode)
        .input('POSID',model.POSID)
        .input('CompanyId',model.CompanyId)
        .execute('sp_InsertUpdateDiscountMast')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertUpdateDetail', function (req, res, next) {
 var model= req.body;
 sql.connect(config).then(response => {
     return response.request()
     .input('taxid',model.taxid)
     .input('taxrate',model.taxrate)
     .input('Ord_qty',model.Ord_qty)
     .input('Bns_Qty',model.Bns_Qty)
     .input('stdate',sql.DateTime,model.stdate)
     .input('endate',sql.DateTime,model.endate)
     .input('comments',model.comments)
     .input('TaxRatesD_ID',model.TaxRatesD_ID)
     .input('CompanyId',model.CompanyId)
     .execute('sp_InsertUpdateDiscountDetail')
 }).then(result => {
     maxid = result.recordset[0].MaxID
     res.send(""+maxid+"");
 }).catch(err => {
     res.send({ err });
 })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from TaxRatesD where taxid="+Id+"; delete from TaxRatesM where Taxid="+Id+";";
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