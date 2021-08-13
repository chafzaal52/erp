var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("USuppliers_Disc Work properly");
});


router.get('/GetById/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="select *  from USuppliers_Disc where SCode="+Id+";";
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
        .input('ID',model.ID)
        .input('SCode',model.SCode)
        .input('Itcode',model.Itcode)
        .input('DiscountRate',model.DiscountRate)
        .input('STDate',sql.DateTime,model.STDate)
        .input('EdDate',sql.DateTime,model.EdDate)
        .input('Comments',model.Comments)
        .input('totQty',model.totQty)
        .input('DiscQty',model.DiscQty)
        .input('CompanyID',model.CompanyID)
        .input('ItCodeD',model.ItCodeD)
        .input('ItHead',model.ItHead)
        .execute('sp_InsertUpdateUSuppliers_Disc')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from USuppliers_Disc where SCode="+Id+";";
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