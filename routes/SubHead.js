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
    let query="select * from SubHead where CompanyID="+CompanyId+";";
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
    var query="select *  from SubHead where SubHeadId="+Id+";";
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
    let query="INSERT INTO [dbo].[SubHead]([AcNo],[PartyType],[CompanyID])VALUES("+model.AcNo+","+model.PartyType+","+model.CompanyID+")";
    sql.connect(config).then(response => {
        return response.request()
        // .input('SubHeadId',model.SubHeadId)
        // .input('AcNo',model.AcNo)
        // .input('PartyType',model.PartyType)
        // .input('CompanyId',model.CompanyID)
        .query(query)
        //.query('sp_InsertUpdateSubHead')
    }).then(result => {
        //maxid = result.recordset[0].MaxID
        res.send("success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:CompanyID/:Id', function (req, res, next) {
    let Id= req.params.Id;
    let CompanyID= req.params.CompanyID;
    var query="delete from SubHead where CompanyID="+CompanyID+" and PartyType="+Id+";";
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