var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Product Profiler work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select M.*,i.ItHead,i.ItCodeD from ItemProfileM1 M, IItems i where m.ItCode=i.ItCode and M.CompanyID="+CompanyID;
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
    var query="select M.*,i.ItHead,i.ItCodeD from ItemProfileM1 M, IItems i where m.ItCode=i.ItCode and M.MaxId="+Id+";";
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
   router.get('/GetDetailById/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="select * from ItemProfileD1 where MaxId="+Id;
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
        .input('Id',model.MaxId)
        .input('ItCode',model.ItCode)
        .input('Godownid',model.Godownid)
        .input('UserId',model.UserId)
        .input('FYear',model.FYear)
        .input('UnitName',model.UnitName)
        .input('BrandName',model.BrandName)
        .input('Remarks',model.Remarks)
        .input('IsTest',model.IsTest)
        .input('TestNameM',model.TestNameM)
        .input('StageNo',model.StageNo)
        .input('StageName',model.StageName)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateItemProfileM1')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertUpdateDetail', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('ID',model.ItemProfileD1_Id)
        .input('MaxId',model.MaxId)
        .input('TestCode',model.TestCode)
        .input('TestName',model.TestName)
        .input('StandardValue',model.StandardValue)
        .input('Comments',model.Comments)
        .input('LSL',model.LSL)
        .input('USL',model.USL)
        .input('StageNoD',model.StageNoD)
        .input('StageNameD',model.StageNameD)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateItemProfileD1')
    }).then(result => {
        res.send("success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from ItemProfileD1 where MaxId="+Id+"; delete from ItemProfileM1 where MaxId="+Id+";";
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