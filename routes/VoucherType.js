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
    let query="select * from VOUCHERS where CompanyId="+CompanyId+";";
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
    var query="select *  from VOUCHERS where ID="+Id+";";
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
        .input('VTYPE',model.VTYPE)
        .input('VDESCRP',model.VDESCRP)
        .input('VLOCATION',model.VLOCATION)
        .input('VREMARK',model.VREMARK)
        .input('IsBank',model.IsBank)
        .input('BusinessAccountID',model.BusinessAccountID)
        .input('IsActive',model.IsActive)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('CompanyId',model.CompanyId)
        .input('is_auto_Post',model.is_auto_Post)
        .input('isAuto',model.isAuto)
        .input('VID',model.VID)
        .execute('sp_InsertUpdaVochers')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.get('/GetUserList/:CompanyID/:VId', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let VId= req.params.VId;
    let query="select * from VouchersUsers where CompanyID="+CompanyID+" and VId="+VId;
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
router.get('/GetUserListByUser/:UserID', function (req, res, next) {
    let UserID= req.params.UserID;
    let query="select * from VouchersUsers where UserId="+UserID;
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
router.get('/AddUsers/:UserId/:CompanyID/:VId', function (req, res, next) {
    let UserId= req.params.UserId;
    let CompanyID= req.params.CompanyID;
    let VId = req.params.VId;
    let query="INSERT INTO [dbo].[VouchersUsers] ([UserId] ,[CompanyID],[VId])VALUES ("+UserId+" ,"+CompanyID+","+VId+")";
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
    var query="delete from VOUCHERS where ID="+Id+";";
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
router.delete('/DeleteUsers/:CompanyID/:VID', function (req, res, next) {
    let VID= req.params.VID;
    let CompanyID= req.params.CompanyID;
    let query="delete from VouchersUsers where CompanyId="+CompanyID+" and VId="+VID+";";
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