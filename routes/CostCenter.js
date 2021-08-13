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
    let query="select * from Departments where CompanyId="+CompanyId+";";
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
    var query="select *  from Departments where DeptCode="+Id+";";
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
        .input('DeptCode',model.DeptCode)
        .input('DeptCodeD',model.DeptCodeD)
        .input('Dl1',model.Dl1)
        .input('Dl2',model.Dl2)
        .input('DeptName',model.DeptName)
        .input('DeptStatus',model.DeptStatus)
        .input('Deptlevel',model.Deptlevel)
        .input('Depthead',model.Depthead)
        .input('Strength',model.Strength)
        .input('BusinessAccountID',model.BusinessAccountID)
        .input('IsActive',model.IsActive)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .input('DepartmentID',model.DepartmentID)
        .input('CompanyId',model.CompanyId)
        .execute('sp_InsertUpdateCostCenter')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.get('/GetUserList/:Deptcode', function (req, res, next) {
    let Deptcode= req.params.Deptcode;
    let query="select * from DepartmentUsers where Deptcode="+Deptcode;
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
router.get('/AddUsers/:UserId/:Deptcode', function (req, res, next) {
    let UserId= req.params.UserId;
    let Deptcode = req.params.Deptcode;
    let query="INSERT INTO [dbo].[DepartmentUsers] ([UserId] ,[Deptcode])VALUES ("+UserId+" ,"+Deptcode+")";
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
    var query="delete from Departments where DeptCode="+Id+";";
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
router.delete('/DeleteUsers/:Deptcode', function (req, res, next) {
    let Deptcode = req.params.Deptcode;
    let query="delete from DepartmentUsers where Deptcode="+Deptcode;
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