var express = require('express');
var router = express.Router();

const connectionString=  require('./db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Common DDL Work properly");
});

//Business Unit
router.get('/Get/:CompanyID/:POSID', function (req, res, next) {
    let CompanyID= req.params.CompanyID;
    let POSID= req.params.POSID;
    let query="";
    //start PO(0)
    if(POSID!="null"){
    query+=" select (select count(PONO) from PPOM where CompanyID="+CompanyID+" and GodownId="+POSID+" and CONVERT(date,PoDate) between CONVERT(date,GETDATE()-30) and CONVERT(date,GETDATE())) as PO30, ";
    query+=" (select count(PONO) from PPOM where CompanyID="+CompanyID+" and GodownId="+POSID+" and CONVERT(date,PoDate) between CONVERT(date,GETDATE()-6) and CONVERT(date,GETDATE())) as PO7, ";
    query+=" (select count(PONO) from PPOM where CompanyID="+CompanyID+" and GodownId="+POSID+" and CONVERT(date,PoDate)=CONVERT(date,GETDATE())) as POtoday; ";
    }
    else{
        query+=" select (select count(PONO) from PPOM where CompanyID="+CompanyID+" and CONVERT(date,PoDate) between CONVERT(date,GETDATE()-30) and CONVERT(date,GETDATE())) as PO30, ";
        query+=" (select count(PONO) from PPOM where CompanyID="+CompanyID+" and CONVERT(date,PoDate) between CONVERT(date,GETDATE()-6) and CONVERT(date,GETDATE())) as PO7, ";
        query+=" (select count(PONO) from PPOM where CompanyID="+CompanyID+" and CONVERT(date,PoDate)=CONVERT(date,GETDATE())) as POtoday; ";
    }
    //End(0)
    //Start GRN(1)
    if(POSID!="null"){
        query+=" select (select count(GRNID) from IGRNM where CompanyID="+CompanyID+" and GodownId="+POSID+" and CONVERT(date,GDate) between CONVERT(date,GETDATE()-30) and CONVERT(date,GETDATE())) as GRN30, ";
        query+=" (select count(GRNID) from IGRNM where CompanyID="+CompanyID+" and GodownId="+POSID+" and CONVERT(date,GDate) between CONVERT(date,GETDATE()-6) and CONVERT(date,GETDATE())) as GRN7, ";
        query+=" (select count(GRNID) from IGRNM where CompanyID="+CompanyID+" and GodownId="+POSID+" and CONVERT(date,GDate)=CONVERT(date,GETDATE())) as GRNtoday; ";
    }
    else{
        query+=" select (select count(GRNID) from IGRNM where CompanyID="+CompanyID+" and CONVERT(date,GDate) between CONVERT(date,GETDATE()-30) and CONVERT(date,GETDATE())) as GRN30, ";
        query+=" (select count(GRNID) from IGRNM where CompanyID="+CompanyID+" and CONVERT(date,GDate) between CONVERT(date,GETDATE()-6) and CONVERT(date,GETDATE())) as GRN7, ";
        query+=" (select count(GRNID) from IGRNM where CompanyID="+CompanyID+" and CONVERT(date,GDate)=CONVERT(date,GETDATE())) as GRNtoday; ";
    }
    //End (1)
    //Start SO(2)
    if(POSID!="null"){
        query+=" select (select count(S_Ord_id) from SOrd_M where CompanyID="+CompanyID+" and Posid="+POSID+" and CONVERT(date,SOrdDate) between CONVERT(date,GETDATE()-30) and CONVERT(date,GETDATE())) as SO30, ";
        query+=" (select count(S_Ord_id) from SOrd_M where CompanyID="+CompanyID+" and Posid="+POSID+" and CONVERT(date,SOrdDate) between CONVERT(date,GETDATE()-6) and CONVERT(date,GETDATE())) as SO7, ";
        query+=" (select count(S_Ord_id) from SOrd_M where CompanyID="+CompanyID+" and Posid="+POSID+" and CONVERT(date,SOrdDate)=CONVERT(date,GETDATE())) as SOtoday; ";
    }
    else{
        query+=" select (select count(S_Ord_id) from SOrd_M where CompanyID="+CompanyID+" and CONVERT(date,SOrdDate) between CONVERT(date,GETDATE()-30) and CONVERT(date,GETDATE())) as SO30, ";
        query+=" (select count(S_Ord_id) from SOrd_M where CompanyID="+CompanyID+" and CONVERT(date,SOrdDate) between CONVERT(date,GETDATE()-6) and CONVERT(date,GETDATE())) as SO7, ";
        query+=" (select count(S_Ord_id) from SOrd_M where CompanyID="+CompanyID+" and CONVERT(date,SOrdDate)=CONVERT(date,GETDATE())) as SOtoday; ";
    }
    //End (2)
    //Start DC(3)
    if(POSID!="null"){
        query+=" select (select count(Ord_id) from Ord_Ship_M where CompanyID="+CompanyID+" and Posid="+POSID+" and CONVERT(date,EDate) between CONVERT(date,GETDATE()-30) and CONVERT(date,GETDATE())) as DC30, ";
        query+=" (select count(Ord_id) from Ord_Ship_M where CompanyID="+CompanyID+" and Posid="+POSID+" and CONVERT(date,EDate) between CONVERT(date,GETDATE()-6) and CONVERT(date,GETDATE())) as DC7, ";
        query+=" (select count(Ord_id) from Ord_Ship_M where CompanyID="+CompanyID+" and Posid="+POSID+" and CONVERT(date,EDate)=CONVERT(date,GETDATE())) as DCtoday; ";
    }
    else{
        query+=" select (select count(Ord_id) from Ord_Ship_M where CompanyID="+CompanyID+" and CONVERT(date,EDate) between CONVERT(date,GETDATE()-30) and CONVERT(date,GETDATE())) as DC30, ";
        query+=" (select count(Ord_id) from Ord_Ship_M where CompanyID="+CompanyID+" and CONVERT(date,EDate) between CONVERT(date,GETDATE()-6) and CONVERT(date,GETDATE())) as DC7, ";
        query+=" (select count(Ord_id) from Ord_Ship_M where CompanyID="+CompanyID+" and CONVERT(date,EDate)=CONVERT(date,GETDATE())) as DCtoday; ";
    }
    //End (3)
    //Start Customer(4)
    if(POSID!="null"){
        query+=" select count(VenderId) as Customer from UVendorsDefM where CompanyID="+CompanyID+" and GodownId="+POSID+"; ";
    }
    else{
        query+=" select count(VenderId) as Customer from UVendorsDefM where CompanyID="+CompanyID+"; ";
    }
    //End (4)
    //Start Supplier(5)
    if(POSID!="null"){
        query+=" select count(SCode) as Supplier from USuppliers where CompanyID="+CompanyID+" and GodownId="+POSID+"; ";
    }
    else{
        query+=" select count(SCode) as Supplier from USuppliers where CompanyID="+CompanyID+"; ";
    }
    //End (5)
    //Start Items(6)
    if(POSID!="null"){
        query+=" select count(itcode) Items from IItems where ItStatus=1 and CompanyID="+CompanyID+" and GodownId="+POSID+"; ";
    }
    else{
        query+=" select count(itcode) Items from IItems where ItStatus=1 and CompanyID="+CompanyID+"; ";
    }
    //End (6)
    //Start 6month graph (7)
    if(POSID!="null"){
        query+=" select t.GraphMonth,Sum(t.GRNAmount)GRNAmount,Sum(t.SOAmount)SOAmount,Sum(t.SIAmount)SIAmount from( ";
        query+=" select 'GRN'Form,DateName(MONTH,m.GDate) GraphMonth,sum(d.Amount) GRNAmount,0 SOAmount,0 SIAmount from IGRNM m ";
        query+=" inner join IGRND d on d.GRNID=m.GRNID ";
        query+=" where CONVERT(date,m.GDate) between Convert(date,dateadd(m, -6, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0))) ";
        query+=" and m.CompanyID="+CompanyID+" ";
        query+=" and m.GodownId="+POSID+" ";
        query+=" group by DateName(MONTH,m.GDate) ";
        query+=" union all ";
        query+=" select 'SO'Form,DateName(MONTH,m.SOrdDate) GraphMonth,0 GRNAmount,sum(d.NetAmt) SOAmount,0 SIAmount from SOrd_M m ";
        query+=" inner join S_ord_Det d on d.S_Ord_id=m.S_Ord_id ";
        query+=" where CONVERT(date,m.SOrdDate) between Convert(date,dateadd(m, -6, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0))) ";
        query+=" and m.CompanyID="+CompanyID+" ";
        query+=" and m.Posid="+POSID+" ";
        query+=" group by DateName(MONTH,m.SOrdDate) ";
        query+=" union all  ";
        query+=" select 'SI'Form,DateName(MONTH,m.PayDateTime) GraphMonth,0 GRNAmount,0 SOAmount,sum(d.TotAmt) SIAmount from ARM_Payment_M m ";
        query+=" inner join ARM_Payment_D d on d.PayID=m.PayID ";
        query+=" where CONVERT(date,m.PayDateTime) between Convert(date,dateadd(m, -6, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0))) ";
        query+=" and m.CompanyID="+CompanyID+" ";
        query+=" and m.POSID="+POSID+" ";
        query+=" group by DateName(MONTH,m.PayDateTime))t ";
        query+=" group by t.GraphMonth; ";
    }
    else{
        query+=" select t.MonthDigit,t.GraphMonth,Sum(t.GRNAmount)GRNAmount,Sum(t.SOAmount)SOAmount,Sum(t.SIAmount)SIAmount from( ";
        query+=" select 'GRN'Form,Month(m.GDate) MonthDigit,DateName(MONTH,m.GDate) GraphMonth,sum(d.Amount) GRNAmount,0 SOAmount,0 SIAmount from IGRNM m ";
        query+=" inner join IGRND d on d.GRNID=m.GRNID ";
        query+=" where CONVERT(date,m.GDate) between Convert(date,dateadd(m, -6, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0))) ";
        query+=" and m.CompanyID="+CompanyID+" ";
        query+=" group by Month(m.GDate),DateName(MONTH,m.GDate) ";
        query+=" union all ";
        query+=" select 'SO'Form,Month(m.SOrdDate) MonthDigit,DateName(MONTH,m.SOrdDate) GraphMonth,0 GRNAmount,sum(d.NetAmt) SOAmount,0 SIAmount from SOrd_M m ";
        query+=" inner join S_ord_Det d on d.S_Ord_id=m.S_Ord_id ";
        query+=" where CONVERT(date,m.SOrdDate) between Convert(date,dateadd(m, -6, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0))) ";
        query+=" and m.CompanyID="+CompanyID+" ";
        query+=" group by Month(m.SOrdDate),DateName(MONTH,m.SOrdDate) ";
        query+=" union all  ";
        query+=" select 'SI'Form,Month(m.PayDateTime) MonthDigit,DateName(MONTH,m.PayDateTime) GraphMonth,0 GRNAmount,0 SOAmount,sum(d.TotAmt) SIAmount from ARM_Payment_M m ";
        query+=" inner join ARM_Payment_D d on d.PayID=m.PayID ";
        query+=" where CONVERT(date,m.PayDateTime) between Convert(date,dateadd(m, -6, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0))) ";
        query+=" and m.CompanyID="+CompanyID+" ";
        query+=" group by Month(m.PayDateTime),DateName(MONTH,m.PayDateTime))t ";
        query+=" group by t.MonthDigit,t.GraphMonth; ";
    }
    //End (7)
    //Start Revenue & Expense (8)
    if(POSID!="null"){
        query+=" Select t.YearDigit,t.MonthDigit,t.MnthName,sum(t.Revenue)Revenue,sum(t.Expense)Expense from(  ";
        query+=" SElect year(j.JRTRANDATE)YearDigit,Month(j.JRTRANDATE)MonthDigit,isnull(Sum(Jd.Jrdr- Jd.Jrcr),0)*-1 Revenue,0 Expense,DateName(MONTH,j.JRTRANDATE) MnthName from JOURNAL J, JOURNALDT JD   ";
        query+=" Where J.JRVID=JD.JRVID and J.POSID=JD.POSID and AcNo in (Select AcNo from ACLIST where AcClass=4) and j.CompanyId="+CompanyID+" and j.POSID="+POSID+" ";
        query+=" and  CONVERT(date,j.JRTRANDATE) between Convert(date,dateadd(m, -12, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0)))  ";
        query+=" group by year(j.JRTRANDATE),Month(j.JRTRANDATE),DateName(MONTH,j.JRTRANDATE)  ";
        query+=" union all  ";
        query+=" SElect year(j.JRTRANDATE)YearDigit,Month(j.JRTRANDATE)MonthDigit,0 Revenue,isnull(Sum(Jd.Jrdr- Jd.Jrcr),0) Expense,DateName(MONTH,j.JRTRANDATE) MnthName from JOURNAL J, JOURNALDT JD   ";
        query+=" Where J.JRVID=JD.JRVID and J.POSID=JD.POSID and AcNo in (Select AcNo from ACLIST where AcClass=5) and j.CompanyId="+CompanyID+"  and j.POSID="+POSID+" ";
        query+=" and  CONVERT(date,j.JRTRANDATE) between Convert(date,dateadd(m, -12, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0)))  ";
        query+=" group by year(j.JRTRANDATE),Month(j.JRTRANDATE),DateName(MONTH,j.JRTRANDATE)  ";
        query+=" )t  ";
        query+=" group by t.YearDigit,t.MonthDigit,t.MnthName ";
    }
    else{
        query+=" Select t.YearDigit,t.MonthDigit,t.MnthName,sum(t.Revenue)Revenue,sum(t.Expense)Expense from(  ";
        query+=" SElect year(j.JRTRANDATE)YearDigit,Month(j.JRTRANDATE)MonthDigit,isnull(Sum(Jd.Jrdr- Jd.Jrcr),0)*-1 Revenue,0 Expense,DateName(MONTH,j.JRTRANDATE) MnthName from JOURNAL J, JOURNALDT JD   ";
        query+=" Where J.JRVID=JD.JRVID and J.POSID=JD.POSID and AcNo in (Select AcNo from ACLIST where AcClass=4) and j.CompanyId="+CompanyID+" ";
        query+=" and  CONVERT(date,j.JRTRANDATE) between Convert(date,dateadd(m, -12, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0)))  ";
        query+=" group by year(j.JRTRANDATE),Month(j.JRTRANDATE),DateName(MONTH,j.JRTRANDATE)  ";
        query+=" union all  ";
        query+=" SElect year(j.JRTRANDATE)YearDigit,Month(j.JRTRANDATE)MonthDigit,0 Revenue,isnull(Sum(Jd.Jrdr- Jd.Jrcr),0) Expense,DateName(MONTH,j.JRTRANDATE) MnthName from JOURNAL J, JOURNALDT JD   ";
        query+=" Where J.JRVID=JD.JRVID and J.POSID=JD.POSID and AcNo in (Select AcNo from ACLIST where AcClass=5) and j.CompanyId="+CompanyID+" ";
        query+=" and  CONVERT(date,j.JRTRANDATE) between Convert(date,dateadd(m, -12, getdate() - datepart(d, getdate()) + 1)) and Convert(date,DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, getdate()) + 1, 0)))  ";
        query+=" group by year(j.JRTRANDATE),Month(j.JRTRANDATE),DateName(MONTH,j.JRTRANDATE)  ";
        query+=" )t  ";
        query+=" group by t.YearDigit,t.MonthDigit,t.MnthName ";
    }
     new sql.connect(config).then(pool=> {   
            return pool.request()
                    .query(query,[1,2])
                    .then(result => {
                     res.send({
                         PurchaseOrderDash: result.recordsets[0],
                         GoodsReceiptNodeDash:result.recordsets[1],
                         SaleOrderDash:result.recordsets[2],
                         DeliveryChallanDash:result.recordsets[3],
                         CustomerDash:result.recordsets[4],
                         SupplierDash:result.recordsets[5],
                         ItemsDash:result.recordsets[6],
                         SixMonthSaleGraphDash:result.recordsets[7],
                         ExpenseRevenueDash:result.recordsets[8]
                        });
                    })
                    .catch(err => {
                        res.send(err);
                    })
                })
});
module.exports = router;