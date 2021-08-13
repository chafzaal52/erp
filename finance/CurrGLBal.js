var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("CurrGLBal Worked properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from CurrGLBal where CompanyID="+CompanyId+";";
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
router.get('/GetByAccountWise/:acno/:posid', function (req, res, next) {
    let acno= req.params.acno;
    let posid= req.params.posid;
    let Fyear= req.params.Fyear;
    let query="select * from [CurrGLBal] where acno="+acno+" and posid="+posid;
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
        .input('acno', model.acno)
        .input('ClBal', model.ClBal)
        .input('posid', model.posid)
        .input('Fyear', model.Fyear)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateCurrGLBal')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});

router.delete('/Delete/:acno/:posid/:Fyear', function (req, res, next) {
    let acno= req.params.acno;
    let posid= req.params.posid;
    let Fyear= req.params.Fyear;
    let query="delete from [CurrGLBal] where acno="+acno+" and posid="+posid+" and Fyear="+Fyear;
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