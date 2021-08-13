var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Rep_Mgr work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select RepMgr.*,Regional_Mgr.MgrName as RegMgrName from RepMgr,Regional_Mgr where RepMgr.reg_Mgr=Regional_Mgr.MgrCode and RepMgr.CompanyID="+CompanyID;
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
    var query="select RepMgr.*,Regional_Mgr.MgrName as RegMgrName from RepMgr,Regional_Mgr where RepMgr.reg_Mgr=Regional_Mgr.MgrCode and RepMgr.MgrCode="+Id+";";
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
        .input('ID',model.MgrCode)
        .input('PosId',model.PosId)
        .input('MgrName',model.MgrName)
        .input('Desig',model.Desig)
        .input('Emp_CardNO',model.Emp_CardNO)
        .input('reg_Mgr',model.reg_Mgr)
        .input('CompanyId',model.CompanyId)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('Updateddate',sql.DateTime,model.Updateddate)
        .execute('sp_InsertUpdateRepMgr')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from RepMgr where MgrCode="+Id+";";
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