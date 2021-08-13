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
    let query="select * from FARM where CompanyID="+CompanyId+";";
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
    var query="select *  from FARM where ID="+Id+";";
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
        .input('ID',model.ID)
        .input('batchno',model.batchno)
        .input('MaxRowID',model.MaxRowID)
        .input('Assetcode',model.Assetcode)
        .input('AssetCatid',model.AssetCatid)
        .input('Assettitle',model.Assettitle)
        .input('AssetDesc',model.AssetDesc)
        .input('purchasedate',sql.DateTime,model.purchasedate)
        .input('deptcode',model.deptcode)
        .input('citiescode',model.citiescode)
        .input('placeid',model.placeid)
        .input('holdingtype',model.holdingtype)
        .input('purpose',model.purpose)
        .input('cost',model.cost)
        .input('comments',model.comments)
        .input('refno',model.refno)
        .input('fyear',model.fyear)
        .input('UserId',model.UserId)
        .input('transtype',model.transtype)
        .input('jrvid',model.jrvid)
        .input('isdispose',model.isdispose)
        .input('qty',model.qty)
        .input('acno',model.acno)
        .input('accdepcost',model.accdepcost)
        .input('isallocated',model.isallocated)
        .input('POSID',model.POSID)
        .input('CompanyID',model.CompanyID)
        .execute('sp_InsertUpdateFARM')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:Id', function (req, res, next) {
    let Id= req.params.Id;
    var query="delete from FARM where ID="+Id+";";
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