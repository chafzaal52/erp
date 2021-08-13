var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("UAreas Work properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select *,(select OrigonName from UOrigon where OrigonId=a.CountryID) as CountryName,(select AreaName from SAreaDefinitionM where AreaCode= a.RegionID) as RegionName, (select CitiesName from UCities where CitiesCode=a.CityCode) as CityName from UAreas a where a.CompanyID="+CompanyId+";";
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
    var query="select *,(select OrigonName from UOrigon where OrigonId=a.CountryID) as CountryName,(select AreaName from SAreaDefinitionM where AreaCode= a.RegionID) as RegionName, (select CitiesName from UCities where CitiesCode=a.CityCode) as CityName from UAreas a where a.Areaid="+Id+";";
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
        .input('ID',model.Areaid)
        .input('AreaCode',model.AreaCode)
        .input('AreaName',model.AreaName)
        .input('CountryID',model.CountryID)
        .input('RegionID',model.RegionID)
        .input('CityCode',model.CityCode)
        .input('POSid',model.POSid)
        .input('Abbreviation',model.Abbreviation)
        .input('IsActive',model.IsActive)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateUAreas')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from UAreas where Areaid="+Id+";";
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