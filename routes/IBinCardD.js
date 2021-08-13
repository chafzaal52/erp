var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("IBinCardD work properly");
});


router.get('/GetList/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let query="select * from IBinCardD where CompanyID="+CompanyID;
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
    var query="select *  from IBinCardD where Code="+Id+";";/////////////////
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
        .input('ID', model.IBinCardD_ID)
        .input('BinCardId', model.BinCardId)
        .input('ITCode', model.ITCode)
        .input('GodownId', model.GodownId)
        .input('OpnBalance', model.OpnBalance)
        .input('ItemFrom', model.ItemFrom)
        .input('ItemTo', model.ItemTo)
        .input('FaultyQty', model.FaultyQty)
        .input('FaultyItemFrom', model.FaultyItemFrom)
        .input('FaultyItemTo', model.FaultyItemTo)
        .input('UsedQty', model.UsedQty)
        .input('UsedItemFrom', model.UsedItemFrom)
        .input('UsedItemTo', model.UsedItemTo)
        .input('PurchasePrice', model.PurchasePrice)
        .input('Classification', model.Classification)
        .input('transdate', sql.DateTime, model.transdate)
        .input('ExpiryDate', sql.DateTime, model.ExpiryDate)
        .input('Assay', model.Assay)
        .input('CompanyID', model.CompanyID)
        .input('Fyear', model.Fyear)
        .execute('sp_InsertUpdateIBinCardD')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/IbinCardDBulkImport', function (req, res, next) {
    const model= req.body;
    let query="";
    model.forEach(element => {
        const entryDate= new Date(element.transdate).toISOString().slice(0,10);
        const expDate= new Date(element.ExpiryDate).toISOString().slice(0,10);
        query+=" INSERT INTO [dbo].[IBinCardD]([BinCardId],[ITCode],[GodownId],[OpnBalance],[ItemFrom],[ItemTo],[FaultyQty],[FaultyItemFrom],[FaultyItemTo],[UsedQty],[UsedItemFrom],[UsedItemTo],[PurchasePrice],[Classification],[transdate],[ExpiryDate],[Assay],[CompanyID],[Fyear]) ";
        query+=" VALUES ";
        query+=" ("+element.BinCardId+" ";
        query+=" ,"+element.ITCode+" ";
        query+=" ,"+element.GodownId+" ";
        query+=" ,"+element.OpnBalance+" ";
        query+=" ,"+element.ItemFrom+" ";
        query+=" ,"+element.ItemTo+" ";
        query+=" ,"+element.FaultyQty+" ";
        query+=" ,"+element.FaultyItemFrom+" ";
        query+=" ,"+element.FaultyItemTo+" ";
        query+=" ,"+element.UsedQty+" ";
        query+=" ,"+element.UsedItemFrom+" ";
        query+=" ,"+element.UsedItemTo+" ";
        query+=" ,"+element.PurchasePrice+" ";
        query+=" ,"+element.Classification+" ";
        query+=" ,'"+ entryDate+"' ";
        query+=" ,'"+ expDate+"' ";
        query+=" ,"+element.Assay+" ";
        query+=" ,"+element.CompanyID+" ";
        query+=" ,"+element.Fyear+");";
    });
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Item Stock Bulk Import Successfully Saved.");
                    })
                    .catch(function (error) {
                      response.send(error.message);
                    })
    })
    .catch(function(err){
        response.send(err.message);     
    }); 
});
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from PackingUnit where Code="+Id+";";////////////
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