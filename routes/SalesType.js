var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Sales Type work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select * from SalesTypes where CompanyID="+CompanyID;
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
    var query="select *  from SalesTypes where SalesID="+Id+";";
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
        .input('ID',model.SalesID)
        .input('SalesCode',model.SalesCode)
        .input('Acno',model.Acno)
        .input('SalesDesc',model.SalesDesc)
        .input('AcnoDirect',model.AcnoDirect)
        .input('AcnoDicount',model.AcnoDicount)
        .input('AcnoBonus',model.AcnoBonus)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateSalesTypes')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from SalesTypes where SalesID="+Id+";";
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