var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Service Sale Invoice Work properly");
});

router.get('/GetMaxNo/:CompanyID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    var query=" select isnull(MAX(MaxNo),0) maxno from IGRNM_SSal where CompanyID="+CompanyID;
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
   router.get('/AlreadyExist/:CompanyID/:maxno', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let maxno= req.params.maxno;
    var query="select isnull(count(MaxNo),0) maxno from IGRNM_SSal where MaxNo="+maxno+" and CompanyID="+CompanyID;
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
router.get('/GetList/:CompanyID/:Search', function (req, res, next) {
    var CompanyID= req.params.CompanyID;
    var Search= req.params.Search;
    let query="select GRNID,MaxNo,PartyName,InvoiceNo,GDate from IGRNM_SSal ";
    query+=" where CompanyID="+CompanyID+" ";
    if(Search!="null"){
    query+=" and (MaxNo like '%"+Search+"%' or PartyName like '%"+Search+"%' or InvoiceNo like '%"+Search+"%') ";
    }
    query+=" order by GRNID desc";
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
    var query="select *  from IGRNM_SSal where GRNID="+Id+";";
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
    var query="select *  from IGRND_SSal where GRNID="+Id+";";
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
        .input('PCode', model.PCode)
        .input('PartyName', model.PartyName)
        .input('InvoiceNo', model.InvoiceNo)
        .input('MaxPrno', model.MaxPrno)
        .input('PRNo', model.PRNo)
        .input('MaxPonO', model.MaxPonO)
        .input('POno', model.POno)
        .input('LCNoId', model.LCNoId)
        .input('LCNo', model.LCNo)
        .input('GDate', model.GDate)
        .input('Remarks', model.Remarks)
        .input('DeliveryNo', model.DeliveryNo)
        .input('DeliveryDate', model.DeliveryDate)
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
        .input('EntryType', model.EntryType)
        .input('ExternalIssue', model.ExternalIssue)
        .input('AmountReceived', model.AmountReceived)
        .input('approveBy', model.approveBy)
        .input('deptcode', model.deptcode)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateIGRNM_SSal')
    }).then(result => {
        maxid= result.recordset[0].MaxID;
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
        .input('AcNo', model.AcNo)
        .input('AcHead', model.AcHead)
        .input('STaxAcNo', model.STaxAcNo)
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
        .input('bonsQty', model.bonsQty)
        .input('ExpDate', sql.DateTime, model.ExpDate)
        .input('MfgDate', sql.DateTime, model.MfgDate)
        .input('GRNIDMain', model.GRNIDMain)
        .input('WeigthQty', model.WeigthQty)
        .input('RateApplyOn', model.RateApplyOn)
        .input('ApplyRate', model.ApplyRate)
        .input('RateAfterDis', model.RateAfterDis)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertIGRND_SSal')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/DeleteDetail/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from IGRND_SSal where GRNID="+Id+";";
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
router.delete('/Delete/:Id', function (req, res, next) {
    var Id= req.params.Id;
    var query="delete from IGRND_SSal where GRNID="+Id+"; delete from IGRNM_SSal where GRNID="+Id+";";
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