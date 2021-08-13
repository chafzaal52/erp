var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("i am works properly");
});


router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from FARTransfer where CompanyID="+CompanyId+";";
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
    var query="select *  from FARTransfer where ID="+Id+";";
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
        .input('ID', model.ID)
        .input('MaxDtl', model.MaxDtl)
        .input('AssetCatid', model.AssetCatid)
        .input('Assetcode', model.Assetcode)
        .input('AssetTitle', model.AssetTitle)
        .input('oldUsername', model.oldUsername)
        .input('oldUserDesig', model.oldUserDesig)
        .input('Username', model.Username)
        .input('UserDesig', model.UserDesig)
        .input('deptcode', model.deptcode)
        .input('locid', model.locid)
        .input('purpose', model.purpose)
        .input('placeoffixation', model.placeoffixation)
        .input('holdType', model.holdType)
        .input('Comments', model.Comments)
        .input('BldAddress', model.BldAddress)
        .input('BldVendorName', model.BldVendorName)
        .input('BldVendorAdd', model.BldVendorAdd)
        .input('BldVendorNICNo', model.BldVendorNICNo)
        .input('BldAreaK', model.BldAreaK)
        .input('BldAream', model.BldAream)
        .input('BldAreaSqft', model.BldAreaSqft)
        .input('BldCost', model.BldCost)
        .input('BldLglCost', model.BldLglCost)
        .input('BldOthCost', model.BldOthCost)
        .input('MvRegno', model.MvRegno)
        .input('MVChasisNo', model.MVChasisNo)
        .input('MVModal', model.MVModal)
        .input('MVEnginNo', model.MVEnginNo)
        .input('MVFuel', model.MVFuel)
        .input('Userid', model.Userid)
        .input('Fyear', model.Fyear)
        .input('srno', model.srno)
        .input('POSID', model.POSID)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateFARTransfer')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from FARTransfer where ID="+Id+";";
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