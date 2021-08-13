var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Ov_Budg_M Worked properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select m.*,dep.DeptName as DepartmentName from Ov_Budg_M m, Departments dep where m.Dept_Code=dep.DeptCode and m.CompanyID="+CompanyId+";";
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
    var query="select *  from Ov_Budg_M where budg_id="+Id+";";
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
   router.get('/GetDetailBybudg_id/:budg_id', function (req, res, next) {
    let budg_id= req.params.budg_id;
    var query="select *  from Ov_Budg_D where budg_id="+budg_id;
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
        .input('ID', model.budg_id)
        .input('Dept_Code', model.Dept_Code)
        .input('fyear', model.fyear)
        .input('userid', model.userid)
        .input('FBMonth', model.FBMonth)
        .input('CompanyID', model.CompanyID)
        .input('POSID', model.POSID)
        .input('CreatedBy', model.CreatedBy)
        .input('CreatedDate', sql.DateTime, model.CreatedDate)
        .input('UpdatedBy', model.UpdatedBy)
        .input('UpdatedDate', sql.DateTime, model.UpdatedDate)
        .execute('sp_InsertUpdateOv_Budg_M')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertDetail', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('budg_id', model.budg_id)
        .input('Ac_no', model.Ac_no)
        .input('Budg_Rs', model.Budg_Rs)
        .input('Actul_Rs', model.Actul_Rs)
        .input('Bal_Rs', model.Bal_Rs)
        .input('Remarks', model.Remarks)
        .input('CompanyID', model.CompanyID)
        .input('UserID', model.UserID)
        .input('POSID', model.POSID)
        .execute('sp_InsertUpdateOv_Budg_D')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:budg_id', function (req, res, next) {
    let budg_id= req.params.budg_id;
    var query="delete from Ov_Budg_D where budg_id="+budg_id+"; delete from Ov_Budg_M where budg_id="+budg_id;
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
router.delete('/DeleteDetail/:budg_id', function (req, res, next) {
    let budg_id= req.params.budg_id;
    var query="delete from Ov_Budg_D where budg_id="+budg_id;
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