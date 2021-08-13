var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Customer Ledger Detail report worked");
});

router.get('/GetCustomerLedgerDetailReport/:POSID/:CustomerID/:FStartDate/:DateFrom/:DateTo/:FYear', function (req, res, next) {
    let POSID= req.params.POSID;
    let CustomerID= req.params.CustomerID;
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let FYear= req.params.FYear;
    let FStartDate= req.params.FStartDate;
    let query=" Select t.PayReceiptNo,t.InvRefNo, PayDateTime,isnull(t.DiscountRate,0) as DiscountRate,isnull(t.DiscountAmt,0) as DiscountAmt, t.VenderName, t.VenderAddress, t.PhoneNo, t.vDate, t.ReferenceNo, IsNull(Sum(t.Pack), 0) Pack, IsNull(Sum(t.LoseShiper), 0) LoseShiper, t.ItHead, IsNull(Sum(t.Qty), 0) Qty, IsNull(Sum(t.Rate), 0) Rate, ";
    query+=" IsNull(Sum(t.JrDr), 0) JrDR, IsNull(Sum(t.JrCr), 0) JrCr, IsNull(Sum(t.OBalance),0) OBalance, IsNull(Sum(t.Cr_Limit_Amount), 0) Cr_Limit_Amount, t.ToSr, ";
    query+=" isnull((select top 3 vcode from uvendorsdefm vm where vm.VenderName=t.VenderName),'')VCode  From  (  (Select '' PayReceiptNo,'' InvRefNo,''PayDateTime,0 DiscountRate,0 DiscountAmt, VenderName, VenderAddress, PhoneNo, '' vDate, '' ReferenceNo, 0 Pack, 0 LoseShiper, '' ItHead, ";
    query+=" 0 Qty, 0 Rate, 0 JrDR, 0 JrCr, IsNull(Sum(OBal),0) OBalance, 0 Cr_Limit_Amount, '' ToSr   ";
    query+=" From OBalance, UVendorsDefM  Where UVendorsDefM.VenderId = "+CustomerID+"   ";
    if(POSID!="null"){
    query+=" And Obalance.Godownid = "+POSID+"  ";
    }
    query+=" And FYear = "+FYear+" And OBalance.AcNo = UVendorsDefM.AcNo Group By VenderName, VenderAddress, PhoneNo )    ";
    query+=" Union All  (Select '' PayReceiptNo,'' InvRefNo,'' PayDateTime,0 DiscountRate,0 DiscountAmt, VenderName, VenderAddress, PhoneNo, '' vDate, '' ReferenceNo, 0 Pack, 0 LoseShiper, '' ItHead, 0 Qty, 0 Rate, 0 JrDR, 0 JrCr,(Sum(JrDr) - Sum(JrCr) ) OBalance, 0 Cr_Limit_Amount, '' ToSr   ";
    query+=" From Journal, JournalDt, UVendorsDefM  Where UVendorsDefM.VenderId = "+CustomerID+"  ";
    if(POSID!="null"){
    query+=" And journal.posid = "+POSID+"  ";   
    }
    query+=" And JOURNAL.JRTRANDATE >=  '"+FStartDate+"' And Convert(date,JOURNAL.JRTRANDATE) < Convert(date,'"+DateFrom+"') And Journal.JrvId = JournalDt.JrvId   ";
    query+=" And Journal.POSID = JournalDt.POSID   And JournalDt.AcNo = UVendorsDefM.AcNo Group By VenderName, VenderAddress, PhoneNo  )    ";
    query+=" union all(Select PayReceiptNo,InvRefNo,PayDateTime,DiscountRate,DiscountAmt, VenderName, VenderAddress, PhoneNo, TrnasDate vDate, Note ReferenceNo ,ISNULL((select top 1 Pack from Ord_Ship_D where Ord_Ship_D.Ord_id = ARM_PAYMENT_M.Ship_MaxId and ARM_PAYMENT_M.POSID = Ord_Ship_d.Posid and Ord_Ship_D.Itcode = ARM_Payment_D.ItCode and Ord_Ship_D.SrNo = ARM_Payment_d.fromSr),0)Pack , ";
    query+=" ISNULL((select top 3 isnull(LoseShiper,0) from Ord_Ship_D where Ord_Ship_D.Ord_id = ARM_PAYMENT_M.Ship_MaxId and ARM_PAYMENT_M.POSID = Ord_Ship_d.Posid and Ord_Ship_D.Itcode = ARM_Payment_D.ItCode  ";
    query+=" and Ord_Ship_D.SrNo = ARM_Payment_d.fromSr),0) LoseShiper ,ItHead + ' - ' + Cast((select BrandName from ibincard where itcode=ARM_PAYMENT_D.ItCode) As Varchar) + '  - ' + Cast((select LeastTime from ibincard where itcode=ARM_PAYMENT_D.ItCode) As Varchar) ItHead, ARM_PAYMENT_D.Qty, ARM_PAYMENT_D.Rate , ";
    query+=" ARM_PAYMENT_D.TotAmt JrDR, 0 JrCr, 0 OBalance, Cr_Limit_Amount, fromSr   ";
    query+=" From ARM_PAYMENT_M, ARM_PAYMENT_D, UVendorsDefM, IItems   Where ARM_PAYMENT_M.PayId = ARM_PAYMENT_D.PayId and ARM_PAYMENT_M.POSID = ARM_PAYMENT_D.WhID and ARM_Payment_M.isreversed = 0  ";
    query+=" and UVendorsDefM.VenderId = "+CustomerID+" And ARM_PAYMENT_M.DistributorID = UVendorsDefM.VenderId  And ARM_PAYMENT_D.ItCode = iItems.ItCode   ";
    if(POSID!="null"){
    query+=" And arm_payment_M.posid = "+POSID+" ";
    }
    query+=" And Convert(date,TrnasDate)  Between Convert(date,'"+DateFrom+"') And Convert(date,'"+DateTo+"'))   ";
    query+=" Union all(Select PayReceiptNo,InvRefNo,PayDateTime,0 DiscountRate,0 DiscountAmt, VenderName, VenderAddress, PhoneNo, TrnasDate vDate, Note ReferenceNo ,0 Pack ,0 LoseShiper , ";
    query+=" ItHead + '  - ' + Cast((select BrandName from ibincard where itcode=ARM_Payment_Reversal_D.ItCode) As Varchar) + ' - ' + Cast((select BrandName from ibincard where itcode=ARM_Payment_Reversal_D.ItCode) As Varchar) ItHead, ARM_Payment_Reversal_D.Qty, ARM_Payment_Reversal_D.Rate , ";
    query+=" 0  JrDR,ARM_Payment_Reversal_D.Qty * ARM_Payment_Reversal_D.Rate JrCr, 0 OBalance, Cr_Limit_Amount, fromSr    ";
    query+=" From ARM_Payment_Reversal , ARM_Payment_Reversal_D , UVendorsDefM, IItems    ";
    query+=" Where ARM_Payment_Reversal.ReversalID = ARM_Payment_Reversal_D.ReversalID and ARM_Payment_Reversal.POSID = ARM_Payment_Reversal_D.WhID  ";
    query+=" and UVendorsDefM.VenderId = "+CustomerID+" And ARM_Payment_Reversal.DistributorID = UVendorsDefM.VenderId  And ARM_Payment_Reversal_D.ItCode = iItems.ItCode  and ISNULL(ARM_Payment_Reversal.isreversed,0) = 0   ";
    if(POSID!="null"){
    query+=" And Arm_Payment_Reversal.posid ="+POSID+" "; 
    }
    query+=" And Convert(date,TrnasDate)  Between Convert(date,'"+DateFrom+"') And Convert(date,'"+DateTo+"'))    ";
    query+=" Union All  (Select VoucherNo PayReceiptNo,'' InvRefNo,0 PayDateTime,0 DiscountRate,0 DiscountAmt, VenderName, VenderAddress, PhoneNo, Journal.JRTRANDATE vDate, CHQNo ReferenceNo, 0 Pack, 0 LoseShiper, JrParticular ItHead, 0 Qty, 0 Rate, JrDR, JrCr, ";
    query+=" 0 OBalance, 0 Cr_Limit_Amount, '' ToSr    ";
    query+=" From Journal, JournalDt, UVendorsDefM  Where Journal.JrvId = JournalDt.JrvId  And Journal.POSID = JournalDt.POSID   ";
    query+=" And UVendorsDefM.VenderId = "+CustomerID+" And JournalDt.AcNo = UVendorsDefM.AcNo     And JournalDt.JrvId Not In (Select ARM_PAYMENT_M.JrvId From ARM_PAYMENT_M Where ARM_PAYMENT_M.JrvId = JournalDt.JrvId ";
    query+=" and ARM_PAYMENT_M.POSID = JournalDt.POSID) And JournalDt.JrvId Not In (Select ARM_Payment_Reversal.JrvId From ARM_Payment_Reversal Where ARM_Payment_Reversal.JrvId = JournalDt.JrvId and ARM_Payment_Reversal.POSID = JournalDt.POSID) ";
    if(POSID!="null"){
    query+=" And journal.posid = "+POSID+" ";
    }
    query+=" And Convert(date,Journal.JRTRANDATE) Between Convert(date,'"+DateFrom+"') And Convert(date,'"+DateTo+"'))    ";
    query+=" ) t  ";
    query+=" Group By t.PayReceiptNo,t.InvRefNo,t.PayDateTime,t.DiscountRate,t.DiscountAmt, t.VenderName, t.VenderAddress, t.PhoneNo, t.vDate, t.ReferenceNo, t.ItHead, t.ToSr  Order By t.VDate, t.ItHead, t.ToSr ";
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
module.exports = router;