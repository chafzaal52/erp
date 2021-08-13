var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Purchase Return Worked properly");
});

router.get('/GetPurchaseReturn/:CompanyId/:POSID/:search', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let POSID= req.params.POSID;
    let search= req.params.search;
    let query="select top(80)GRNID,MaxNo,PartyName,InvoiceNo,GDate,DeliveryDate from IGRNM_Reversal where CompanyID="+CompanyId+" and GodownId="+POSID+" ";
    if(search!="null"){
        query+=" and (MaxNo like '%"+search+"%' or PartyName like '%"+search+"%' or InvoiceNo like '%"+search+"%')";
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
router.get('/GetList/:CompanyId', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let query="select * from IGRNM_Reversal where CompanyID="+CompanyId+";";
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
router.get('/GetPOSList/:CompanyId/:POSID', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let POSID= req.params.POSID;
    let query="select * from IGRNM_Reversal where CompanyID="+CompanyId+" and POSID="+POSID+";";
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
router.get('/GetById/:CompanyId/:GRNID', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let GRNID= req.params.GRNID;
    var query="select * from IGRNM_Reversal where CompanyID="+CompanyId+" and GRNID="+GRNID+";";
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
   router.get('/GetDetailByGRNID/:CompanyID/:GRNID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let GRNID= req.params.GRNID;
    var query="select *  from IGRND_Reversal where GRNID="+GRNID+" and CompanyID="+CompanyID+" ";
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
   
   router.get('/GetMaxNo/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    var query="select isnull(Max(GRNID),0)as MaxNo from IGRNM_Reversal where CompanyID="+CompanyID+"";
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
        .input('GRNID', model.GRNID)
        .input('GodownId', model.GodownId)
        .input('MaxNo', model.MaxNo)
        .input('IGPNO', model.IGPNO)
        .input('IGPID', model.IGPID)
        .input('Igptype', model.Igptype)
        .input('GrnType', model.GrnType)
        .input('QualityAssid', model.QualityAssid)
        .input('MaxQualityAssid', model.MaxQualityAssid)
        .input('fyear', model.fyear)
        .input('QltyAssType', model.QltyAssType)
        .input('PartyName', model.PartyName)
        .input('InvoiceNo', model.InvoiceNo)
        .input('MaxPrno', model.MaxPrno)
        .input('PRNo', model.PRNo)
        .input('MaxPonO', model.MaxPonO)
        .input('POno', model.POno)
        .input('LCNoId', model.LCNoId)
        .input('LCNo', model.LCNo)
        .input('GDate', sql.DateTime, model.GDate)
        .input('Remarks', model.Remarks)
        .input('DeliveryNo', model.DeliveryNo)
        .input('DeliveryDate', sql.DateTime, model.DeliveryDate)
        .input('WithDiscountStatus', model.WithDiscountStatus)
        .input('IsTaxAble', model.IsTaxAble)
        .input('VType', model.VType)
        .input('Jrvid', model.Jrvid)
        .input('Jrvno', model.Jrvno)
        .input('UserID', model.UserID)
        .input('AppStatus', model.AppStatus)
        .input('Freight', model.Freight)
        .input('MiscExpenses', model.MiscExpenses)
        .input('discount', model.discount)
        .input('CancelStatus', model.CancelStatus)
        .input('ReportStatus', model.ReportStatus)
        .input('mahstatus', model.mahstatus)
        .input('TPayment', model.TPayment)
        .input('ComInvDate', sql.DateTime, model.ComInvDate)
        .input('Country', model.Country)
        .input('MDate', sql.DateTime, model.MDate)
        .input('PerformaId', model.PerformaId)
        .input('PerFormaNo', model.PerFormaNo)
        .input('IpoId', model.IpoId)
        .input('IPONo', model.IPONo)
        .input('IPrID', model.IPrID)
        .input('IPrNo', model.IPrNo)
        .input('currency', model.currency)
        .input('fcamount', model.fcamount)
        .input('exchrate', model.exchrate)
        .input('BENo', model.BENo)
        .input('RecdDate', sql.DateTime, model.RecdDate)
        .input('BillNo', model.BillNo)
        .input('RetStatus', model.RetStatus)
        .input('RetRef', model.RetRef)
        .input('Isapproved', model.Isapproved)
        .input('RetJrvid', model.RetJrvid)
        .input('GRNIDMain', model.GRNIDMain)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateIGRNM_Reversal')
    }).then(result => {
        maxid = result.recordset[0].MaxID
        res.send(""+maxid+"");
    }).catch(err => {
        res.send({ err });
    })
});
router.post('/InsertDetail', function (req, res, next) {
    var model= req.body;
    sql.connect(config).then(response => {
        return response.request()
        .input('GRNID', model.GRNID)
        .input('ItCode', model.ItCode)
        .input('Itname', model.Itname)
        .input('UnitCode', model.UnitCode)
        .input('Qty', model.Qty)
        .input('AppQty', model.AppQty)
        .input('RejQty', model.RejQty)
        .input('PrevRate', model.PrevRate)
        .input('PoRate', model.PoRate)
        .input('CurrRate', model.CurrRate)
        .input('Amount', model.Amount)
        .input('STRate', model.STRate)
        .input('STaxPayable', model.STaxPayable)
        .input('IncSTax', model.IncSTax)
        .input('OpStock', model.OpStock)
        .input('GrnStock', model.GrnStock)
        .input('Remarks', model.Remarks)
        .input('PoQtyT', model.PoQtyT)
        .input('PoUnitT', model.PoUnitT)
        .input('PoRateT', model.PoRateT)
        .input('MRrate', model.MRrate)
        .input('mAmount', model.mAmount)
        .input('CDuty', model.CDuty)
        .input('IsTax', model.IsTax)
        .input('AITax', model.AITax)
        .input('MisExp', model.MisExp)
        .input('OVReceive', model.OVReceive)
        .input('ShReceive', model.ShReceive)
        .input('DeReceive', model.DeReceive)
        .input('netqty', model.netqty)
        .input('BLQty', model.BLQty)
        .input('TPackages', model.TPackages)
        .input('InvQty', model.InvQty)
        .input('InvMrQtyDif', model.InvMrQtyDif)
        .input('IBondQty', model.IBondQty)
        .input('EBondQty', model.EBondQty)
        .input('siteid', model.siteid)
        .input('GodownId', model.GodownId)
        .input('ItemSrFrom', model.ItemSrFrom)
        .input('ItemSrTo', model.ItemSrTo)
        .input('Classification', model.Classification)
        .input('DiscountRate', model.DiscountRate)
        .input('DiscountAmt', model.DiscountAmt)
        .input('isReturn', model.isReturn)
        .input('ExpDate', sql.DateTime, model.ExpDate)
        .input('bonsQty', model.bonsQty)
        .input('CompanyID', model.CompanyID)
        .input('ProjectID', model.ProjectID)
        .execute('sp_InsertUpdateIGRND_Reversal')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:GRNID/:CompanyID', function (req, res, next) {
    let GRNID= req.params.GRNID;
    let CompanyID= req.params.CompanyID;
    var query="delete from IGRND_Reversal where GRNID="+GRNID+" and CompanyID="+CompanyID+"; delete from IGRNM_Reversal where GRNID="+GRNID+" and CompanyID="+CompanyID+" ";
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
router.delete('/DeleteDetail/:GRNID/:CompanyID', function (req, res, next) {
    let GRNID= req.params.GRNID;
    let CompanyID= req.params.CompanyID;
    var query="delete from IGRND_Reversal where GRNID="+GRNID+" and CompanyID="+CompanyID+" ";
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