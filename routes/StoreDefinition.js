var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("i am works properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select * from Storedef where CompanyID="+CompanyID;
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
    var query="select *  from Storedef where Storeid="+Id+";";
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
        .input('Id',model.Storeid)
        .input('StoreCode',model.StoreCode)
        .input('StoreName',model.StoreName)
        .input('CompanyId',model.CompanyId)
        .input('UserId',model.UserId)
        .input('Posid',model.Posid)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .execute('sp_InsertUpdateStore')
    }).then(result => {
        //res.send("Success");
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.get('/GetUserList/:CompanyID/:StoreCode', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let StoreCode= req.params.StoreCode;
    let query="select * from StoreUsers where CompanyID="+CompanyID+" and StoreCode="+StoreCode;
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
router.get('/AddUsers/:UserID/:StoreCode/:CompanyID', function (req, res, next) {
    let UserID= req.params.UserID;
    let StoreCode= req.params.StoreCode;
    let CompanyID= req.params.CompanyID;
    let query="INSERT INTO [dbo].[StoreUsers] ([UserId] ,[StoreCode],[CompanyID])VALUES ("+UserID+" ,"+StoreCode+","+CompanyID+")";
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
    var query="delete from Storedef where Storeid="+Id+";";
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
router.delete('/DeleteUsers/:CompanyID/:StoreCode', function (req, res, next) {
    let StoreCode= req.params.StoreCode;
    let CompanyID= req.params.CompanyID;
    let query="delete from StoreUsers where CompanyID="+CompanyID+" and StoreCode="+StoreCode+";";
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