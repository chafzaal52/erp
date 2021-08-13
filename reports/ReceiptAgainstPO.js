var express = require('express');
var router = express.Router();

const connectionString=  require('../routes/db');
const sql = connectionString.sql;
var config = connectionString.config;

router.get('/', function (req, res, next) {
    res.send("Stock in hand summary report worked");
});

router.get('/Report/:DateFrom/:DateTo/:POSID/:PONO/:SCode/:ItCode/:CompanyID/:BrandID', function (req, res, next) {
    let DateFrom= req.params.DateFrom;
    let DateTo= req.params.DateTo;
    let POSID= req.params.POSID;
    let PONO= req.params.PONO;
    let SCode= req.params.SCode;
    let ItCode= req.params.ItCode;
    let CompanyID= req.params.CompanyID;
    let BrandID= req.params.BrandID;
    let query=" select ff Filter,0 outstandstatus ,  Pono,POMaxno,SepNo,[Date],MaxNO,InvoiceNo,DeliveryNo,DeliveryDate,Supplier,ItemCode,ithead,ModelNo,BrandName,Unit,PoQty,AppQty,RejQty,Rate,tax,Terms,Phaseno  ";
    query+=" from (SELECT 0 ff, ppom.pono ,Ppom.MaxNo POMaxno ,sepNo, PPOM.PoDate AS Date ,''MaxNO,'' InvoiceNo ,''DeliveryNo,'' DeliveryDate,USuppliers.SName AS Supplier,IItems.ItCodeD AS ItemCode , ";
    query+=" iitems.ithead,IBinCard.LeastTime as ModelNo,IBinCard.BrandName,IMearsuringUnits.UnitDescrp AS Unit, PPOD.Qty AS PoQty ,0 AppQty,0 RejQty ,PPOD.UnitPrice AS Rate,case when saletex<>0 then (Saletex) /100*(amount) else 0 end tax , ";
    query+=" case when OrderStatus=0 then 'CREDIT' else 'CASH' end Terms,ppom.Phaseno  ";
    query+=" FROM PPOM  ";
    query+=" INNER JOIN PPOD ON PPOM.PONO = PPOD.PONO  ";
    query+=" INNER JOIN IItems  ON PPOD.ItCode = IItems.ItCode  ";
    query+=" inner join IBinCard on PPOD.ItCode=IBinCard.Itcode ";
    query+=" INNER JOIN  USuppliers ON PPOM.SCode = USuppliers.SCode  ";
    query+=" INNER JOIN  IMearsuringUnits ON PPOD.UnitCode = IMearsuringUnits.ID   ";
    query+=" WHERE  ";
    query+=" PPOM.PoDate Between '"+DateFrom+"'  AND  '"+DateTo+"'  ";
    query+=" and PPOM.godownid = PPOD.godownid and isnull(ppom.cstatus,0) = 0  ";
    query+=" And ppom.godownid="+POSID+" ";
    if(PONO!="null"){
    query+=" And PPOM.pono = "+PONO+" ";
    }
    if(BrandID!="null"){
        query+=" And IBinCard.mid = "+BrandID+" ";
    }
    if(SCode!="null"){
    query+=" And PPOM.scode = "+SCode+" ";
    }
    if(ItCode!="null"){
    query+=" And ppod.itcode in (select itcode from iitems Where ItL1 = "+ItCode+" Or ItL2 = "+ItCode+" Or ItL3 = "+ItCode+" Or ItL4 = "+ItCode+" Or ItL5 = "+ItCode+" Or ItL6 = "+ItCode+" ) ";
    }
    query+=" and PPOM.CompanyID="+CompanyID+" ";
    query+=" Union select 1 ff,(Select Top 1 PONo from igrnm igrnm1 Where igrnm1.GRNID=IGRND.GRNIDMain and igrnm1.GodownId=IGRND.GodownId) Filter ,  ";
    query+=" (Select Top 1 PONo from igrnm igrnm1 Where igrnm1.GRNID=IGRND.GRNIDMain and igrnm1.GodownId=IGRND.GodownId) AS [PO No],0 sepNo ,IGRNM.GDate AS Date, ";
    query+=" IGRNM.MaxNo, IGRNM.InvoiceNo AS InvoiceNo, IGRNM.DeliveryNo AS DeliveryNo ,IGRNM.DeliveryDate AS DeliveryDate , ";
    query+=" (select top 1 (sname) from usuppliers where scode=IGRNM.SCode)PartyName, ";
    query+=" IItems.ItCodeD AS ItemCode,iitems.ithead ,IBinCard.LeastTime as ModelNo,IBinCard.BrandName,IMearsuringUnits.UnitDescrp AS Unit,0 PoQty ,IGRND.AppQty AS [App.Qty], IGRND.RejQty AS [Rej.Qty], IGRND.CurrRate AS [Curr Rate] ,StaxPayable Tax, ";
    query+=" case when istaxable=0 then 'Not Taxable' else 'Taxable' end status  ,(Select Gname from SGodown where Whno=IGRNM.GodownId) Phaseno   ";
    query+=" From IGRNM_Pur IGRNM   ";
    query+=" INNER JOIN IGRND_Pur IGRND   ON IGRNM.GRNID = IGRND.GRNID  ";
    query+=" INNER JOIN IItems ON IGRND.ItCode = IItems.ItCode  ";
    query+=" inner join IBinCard on IGRND.ItCode=IBinCard.Itcode ";
    query+=" INNER JOIN  IMearsuringUnits ON IGRND.UnitCode = IMearsuringUnits.ID   ";
    query+=" WHERE isnull(IGRNM.Cancelstatus,0)=0  and IGRNM.godownid = IGRND.godownid   ";
    query+=" and IGRNM.GDate Between '"+DateFrom+"'  AND  '"+DateTo+"'  ";
    query+=" And IGRNM.godownid="+POSID+" ";
    if(BrandID!="null"){
        query+=" And IBinCard.mid = "+BrandID+" ";
    }
    if(SCode!="null"){
        query+=" And IGRNM.SCode = "+SCode+" ";
        }
    query+=" and IGRNM.CompanyID="+CompanyID+" ";
    if(PONO!="null"){
    query+=" and (Select Top 1 PONo from igrnm igrnm1 Where igrnm1.GRNID=IGRND.GRNIDMain and igrnm1.GodownId=IGRND.GodownId) = "+PONO+" ";
    }
    query+=" ) a  ";
    query+=" WHERE [Date] Between '"+DateFrom+"'  AND  '"+DateTo+"'  ";
    if(ItCode!="null"){
    query+=" And a.ItemCode in (select itcoded from iitems where itl1 = "+ItCode+" or itl2 = "+ItCode+" or itl3 = "+ItCode+" or itl4 = "+ItCode+" or itl5 = "+ItCode+" or itl6 = "+ItCode+") ";
    }
    query+=" --and a.Supplier='ALLIED AXIOM CHEMICAL PVT LTD'  ";
    query+=" order by  pono,filter  ,[Date],ithead ";
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