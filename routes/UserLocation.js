var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("UserLocation Work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select * from UserLocation where UserID="+CompanyID;
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
router.get('/GetspList/:UserID/:CompanyID', function (req, res, next) {
    let UserID= req.params.UserID;
    let CompanyID= req.params.CompanyID;
    let query="exec sp_GetUserLocation "+UserID+","+CompanyID;
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
        .input('ID', model.ID)
        .input('BusinessAccountID', model.BusinessAccountID)
        .input('LocationID', model.LocationID)
        .input('UserID', model.UserID)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('IsActive', model.IsActive)
        .input('CompanyId', model.CompanyId)
        .execute('sp_InsertUpdateUserLocation')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});


router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from UserLocation where UserID="+Id+";";
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