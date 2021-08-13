var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("MedicalRep work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select MedicalRep.*,GetLocation.OfficeName,RepMgr.MgrName from MedicalRep,GetLocation,RepMgr  where MedicalRep.posid = GetLocation.ID and MedicalRep.MgrCode=RepMgr.MgrCode and MedicalRep.CompanyID="+CompanyID;
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
    var query="select MedicalRep.*,GetLocation.OfficeName,RepMgr.MgrName from MedicalRep,GetLocation,RepMgr  where MedicalRep.posid = GetLocation.ID and MedicalRep.MgrCode=RepMgr.MgrCode and MedicalRep.Mid="+Id+";";
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
        .input('Id',model.Mid)
        .input('Name',model.Name)
        .input('Address',model.Address)
        .input('PHone',model.PHone)
        .input('EMail',model.EMail)
        .input('Designation',model.Designation)
        .input('Department',model.Department)
        .input('NIC',model.NIC)
        .input('PosID',model.PosID)
        .input('UserID',model.UserID)
        .input('Incentive',model.Incentive)
        .input('MgrCode',model.MgrCode)
        .input('CompanyId',model.CompanyId)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('Updateddate',sql.DateTime,model.Updateddate)
        .execute('sp_InsertUpdateMedicalRep')
    }).then(result => {
        //res.send("Success");
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.get('/GetAreaList/:CompanyID/:MId', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let MId= req.params.MId;
    let query="select * from MedicalRepArea where CompanyID="+CompanyID+" and MId="+MId;
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
router.get('/AddAreas/:MId/:AreaID/:GodownID/:CompanyID', function (req, res, next) {
    let MId= req.params.MId;
    let AreaID= req.params.AreaID;
    let GodownID= req.params.GodownID;
    let CompanyID= req.params.CompanyID;
    let query="INSERT INTO [dbo].[MedicalRepArea]([MId],[AreaId],[GodownId],[CompanyID])VALUES("+MId+" ,"+AreaID+" ,"+GodownID+" ,"+CompanyID+")";
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
    var Id= req.params.Id;
    var query="delete from MedicalRep where MId="+Id+";";
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
router.delete('/DeleteAreas/:CompanyID/:MId', function (req, res, next) {
    let MId= req.params.MId;
    let CompanyID= req.params.CompanyID;
    let query="delete from MedicalRepArea where CompanyID="+CompanyID+" and MId="+MId+";";
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