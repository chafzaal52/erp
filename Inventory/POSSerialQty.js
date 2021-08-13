var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("POSSerialQty worked properly");
});


router.get('/GetItemQtyDetailSingleBatch/:CompanyId/:ItCode/:SrNo', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let ItCode= req.params.ItCode;
    //let FYear= req.params.FYear;
    let SrNo= req.params.SrNo;
    let query="select * from [POSSerialQty] where CompanyID="+CompanyId+" and ItCode="+ItCode+" and isnull(srno,'')="+SrNo+" order by ExpDate";
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
router.get('/GetItemQtyDetail/:CompanyId/:ItCode/:SrNo', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let ItCode= req.params.ItCode;
    //let FYear= req.params.FYear;
    let SrNo= req.params.SrNo;
    let query="";
    if(SrNo=="null"){
        query="select * from [POSSerialQty] where CompanyID="+CompanyId+" and isnull(SrNo,'')='' and ItCode="+ItCode+" order by ExpDate";
    }
    else{
        query="select * from [POSSerialQty] where CompanyID="+CompanyId+" and SrNo="+SrNo+" and ItCode="+ItCode+" order by ExpDate";
    }
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
        .input('WhId', model.WhId)
        .input('ItCode', model.ItCode)
        .input('SrNo', model.SrNo)
        .input('Iform', model.Iform)
        .input('RecRef', model.RecRef)
        .input('ItRate', model.ItRate)
        .input('TransDone', model.TransDone)
        .input('Classification', model.Classification)
        .input('Transdate', sql.DateTime, model.Transdate)
        .input('ExpDate', sql.DateTime, model.ExpDate)
        .input('Qty', model.Qty)
        .input('Assay', model.Assay)
        .input('CompanyID', model.CompanyID)
        .input('FYear', model.FYear)
        .execute('sp_InsertUpdatePOSSerialQty')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/BulkImport', function (req, res, next) {
    const model= req.body;
    let query="";
    model.forEach(element => {
        const entryDate= new Date(element.Transdate).toISOString().slice(0,10);
        const expDate= new Date(element.ExpDate).toISOString().slice(0,10);
        query+=" exec sp_InsertUpdatePOSSerialQty "+element.WhId+","+element.ItCode+",'"+element.SrNo+"','"+element.Iform+"','"+element.RecRef+"',"+element.ItRate+","+element.TransDone+",'"+element.Classification+"','"+entryDate+"','"+expDate+"',"+element.Qty+","+element.Assay+","+element.CompanyID+","+element.FYear+"; ";
    });
    sql.connect(config).then(function (connection) {   
    new sql.Request(connection)
                    .query(query)
                    .then(function (dbData) {
                        res.send("Item Bulk Import Successfully Saved.");
                    })
                    .catch(function (error) {
                      response.send(error.message);
                    })
    })
    .catch(function(err){
        response.send(err.message);     
    }); 
});

module.exports = router;