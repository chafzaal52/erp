var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("UnitConversion work properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    var CompanyId= req.params.CompanyId;
    let query="select IUnitConversion.*,IMearsuringUnits.UnitDescrp as UnitName,IItems.ItHead as itHead from IUnitConversion,IMearsuringUnits,IItems where IUnitConversion.CompanyId="+CompanyId+" and IUnitConversion.unitCode=IMearsuringUnits.ID and IUnitConversion.itCode=IItems.ItCode";
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
    var query="select IUnitConversion.*,IMearsuringUnits.UnitDescrp as UnitName,IItems.ItHead as itHead from IUnitConversion,IMearsuringUnits,IItems where IUnitConversion.ID="+Id+" and IUnitConversion.unitCode=IMearsuringUnits.ID and IUnitConversion.itCode=IItems.ItCode";
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
        .input('Id',model.ID)
        .input('itCode',model.itCode)
        .input('unitCode',model.unitCode)
        .input('Conversion',model.Conversion)
        .input('CompanyId',model.CompanyId)
        .input('UserId',model.UserId)
        .input('Posid',model.Posid)
        .input('CreatedBy',model.CreatedBy)
        .input('CreatedDate',sql.DateTime,model.CreatedDate)
        .input('UpdatedBy',model.UpdatedBy)
        .input('UpdatedDate',sql.DateTime,model.UpdatedDate)
        .execute('sp_InsertUpdateUnitConversion')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from IUnitConversion where ID="+Id+";";
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