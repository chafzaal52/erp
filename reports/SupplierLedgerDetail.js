var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Supplier Ledger Detail report worked");
});

router.get('/GetSupplierLedgerDetailReport/:POSID/:SupplierID/:FStartDate/:DateFrom/:DateTo/:FYear', function (req, res, next) {
    let POSID= req.params.POSID;
    let SupplierID= req.params.SupplierID;
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let FYear= req.params.FYear;
    let FStartDate= req.params.FStartDate;
    let query=" Select t.PayReceiptNo,t.InvoiceNo,t.ComInvDate,t.DiscountRate,t.DiscountAmt, t.SName, t.SAddress, t.SPhoneNo, t.vDate, t.ReferenceNo, IsNull(Sum(t.Pack), 0) Pack, IsNull(Sum(t.LoseShiper), 0) LoseShiper, t.ItHead, IsNull(Sum(t.Qty), 0) Qty, IsNull(Sum(t.Rate), 0) Rate,  ";
    query+=" IsNull(Sum(t.JrDr), 0) JrDR, IsNull(Sum(t.JrCr), 0) JrCr, IsNull(Sum(t.OBalance),0) OBalance, IsNull(Sum(t.Cr_Limit_Amount), 0) Cr_Limit_Amount, t.ToSr  From   ";
    query+=" (    ";
    query+=" (Select '' PayReceiptNo,''InvoiceNo,''ComInvDate,0 DiscountRate,0 DiscountAmt, SName, SAddress, SPhoneNo, '' vDate, '' ReferenceNo, 0 Pack, 0 LoseShiper, '' ItHead, 0 Qty, 0 Rate, 0 JrDR, 0 JrCr, IsNull(Sum(OBal),0) OBalance, 0 Cr_Limit_Amount, '' ToSr   ";
    query+=" From OBalance, USuppliers  Where USuppliers.SCode = "+SupplierID+"    ";
    if(POSID!="null"){
    query+=" And Obalance.Godownid = "+POSID+"  ";
    }
    query+=" And FYear = "+FYear+" And OBalance.AcNo = USuppliers.AcNo Group By SName, SAddress, SPhoneNo  )     ";
    query+=" Union All  (Select '' PayReceiptNo,''InvoiceNo,''ComInvDate,0 DiscountRate,0 DiscountAmt, SName, SAddress, SPhoneNo, '' vDate, '' ReferenceNo, 0 Pack, 0 LoseShiper, '' ItHead, 0 Qty, 0 Rate, 0 JrDR, 0 JrCr, (Sum(JrDr) - Sum(JrCr) ) OBalance, 0 Cr_Limit_Amount, '' ToSr   ";
    query+=" From Journal, JournalDt, USuppliers  Where USuppliers.SCode = "+SupplierID+"  ";
    if(POSID!="null"){
    query+=" And journal.posid = "+POSID+" ";
    }
    query+=" And Journal.JRTRANDATE >= '"+FStartDate+"' and  Convert(date,Journal.JRTRANDATE) < Convert(date,'"+DateFrom+"') And Journal.JrvId = JournalDt.JrvId And Journal.POSID = JournalDt.POSID  And JournalDt.AcNo = USuppliers.AcNo Group By SName, SAddress, SPhoneNo  )    ";
    query+=" Union All  (Select MaxNo PayReceiptNo,InvoiceNo,ComInvDate,DiscountRate,DiscountAmt, SName, SAddress, SPhoneNo, GDate vDate, IGRNM.Remarks  ReferenceNo, 0 Pack, 0 LoseShiper,IGRND.Itname + ' - ' + isnull(Cast((select BrandName from ibincard where ibincard.ItCode=IGRND.Itcode) As Varchar),'') + ' - ' + isnull(Cast((select LeastTime from ibincard where ibincard.ItCode=IGRND.Itcode) As Varchar),'') ItHead, isnull(Qty,AppQty) Qty,  ";
    query+=" CurrRate,  0 JrDR,Amount JrCr, 0 OBalance, Cr_Limit_Amount , ItemSrTo   ";
    query+=" From IGRNM_Pur IGRNM, IGRND_Pur IGRND, IItems, Usuppliers  Where IGRNM.GRNID = IGRND.GRNID and IGRNM.GodownId = IGRND.GodownId  And USuppliers.SCode = "+SupplierID+"  And IGRNM.PartyName = Usuppliers.SName And IGRND.ItCode = iItems.ItCode   ";
    if(POSID!="null"){
    query+=" And IGRNM.Godownid = "+POSID+" ";
    }
    query+=" And FYear = "+FYear+" And Convert(date,GDate) Between Convert(date,'"+DateFrom+"') And Convert(date,'"+DateTo+"')  )    ";
    query+=" Union All  (Select MaxNo PayReceiptNo,InvoiceNo,ComInvDate,DiscountRate,DiscountAmt, SName, SAddress, SPhoneNo, GDate vDate, IGRNM_Reversal.Remarks  ReferenceNo, 0 Pack, 0 LoseShiper, ItHead + ' - ' + Cast((select BrandName from ibincard where ibincard.ItCode=Itcode) As Varchar) + ' - ' + Cast((select LeastTime from ibincard where ibincard.ItCode=Itcode) As Varchar) ItHead, isnull(Qty,AppQty) Qty,  ";
    query+=" CurrRate,  Amount JrDR,0 JrCr, 0 OBalance, Cr_Limit_Amount , ItemSrTo   ";
    query+=" From IGRNM_Reversal, IGRND_Reversal, IItems, Usuppliers  Where IGRNM_Reversal.GRNID = IGRND_Reversal.GRNID and IGRNM_Reversal.GodownId = IGRND_Reversal.GodownId  And USuppliers.SCode = "+SupplierID+"   ";
    query+=" And IGRNM_Reversal.PartyName = Usuppliers.SName And IGRND_Reversal.ItCode = iItems.ItCode   ";
    if(POSID!="null"){
    query+=" And IGRNM_Reversal.godownid = "+POSID+" ";
    }
    query+=" And FYear = "+FYear+" And Convert(date,GDate) Between Convert(date,'"+DateFrom+"') And Convert(date,'"+DateTo+"')  )    ";
    query+=" Union All  (Select VoucherNo PayReceiptNo,''InvoiceNo,''ComInvDate,0 DiscountRate,0 DiscountAmt, SName, SAddress, SPhoneNo, Journal.JRTRANDATE vDate, chqno ReferenceNo, 0 Pack, 0 LoseShiper, JrParticular ItHead, 0 Qty, 0 Rate, JrDR, JrCr, 0 OBalance, 0 Cr_Limit_Amount, '' ToSr   ";
    query+=" From Journal, JournalDt, USuppliers  Where Journal.JrvId = JournalDt.JrvId     And USuppliers.SCode = "+SupplierID+"  And JournalDt.AcNo = USuppliers.AcNo  ";
    query+=" And JournalDt.JrvId Not In (Select JrvId From IGRNM_Pur IGRNM Where IGRNM.JrvId = JournalDt.JrvId and igrnm.GodownId = journaldt.POSID)  ";
    query+=" And JournalDt.JrvId Not In (Select IGRNM_Reversal.JrvId From IGRNM_Reversal Where IGRNM_Reversal.JrvId = JournalDt.JrvId and IGRNM_Reversal.GodownId = JournalDt.POSID)   ";
    if(POSID!="null"){
    query+=" And journal.posid = "+POSID+" ";
    }
    query+=" And Convert(date,Journal.JRTRANDATE) Between Convert(date,'"+DateFrom+"') And Convert(date,'"+DateTo+"') ) ";
    query+=" ) t ";
    query+=" Group By t.PayReceiptNo,t.InvoiceNo,t.ComInvDate,t.DiscountRate,t.DiscountAmt, t.SName, t.SAddress, t.SPhoneNo, t.vDate, t.ReferenceNo, t.ItHead, t.ToSr  Order By t.VDate, t.ItHead, t.ToSr ";
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