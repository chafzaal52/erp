var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Users Work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select * from users where CompanyID="+CompanyID;
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

router.get('/GetById/:ID', function (req, res, next) {
    let ID= req.params.ID;
    let query="select * from users where ID="+ID;
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
        .input('Title', model.Title)
        .input('FirstName', model.FirstName)
        .input('LastName', model.LastName)
        .input('Gender', model.Gender)
        .input('MaritalStatus', model.MaritalStatus)
        .input('FatherName', model.FatherName)
        .input('CNIC', model.CNIC)
        .input('Mobile', model.Mobile)
        .input('Phone', model.Phone)
        .input('Email', model.Email)
        .input('Password', model.Password)
        .input('CountryID', model.CountryID)
        .input('RegionID', model.RegionID)
        .input('CityID', model.CityID)
        .input('AreaID', model.AreaID)
        .input('HomeAddress', model.HomeAddress)
        .input('RoleID', model.RoleID)
        .input('DateOfBirth', sql.DateTime, model.DateOfBirth)
        .input('DateOfJoining', sql.DateTime, model.DateOfJoining)
        .input('DateOfLeaving', sql.DateTime, model.DateOfLeaving)
        .input('Comments', model.Comments)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdateBy', model.UpdateBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('IsActive', model.IsActive)
        .input('CompanyId', model.CompanyId)
        .execute('sp_InsertUpdateUsers')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});


router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from Users where ID="+Id+";";
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