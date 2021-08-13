var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Sale Return Worked properly");
});

router.get('/GetSaleReturn/:CompanyId/:POSID/:search', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let POSID= req.params.POSID;
    let search= req.params.search;
    let query="select top(80)ReversalID,PayID,PaySlipNo,POSID,PayDateTime,CustomerName,Fyear,Sales_Type,CancelStatus from ARM_Payment_Reversal where CompanyID="+CompanyId+" and POSID="+POSID+" ";
    if(search!="null"){
        query+=" and (PaySlipNo like '%"+search+"%' or CustomerName like '%"+search+"%' and Fyear like '%"+search+"%' and Sales_Type like '%"+search+"%')";
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
    let query="select * from ARM_Payment_Reversal where CompanyID="+CompanyId+";";
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
    let query="select * from ARM_Payment_Reversal where CompanyID="+CompanyId+" and POSID="+POSID+";";
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
router.get('/GetById/:CompanyId/:ReversalID', function (req, res, next) {
    let CompanyId= req.params.CompanyId;
    let ReversalID= req.params.ReversalID;
    var query="select * from ARM_Payment_Reversal where CompanyID="+CompanyId+" and ReversalID="+ReversalID+";";
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
   router.get('/GetDetailByReversalID/:CompanyID/:ReversalID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let ReversalID= req.params.ReversalID;
    var query="select * from ARM_Payment_Reversal_D where ReversalID="+ReversalID+" and CompanyID="+CompanyID+" ";
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
    var query="select isnull(Count(ReversalID),0) as PaySlipNo,isnull(MAX(PayID),0) as PayID, isnull(Max(ReversalID),0) as ReversalID from ARM_Payment_Reversal where CompanyID="+CompanyID+"";
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
        .input('ReversalID', model.ReversalID)
        .input('PayID', model.PayID)
        .input('PayReceiptNo', model.PayReceiptNo)
        .input('PaySlipNo', model.PaySlipNo)
        .input('POSID', model.POSID)
        .input('PayDateTime', sql.DateTime, model.PayDateTime)
        .input('Userid', model.Userid)
        .input('Note', model.Note)
        .input('NetPayable', model.NetPayable)
        .input('PaidAmount', model.PaidAmount)
        .input('Fyear', model.Fyear)
        .input('ReceivedBy', model.ReceivedBy)
        .input('Jrvid', model.Jrvid)
        .input('CancelStatus', model.CancelStatus)
        .input('CustomerName', model.CustomerName)
        .input('isdistributer', model.isdistributer)
        .input('DistributorID', model.DistributorID)
        .input('InvRefNo', model.InvRefNo)
        .input('PayReasonID', model.PayReasonID)
        .input('RecdAmount', model.RecdAmount)
        .input('Paymode', model.Paymode)
        .input('BChqNo', model.BChqNo)
        .input('BAccID', model.BAccID)
        .input('Bname', model.Bname)
        .input('BBrAdd', model.BBrAdd)
        .input('CCardNo', model.CCardNo)
        .input('CExpiryDate', sql.DateTime, model.CExpiryDate)
        .input('CVerifiCode', model.CVerifiCode)
        .input('CAuthCode', model.CAuthCode)
        .input('Company', model.Company)
        .input('isreversed', model.isreversed)
        .input('RevUserID', model.RevUserID)
        .input('revDate', sql.DateTime, model.revDate)
        .input('RevAmt', model.RevAmt)
        .input('CurrID', model.CurrID)
        .input('ExchRate', model.ExchRate)
        .input('ConvAmt', model.ConvAmt)
        .input('shiftid', model.shiftid)
        .input('TrnasDate', sql.DateTime, model.TrnasDate)
        .input('ReferenceNo', model.ReferenceNo)
        .input('Cashierid', model.Cashierid)
        .input('isApproved', model.isApproved)
        .input('IsPrepaid', model.IsPrepaid)
        .input('Order_ID', model.Order_ID)
        .input('TargetWalletId', model.TargetWalletId)
        .input('CustomerType', model.CustomerType)
        .input('SID', model.SID)
        .input('DID', model.DID)
        .input('VehicleNo', model.VehicleNo)
        .input('MembershipNO', model.MembershipNO)
        .input('Cash_Amt', model.Cash_Amt)
        .input('Chq_Amt', model.Chq_Amt)
        .input('Cr_Card_Amt', model.Cr_Card_Amt)
        .input('Adv_Amt', model.Adv_Amt)
        .input('Adv_Ref_No', model.Adv_Ref_No)
        .input('Bank_GL_Code', model.Bank_GL_Code)
        .input('deductamt', model.deductamt)
        .input('Sales_Type', model.Sales_Type)
        .input('Sales_Type_id', model.Sales_Type_id)
        .input('isTaxable', model.isTaxable)
        .input('AmountReceived', model.AmountReceived)
        .input('BonusReturnOnly', model.BonusReturnOnly)
        .input('deptcode', model.deptcode)
        .input('StoreID', model.StoreID)
        .input('CompanyID', model.CompanyID)
        .execute('sp_InsertUpdateARM_Payment_Reversal')
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
        .input('PayID', model.PayID)
        .input('ServiceID', model.ServiceID)
        .input('MSISDN', model.MSISDN)
        .input('Qty', model.Qty)
        .input('fromSr', model.fromSr)
        .input('ToSr', model.ToSr)
        .input('Rate', model.Rate)
        .input('Gross', model.Gross)
        .input('DiscountRate', model.DiscountRate)
        .input('DiscountAmt', model.DiscountAmt)
        .input('TotTax', model.TotTax)
        .input('TotAmt', model.TotAmt)
        .input('ItCode', model.ItCode)
        .input('WhTAmt', model.WhTAmt)
        .input('InvoiceValue', model.InvoiceValue)
        .input('WhID', model.WhID)
        .input('DiscTypeid', model.DiscTypeid)
        .input('Classification', model.Classification)
        .input('ReversalID', model.ReversalID)
        .input('ExpDate', sql.DateTime, model.ExpDate)
        .input('BonusQty', model.BonusQty)
        .input('RetReason', model.RetReason)
        .input('cgs', model.cgs)
        .input('CompanyID', model.CompanyID)
        .input('ProjectID', model.ProjectID)
        .execute('sp_InsertARM_Payment_Reversal_D')
    }).then(result => {
        res.send("Success");
    }).catch(err => {
        res.send({ err });
    })
});
router.delete('/Delete/:ReversalID/:CompanyID', function (req, res, next) {
    let ReversalID= req.params.ReversalID;
    let CompanyID= req.params.CompanyID;
    var query="delete from ARM_Payment_Reversal_D where ReversalID="+ReversalID+" and CompanyID="+CompanyID+"; delete from ARM_Payment_Reversal where ReversalID="+ReversalID+" and CompanyID="+CompanyID+"; ";
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
router.delete('/DeleteDetail/:ReversalID/:CompanyID', function (req, res, next) {
    let ReversalID= req.params.ReversalID;
    let CompanyID= req.params.CompanyID;
    var query="delete from ARM_Payment_Reversal_D where ReversalID="+ReversalID+" and CompanyID="+CompanyID+"; ";
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