var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Rack Work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    let query="select * from RackDef where CompanyID="+CompanyID;
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
    var query="select *  from RackDef where RackCode="+Id+";";
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
        .input('Id',model.RackCode)
        .input('RackName',model.RackName)
        .input('Abriviation',model.Abriviation)
        .input('StoreCode',model.StoreCode)
        .input('CompanyId',model.CompanyId)
        .input('UserId',model.UserId)
        .input('PosId',model.PosId)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .execute('sp_InsertUpdateRack')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from RackDef where RackCode="+Id+";";
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