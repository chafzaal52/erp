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
    let query="select * from PaymentTerm where CompanyID="+CompanyId+";";
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
    var query="select *  from PaymentTerm where Termid="+Id+";";
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
        .input('Termid',model.Termid)
        .input('MaxNo',model.MaxNo)
        .input('term1',model.term1)
        .input('Percent_Amt_1',model.Percent_Amt_1)
        .input('Credit_Days_1',model.Credit_Days_1)
        .input('term2',model.term2)
        .input('Percent_Amt_2',model.Percent_Amt_2)
        .input('Credit_Days_2',model.Credit_Days_2)
        .input('term3',model.term3)
        .input('Percent_Amt_3',model.Percent_Amt_3)
        .input('Credit_Days_3',model.Credit_Days_3)
        .input('term4',model.term4)
        .input('Percent_Amt_4',model.Percent_Amt_4)
        .input('Credit_Days_4',model.Credit_Days_4)
        .input('term5',model.term5)
        .input('Percent_Amt_5',model.Percent_Amt_5)
        .input('Credit_Days_5',model.Credit_Days_5)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdatePaymentTerms')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from PaymentTerm where Termid="+Id+";";
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