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
    let query="select * from SGodown where CompanyId="+CompanyId+";";
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
    let query="select *  from SGodown where Whno="+Id+";";
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
        .input('ID', model.Whno)
        .input('GName', model.GName)
        .input('GAddress', model.GAddress)
        .input('GPhNo', model.GPhNo)
        .input('GFaxNO', model.GFaxNO)
        .input('CitiesCode', model.CitiesCode)
        .input('FGodown', model.FGodown)
        .input('Abbreviation', model.Abbreviation)
        .input('RetailerType', model.RetailerType)
        .input('pricepolicy', model.pricepolicy)
        .input('Acno', model.Acno)
        .input('ShiftID', model.ShiftID)
        .input('isPos', model.isPos)
        .input('NTN',model.NTN)
        .input('STN', model.STN)
        .input('Warrantytxt', model.Warrantytxt)
        .input('SubOfficeTypeID', model.SubOfficeTypeID)
        .input('DeptCodeD', model.DeptCodeD)
        .input('Dl1',model.Dl1)
        .input('Dl2', model.Dl2)
        .input('CountryID', model.CountryID)
        .input('RegionID', model.RegionID)
        .input('AreaID', model.AreaID)
        .input('Email', model.Email)
        .input('Contact2', model.Contact2)
        .input('PersonID', model.PersonID)
        .input('DesignationID', model.DesignationID)
        .input('PersonContact', model.PersonContact)
        .input('PersonEmail', model.PersonEmail)
        .input('PhcRegNo', model.PhcRegNo)
        .input('PhcLicenseNo', model.PhcLicenseNo)
        .input('PhcRegDate', sql.DateTime, model.PhcRegDate)
        .input('DrugRegNo', model.DrugRegNo)
        .input('DrugLicenseNo', model.DrugLicenseNo)
        .input('DrugRegDate', sql.DateTime, model.DrugRegDate)
        .input('HealthAuthority', model.HealthAuthority)
        .input('Longitude', model.Longitude)
        .input('Latitude', model.Latitude)
        .input('SubOfficeCode', model.SubOfficeCode)
        .input('CraedetBy', model.CraedetBy)
        .input('CreatedDated', sql.DateTime, model.CreatedDated)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .input('IsActive', model.IsActive)
        .input('DeptStatus', model.DeptStatus)
        .input('CompanyId', model.CompanyId)
        .execute('sp_InsertUpdateSGodown')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.get('/GetUserList/:CompanyID/:GodownId', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let GodownId= req.params.GodownId;
    let query="select * from GodownUsers where CompanyID="+CompanyID+" and GodownId="+GodownId;
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
router.get('/AddUsers/:UserId/:GodownId/:CompanyID', function (req, res, next) {
    let UserId= req.params.UserId;
    let GodownId= req.params.GodownId;
    let CompanyID= req.params.CompanyID;
    let query="INSERT INTO [dbo].[GodownUsers] ([UserId] ,[GodownId],[CompanyID])VALUES ("+UserId+" ,"+GodownId+","+CompanyID+")";
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Success.");
                    })
                    .catch(function (error) {
                      response.send(error);
                    })
    })
    .catch(function(err){
        response.send(err);     
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from SGodown where Whno="+Id+";";
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Deleted Successfull.");
                    })
                    .catch(function (error) {
                        res.send("Error: This data in use.");
                    })
    })
    .catch(function(err){
        response.send(err);     
    })
});
router.delete('/DeleteUsers/:CompanyID/:GodownId', function (req, res, next) {
    let GodownId= req.params.GodownId;
    let CompanyID= req.params.CompanyID;
    let query="delete from GodownUsers where CompanyID="+CompanyID+" and GodownId="+GodownId+";";
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